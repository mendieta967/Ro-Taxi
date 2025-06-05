import { useEffect, useState } from "react";
import MapSearch from "./MapSearch";
import MapSearchResult from "./MapSearchResult";
import Modal from "../../ui/Modal";
import { useTranslate } from "../../../hooks/useTranslate";

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
  const translate = useTranslate();

  return (
    <div className="absolute overflow-hidden z-[1100] top-0 bottom-0 left-6 my-10 w-[370px] max-w-[90vw] rounded-2xl bg-[#181B21] shadow-xl p-5 ">
      <div className="relative h-full flex flex-col gap-3 items-start">
        {/* Input Origen */}
        <MapSearch
          type="origin"
          title={translate("Origen")}
          ref={inputOriginRef}
          activeInput={activeInput}
          handleActiveInput={handleActiveInput}
          handleInputChange={handleInputChange}
          value={inputValues.origin}
        />
        {/* Input Destino */}
        <MapSearch
          type="destination"
          title={translate("Destino")}
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
            {translate("Fecha")}
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
            {translate("Hora")}
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
            {translate("Programar Viaje")}
          </button>
          <button
            onClick={cancel}
            className="mt-auto w-full py-3 rounded-xl bg-zinc-700 hover:bg-zinc-600 text-white font-medium text-base cursor-pointer transition-all"
          >
            {translate("Cancelar")}
          </button>
        </div>
        {showModal && (
          <Modal onClose={() => setShowModal(false)}>
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-lg max-w-md mx-auto">
              {/* Título */}
              <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-yellow-400 mb-6">
                Seleccione el método de pago
              </h1>

              {/* Selector de método de pago */}
              <div className="mb-6">
                <label
                  htmlFor="metodoPago"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Método de pago
                </label>
                <select
                  name="metodoPago"
                  id="metodoPago"
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-zinc-700 bg-yellow-100 dark:bg-zinc-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta</option>
                </select>
              </div>

              {/* Tarifa */}
              <div className="mb-6 text-center">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  La tarifa es de:{" "}
                  <span className="text-yellow-500 font-bold">$</span>
                </h2>
              </div>

              {/* Botones */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    handleScheduleRide();
                    cancel();
                    setShowModal(false);
                  }}
                  className="px-6 py-2 cursor-pointer rounded-lg bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition-all shadow hover:shadow-md"
                >
                  {translate("Confirmar")}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 cursor-pointer rounded-lg bg-zinc-700 text-white font-semibold hover:bg-zinc-600 transition-all shadow hover:shadow-md"
                >
                  {translate("Cancelar")}
                </button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default MapPanel;
