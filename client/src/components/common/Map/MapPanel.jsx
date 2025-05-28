import { useEffect, useState } from "react";
import MapSearch from "./MapSearch";
import MapSearchResult from "./MapSearchResult";

const MapPanel = ({
  handleSelect,
  inputOriginRef,
  inputDestinationRef,
  activeInput,
  handleActiveInput,
  handleSearchResults,
  searchResults,
  inputValues,
  handleInputChange,
  handleSubmit,
  currentLocation,
}) => {
  const [loading, setLoading] = useState(true);

  function getDistance(lat1, lon1, lat2, lon2) {
    function toRad(x) {
      return (x * Math.PI) / 180;
    }
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  useEffect(() => {
    const search =
      activeInput === "origin" ? inputValues.origin : inputValues.destination;
    const handler = setTimeout(() => {
      setLoading(true);
      if (search.length > 2) {
        const params = new URLSearchParams({
          q: search,
          format: "json",
          addressdetails: 1,
          limit: 10,
        });
        fetch("https://nominatim.openstreetmap.org/search?" + params)
          .then((res) => res.json())
          .then((data) => {
            if (currentLocation && Array.isArray(data)) {
              data.sort((a, b) => {
                const d1 = getDistance(
                  currentLocation.lat,
                  currentLocation.lng,
                  parseFloat(a.lat),
                  parseFloat(a.lon)
                );
                const d2 = getDistance(
                  currentLocation.lat,
                  currentLocation.lng,
                  parseFloat(b.lat),
                  parseFloat(b.lon)
                );
                return d1 - d2;
              });
            }
            handleSearchResults(data);
          })
          .catch(() => handleSearchResults([]))
          .finally(() => {
            setLoading(false);
          });
      } else {
        handleSearchResults([]);
        setLoading(false);
      }
    }, 400); // 400ms debounce
    return () => clearTimeout(handler);
  }, [inputValues.origin, inputValues.destination, activeInput]);

  return (
    <div className="absolute z-[1100] top-0 bottom-0 left-6  my-10 w-[370px] max-w-[90vw] rounded-2xl bg-[#181B21] shadow-xl p-5 flex flex-col gap-2.5 items-start">
      {/* Input Origen */}
      <MapSearch
        type="origin"
        title="Origen"
        ref={inputOriginRef}
        activeInput={activeInput}
        handleActiveInput={handleActiveInput}
        handleInputChange={handleInputChange}
        value={inputValues.origin}
      />
      {/* Input Destino */}
      <MapSearch
        type="destination"
        title="Destino"
        ref={inputDestinationRef}
        activeInput={activeInput}
        handleActiveInput={handleActiveInput}
        handleInputChange={handleInputChange}
        value={inputValues.destination}
      />
      {/* Resultados */}
      {activeInput && !loading && (
        <MapSearchResult
          handleSelect={handleSelect}
          searchResults={searchResults}
        />
      )}
      {/* Botón Programar viaje */}
      <button
        onClick={handleSubmit}
        className="mt-auto w-full py-3 rounded-xl bg-yellow-400 text-[#23262F] font-medium text-base hover:bg-yellow-300 transition-all"
      >
        Programar viaje
      </button>
    </div>
  );
};

export default MapPanel;
