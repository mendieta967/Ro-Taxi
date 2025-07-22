import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { createRide, createPrice } from "../../../services/ride";

// Iconos personalizados para origen y destino
const originIcon = new L.Icon({
  iconUrl:
    "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
const destinationIcon = new L.Icon({
  iconUrl:
    "https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers@master/img/marker-icon-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Fix Leaflet marker icon issue en React
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import MapPanel from "./MapPanel";
import Loader from "../Loader";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function SetViewOnClick({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.setView(coords, 15);
    }
  }, [coords, map]);
  return null;
}

const MapView = ({ cancel }) => {
  const [position, setPosition] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [inputValues, setInputValues] = useState({
    origin: "",
    destination: "",
    date: "",
    time: "",
  });
  const [searchResults, setSearchResults] = useState([]);
  const [activeInput, setActiveInput] = useState("origin"); // 'origin' o 'destination'
  const [routeCoords, setRouteCoords] = useState([]); // Coordenadas de la ruta OSRM
  const [currentLocation, setCurrentLocation] = useState(null);
  const inputOriginRef = useRef();
  const inputDestinationRef = useRef();
  const [mapLoading, setMapLoading] = useState(true);
  const [estimatedPrice, setEstimatedPrice] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Get current location
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setPosition(coords);
        setCurrentLocation(coords);
        const params = new URLSearchParams({
          lat: coords.lat,
          lon: coords.lng,
          format: "json",
          addressdetails: 1,
        });
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?${params}`
        );

        const data = await response.json();
        handleSelect(data);
      },
      async () => {
        // Si el usuario no da permiso, usamos IP geolocation
        try {
          const res = await fetch("http://ip-api.com/json/");
          const data = await res.json();
          const coords = { lat: data.lat, lng: data.lon };
          setPosition(coords);
          setCurrentLocation(coords);
        } catch (e) {
          console.log(e);
          // Si falla, usa Buenos Aires como fallback
          const coords = { lat: -34.6037, lng: -58.3816 };
          setPosition(coords);
          setCurrentLocation(coords);
          handleSelect({
            lat: coords.lat,
            lon: coords.lng,
            display_name: "Ubicación por defecto",
          });
        }
      }
    );
  }, []);

  const handleInputChange = (input, value) => {
    setInputValues({
      ...inputValues,
      [input]: value,
    });
  };

  const handleActiveInput = (input) => {
    setActiveInput(input);
  };

  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  // Selección de sugerencia
  // Helper para obtener texto principal (calle y altura o nombre)
  const getShortAddress = (place) => {
    const a = place.address || {};
    if (a.road && a.house_number) return `${a.road} ${a.house_number}`;
    if (a.road) return a.road;
    if (a.neighbourhood) return a.neighbourhood;
    if (a.suburb) return a.suburb;
    if (a.city) return a.city;
    return place.display_name.split(",")[0];
  };

  // Helper para barrio/zona
  const getZone = (place) => {
    const a = place.address || {};
    return a.neighbourhood || a.suburb || "";
  };

  const handleSelect = (place) => {
    const punto = {
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lon),
      display_name: place.display_name,
      short_name: getShortAddress(place),
      zone: getZone(place),
    };
    if (activeInput === "origin") {
      setOrigin(punto);
      handleInputChange(
        "origin",
        punto.short_name + (punto.zone ? ` (${punto.zone})` : "")
      );
      setPosition({ lat: punto.lat, lng: punto.lng });
      setActiveInput("destination");
    } else {
      setDestination(punto);
      handleInputChange(
        "destination",
        punto.short_name + (punto.zone ? ` (${punto.zone})` : "")
      );
      setPosition({ lat: punto.lat, lng: punto.lng });
      setActiveInput(null);
    }
    setSearchResults([]);
  };

  // Click en el mapa para seleccionar origen o destino
  const handleMapClick = async (lat, lng) => {
    try {
      const params = new URLSearchParams({
        lat,
        lon: lng,
        format: "json",
        addressdetails: 1,
      });
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?${params}`
      );
      const data = await res.json();

      handleSelect(data);
    } catch (err) {
      console.log(err);
    }
    setSearchResults([]);
  };

  // Obtener ruta real entre origen y destino usando OSRM
  useEffect(() => {
    const getRoute = async () => {
      if (origin && destination) {
        const url = `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`;
        try {
          const res = await fetch(url);
          const data = await res.json();
          if (data.routes && data.routes.length > 0) {
            setRouteCoords(
              data.routes[0].geometry.coordinates.map(([lng, lat]) => [
                lat,
                lng,
              ])
            );
          } else {
            setRouteCoords([]);
          }
        } catch {
          setRouteCoords([]);
        }
      } else {
        setRouteCoords([]);
      }
    };
    getRoute();
  }, [origin, destination]);

  const handleEstimateAndShowModal = async () => {
    try {
      if (!origin || !destination) {
        alert("Por favor, seleccione origen y destino");
        return;
      }

      if (!inputValues.date || !inputValues.time) {
        alert("Por favor, seleccione fecha y hora");
        return;
      }

      const priceRequest = {
        originLat: origin.lat,
        originLng: origin.lng,
        destLat: destination.lat,
        destLng: destination.lng,
      };

      const priceResponse = await createPrice(priceRequest);

      if (!priceResponse || !priceResponse.estimatedPrice) {
        alert("No se pudo calcular el precio");
        return;
      }

      setEstimatedPrice(priceResponse.estimatedPrice);
      setShowModal(true); // 👉 Mostrar modal acá
    } catch (err) {
      console.error("Error al estimar precio:", err);
      alert("Hubo un error al calcular el precio.");
    }
  };

  const handleScheduleRide = async () => {
    try {
      if (!origin || !destination || !inputValues.date || !inputValues.time) {
        alert("Por favor, complete todos los campos");
        return;
      }

      if (!estimatedPrice) {
        alert("Primero debes calcular el precio");
        return;
      }

      const rideData = {
        OriginAddress: inputValues.origin,
        OriginLat: origin.lat,
        OriginLng: origin.lng,
        DestinationAddress: inputValues.destination,
        DestinationLat: destination.lat,
        DestinationLng: destination.lng,
        ScheduledAt: `${inputValues.date}T${inputValues.time}:00.000Z`,
        CalculatedPrice: estimatedPrice,
      };

      const rideResponse = await createRide(rideData);
      console.log("Viaje creado:", rideResponse);
      alert("¡Viaje programado exitosamente!");
      window.location.reload();
    } catch (err) {
      if (err.response) {
        console.error("Error backend:", err.response.data);
        alert("Error: " + JSON.stringify(err.response.data));
      } else {
        console.error(err);
        alert("Error inesperado");
      }
    }
  };

  return (
    <div className="w-full h-full relative">
      <MapPanel
        handleSelect={handleSelect}
        inputOriginRef={inputOriginRef}
        inputDestinationRef={inputDestinationRef}
        inputValues={inputValues}
        handleInputChange={handleInputChange}
        handleActiveInput={handleActiveInput}
        activeInput={activeInput}
        handleSearchResults={handleSearchResults}
        searchResults={searchResults}
        handleScheduleRide={handleScheduleRide}
        currentLocation={currentLocation}
        handleEstimateAndShowModal={handleEstimateAndShowModal}
        showModal={showModal}
        setShowModal={setShowModal}
        estimatedPrice={estimatedPrice}
        cancel={cancel}
      />

      {mapLoading && <Loader />}

      <MapContainer
        center={position}
        zoom={15}
        className="w-full h-screen"
        zoomControl={false} // Oculta los botones de zoom
        whenCreated={(mapInstance) => {
          // Oculta el control de zoom si por alguna razón aparece
          mapInstance.zoomControl.remove();
        }}
        onclick={null} // placeholder, será reemplazado por un handler personalizado
      >
        <TileLayer
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
          eventHandlers={{
            load: () => setMapLoading(false),
          }}
        />
        {origin && (
          <Marker
            position={{ lat: origin.lat, lng: origin.lng }}
            icon={originIcon}
          >
            <Popup>
              <b>Origen</b>
              <br />
              {origin.short_name}
              {origin.zone ? (
                <span className="text-gray-400"> ({origin.zone})</span>
              ) : null}
            </Popup>
          </Marker>
        )}
        {destination && (
          <Marker
            position={{ lat: destination.lat, lng: destination.lng }}
            icon={destinationIcon}
          >
            <Popup>
              <b>Destino</b>
              <br />
              {destination.short_name}
              {destination.zone ? (
                <span className="text-gray-400"> ({destination.zone})</span>
              ) : null}
            </Popup>
          </Marker>
        )}
        {/* Polyline de la ruta real entre origen y destino */}
        {origin && destination && routeCoords.length > 0 && (
          <Polyline
            positions={routeCoords}
            color="#FFD600"
            weight={6}
            opacity={0.9}
          />
        )}
        <SetViewOnClick coords={position} />
        <MapClickHandler onMapClick={handleMapClick} />
      </MapContainer>
    </div>
  );
};

// Handler para click en el mapa
function MapClickHandler({ onMapClick }) {
  const map = useMap();
  useEffect(() => {
    const onClick = (e) => {
      const { lat, lng } = e.latlng;
      onMapClick(lat, lng);
    };
    map.on("click", onClick);
    return () => {
      map.off("click", onClick);
    };
  }, [map, onMapClick]);
  return null;
}

export default MapView;
