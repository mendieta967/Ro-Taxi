import { useEffect, useState } from "react";
import MapSearch from "./MapSearch";
import MapSearchResult from "./MapSearchResult";
import Modal from "../../ui/Modal"

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
  handleScheduleRide,
  currentLocation,
  cancel,
  mapLoading, // Agregamos el estado de loading
}) => {
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
          .catch(() => handleSearchResults([]));
      } else {
        handleSearchResults([]);
      }
    }, 400); // 400ms debounce
    return () => clearTimeout(handler);
  }, [
    inputValues.origin,
    inputValues.destination,
    activeInput,
    currentLocation,
    handleSearchResults,
  ]);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="absolute overflow-hidden z-[1100] top-0 bottom-0 left-6 my-10 w-[370px] max-w-[90vw] rounded-2xl bg-[#181B21] shadow-xl p-5 ">
      <div className="relative h-full flex flex-col gap-3 items-start">
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
        {activeInput &&
          (mapLoading || (searchResults.length > 0 && !mapLoading)) && (
            <div className="absolute z-10 top-43 max-h-[240px] h-full left-0 right-0 bg-[#23262F] rounded">
              {mapLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <MapSearchResult
                  handleSelect={handleSelect}
                  searchResults={searchResults}
                />
              )}
            </div>
          )}

        {/* Fecha y hora */}
        <div className="w-full relative transition-all">
          <label
            className="text-yellow-400 font-semibold mb-1 text-sm block tracking-wide"
            htmlFor="date"
          >
            Fecha
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-yellow-400 text-xl">
              {/* Icono de calendario */}
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <rect
                  x="3"
                  y="5"
                  width="18"
                  height="16"
                  rx="2"
                  stroke="#FFD600"
                  strokeWidth="2"
                />
                <path
                  d="M16 3v4M8 3v4"
                  stroke="#FFD600"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path d="M3 9h18" stroke="#FFD600" strokeWidth="2" />
              </svg>
            </span>
            <input
              id="date"
              type="date"
              value={inputValues.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border border-[#23262F] shadow-md text-base outline-none bg-[#23262F] text-yellow-400 font-medium mb-0 transition-all`}
              autoComplete="off"
            />
          </div>
        </div>
        <div className="w-full relative transition-all ">
          <label
            className="text-yellow-400 font-semibold mb-1 text-sm block tracking-wide"
            htmlFor="time"
          >
            Hora
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-yellow-400 text-xl">
              {/* Icono de reloj */}
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#FFD600"
                  strokeWidth="2"
                />
                <path
                  d="M12 6v6l4 2"
                  stroke="#FFD600"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <input
              id="time"
              type="time"
              value={inputValues.time}
              onChange={(e) => handleInputChange("time", e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border border-[#23262F] shadow-md text-base outline-none bg-[#23262F] text-yellow-400 font-medium mb-0 transition-all`}
              autoComplete="off"
            />
          </div>
        </div>


        {/* Botón Programar viaje */}
        <div className="mt-auto w-full flex flex-col gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="mt-auto w-full py-3 rounded-xl bg-yellow-400 text-[#23262F] font-medium text-base hover:bg-yellow-300 cursor-pointer transition-all"
          >
            Programar viaje
          </button>
          <button
            onClick={cancel}
            className="mt-auto w-full py-3 rounded-xl bg-zinc-700 hover:bg-zinc-600 text-white font-medium text-base cursor-pointer transition-all"
          >
            Cancelar
          </button>
        </div>
        {showModal && (

    <Modal  onClose={() => setShowModal(false)}>
    <h2 className="text-xl text-center font-semibold text-yellow-500">¿Confirmar programación del viaje?</h2>
    <div className="flex justify-center  gap-4 mt-4">
      <button
        onClick={() => {
          handleScheduleRide();  // llama tu función
          cancel();
          setShowModal(false);  // cierra el modal
        }}
        className="px-4 cursor-pointer py-2 rounded bg-yellow-400 text-black hover:bg-yellow-300 transition-all"
      >
        Confirmar
      </button>
      <button
        onClick={() => setShowModal(false)}
        className="px-4 cursor-pointer py-2 rounded bg-zinc-700 text-white hover:bg-zinc-600 transition-all"
      >
        Cancelar
      </button>
    </div>
  </Modal>
)}

      </div>
    </div>
  );
};

export default MapPanel;
