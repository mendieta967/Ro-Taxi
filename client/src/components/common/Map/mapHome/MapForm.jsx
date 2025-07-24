import { useEffect, useState, useContext } from "react";
import MapSearch from "../MapSearch";
import MapSearchResult from "../MapSearchResult";
import ChatPassenger from "../../../../page/driver/chat/ChatPassenger";
import Modal from "../../../ui/Modal";
import { useTranslate } from "../../../../hooks/useTranslate";
import { ThemeContext } from "../../../../context/ThemeContext";

const MapForm = ({
  handleSelect,
  inputOriginRef,
  inputDestinationRef,
  activeInput,
  handleActiveInput,
  handleSearchResults,
  searchResults,
  inputValues,
  handleInputChange,
  handleEstimateAndShowModal,
  currentLocation,
  showModal,
  setShowModal,
  estimatedPrice,
  mapLoading,
  handleConfirm, //para llamar a la api
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
    activeInput === "origin" ? inputValues.origin : inputValues.destination,
    activeInput,
    currentLocation,
  ]);

  const [paymentMethod, setPaymentMethod] = useState("efectivo");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const translate = useTranslate();
  const { theme } = useContext(ThemeContext);

  const handlePedirTaxi = async () => {
    setShowModal(false);
    handleConfirm();
    setShowRequestModal(true);

    setTimeout(() => {
      setShowRequestModal(false);
      setShowConfirmationModal(true);
    }, 2000);
  };

  const handleCancel = () => {
    setShowCancelConfirmation(true);
  };

  const handleConfirmCancel = () => {
    inputValues.origin = "";
    inputValues.destination = "";
    console.clear();
    setShowCancelConfirmation(false);
    setShowConfirmationModal(false);
    setShowRequestModal(false);
    setShowModal(false);
  };

  const handleShowChat = () => {
    setShowConfirmationModal(false);
    setShowChat(true);
  };
  return (
    <div className="w-80 max-w-md mx-auto md:max-w-xl lg:max-w-2xl h-auto max-h-[90vh] md:h-[500px] overflow-hidden p-6 bg-zinc-900 shadow-lg rounded-lg">
      {/* Contenedor principal */}
      <div className="flex flex-col h-full">
        {/* Contenedor de Inputs o Chat */}
        {showChat ? (
          <div className="flex flex-col h-100 rounded-lg overflow-hidden border border-zinc-700">
            <ChatPassenger />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Inputs de dirección */}
            <div className="space-y-4">
              {/* Input Origen */}
              <div className="relative">
                <MapSearch
                  type="origin"
                  title="Origen"
                  ref={inputOriginRef}
                  activeInput={activeInput}
                  handleActiveInput={handleActiveInput}
                  handleInputChange={handleInputChange}
                  value={inputValues.origin}
                />
                {activeInput === "origin" &&
                  (mapLoading || (searchResults.length > 0 && !mapLoading)) && (
                    <div className="absolute z-20 top-full left-0 right-0 max-h-60 bg-zinc-900 rounded-md shadow-lg border border-zinc-700 overflow-y-auto mt-1">
                      {mapLoading ? (
                        <div className="flex items-center justify-center h-16">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500"></div>
                        </div>
                      ) : (
                        <MapSearchResult
                          handleSelect={handleSelect}
                          searchResults={searchResults}
                        />
                      )}
                    </div>
                  )}
              </div>

              {/* Input Destino */}
              <div className="relative">
                <MapSearch
                  type="destination"
                  title="Destino"
                  ref={inputDestinationRef}
                  activeInput={activeInput}
                  handleActiveInput={handleActiveInput}
                  handleInputChange={handleInputChange}
                  value={inputValues.destination}
                />
                {activeInput === "destination" &&
                  (mapLoading || (searchResults.length > 0 && !mapLoading)) && (
                    <div className="absolute z-20 top-full left-0 right-0 max-h-60 bg-zinc-900 rounded-md shadow-lg border border-zinc-700 overflow-y-auto mt-1">
                      {mapLoading ? (
                        <div className="flex items-center justify-center h-16">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500"></div>
                        </div>
                      ) : (
                        <MapSearchResult
                          handleSelect={handleSelect}
                          searchResults={searchResults}
                        />
                      )}
                    </div>
                  )}
              </div>
            </div>

            {/* Botón de confirmación */}
            <div className="flex justify-center pt-2">
              <button
                onClick={handleEstimateAndShowModal}
                disabled={!inputValues.origin || !inputValues.destination}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-300 ${
                  !inputValues.origin || !inputValues.destination
                    ? "bg-yellow-300 text-black opacity-60 cursor-not-allowed"
                    : "bg-yellow-500 hover:bg-yellow-400 text-black"
                }`}
              >
                {translate("Confirmar")}
              </button>
            </div>
          </div>
        )}

        {/* Modal Pedir taxi */}
        {showModal && (
          <Modal onClose={() => setShowModal(false)}>
            {/* Encabezado del precio */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full mb-4 shadow-lg">
                <span className="text-2xl">💰</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {translate("Precio estimado")}
              </h2>
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-2xl p-6 border border-yellow-200 dark:border-yellow-800">
                <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-amber-600 dark:from-yellow-400 dark:to-amber-400">
                  ${estimatedPrice}
                </p>
              </div>
            </div>

            {/* Selección de método de pago */}
            <div className="mb-8">
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setPaymentMethod("efectivo")}
                  className={`group relative overflow-hidden cursor-pointer py-4 px-6 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                    paymentMethod === "efectivo"
                      ? "bg-gradient-to-r from-yellow-500 to-amber-500 text-black shadow-xl shadow-yellow-500/25 ring-2 ring-yellow-400"
                      : "bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700 border-2 border-gray-200 dark:border-zinc-600 hover:border-yellow-300 dark:hover:border-yellow-600"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-sm font-bold">
                      {translate("Efectivo")}
                    </span>
                  </div>
                  {paymentMethod === "efectivo" && (
                    <div className="absolute top-2 right-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </button>

                <button
                  onClick={() => setPaymentMethod("tarjeta")}
                  className={`group relative overflow-hidden cursor-pointer py-4 px-6 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                    paymentMethod === "tarjeta"
                      ? "bg-gradient-to-r from-yellow-500 to-amber-500 text-black shadow-xl shadow-yellow-500/25 ring-2 ring-yellow-400"
                      : "bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700 border-2 border-gray-200 dark:border-zinc-600 hover:border-yellow-300 dark:hover:border-yellow-600"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-sm font-bold">
                      {translate("Tarjeta")}
                    </span>
                  </div>
                  {paymentMethod === "tarjeta" && (
                    <div className="absolute top-2 right-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Botón principal */}
            <div className="space-y-4">
              <button
                onClick={handlePedirTaxi}
                className="group relative w-full cursor-pointer py-4 px-6 rounded-2xl bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 hover:from-yellow-500 hover:via-yellow-600 hover:to-amber-600 text-black font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl shadow-yellow-500/25 hover:shadow-yellow-500/40"
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl group-hover:animate-bounce">
                    🚖
                  </span>
                  <span>{translate("Pedir Ahora")}</span>
                  <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </button>

              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                {translate(
                  "Al confirmar aceptas nuestros términos y condiciones"
                )}
              </p>
            </div>
          </Modal>
        )}
        {showRequestModal && (
          <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-zinc-900 w-[90%] max-w-sm rounded-2xl p-6 text-white text-center">
              <div className="text-4xl mb-4 animate-spin">🚕</div>
              <h2 className="text-xl font-bold">
                {translate("Buscando un taxi cercano")}...
              </h2>
              <p className="text-zinc-400 mt-2">
                {translate("Esto tomará unos segundos")}
              </p>
            </div>
          </div>
        )}
        {/* Modal de confirmación */}
        {showConfirmationModal && (
          <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div
              className={` w-[90%] max-w-md rounded-2xl p-6 space-y-4 text-white shadow-xl relative ${
                theme === "dark"
                  ? "bg-zinc-900"
                  : "bg-white border border-yellow-500"
              }`}
            >
              <div className="flex justify-center">
                <div
                  className={`w-16 h-16  rounded-full flex items-center justify-center text-3xl ${
                    theme === "dark" ? "bg-green-800" : "bg-green-800"
                  }`}
                >
                  ⏱️
                </div>
              </div>

              <h2
                className={`text-2xl font-bold text-center ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {translate("¡Tu taxi está en camino!")}
              </h2>
              <p
                className={`text-center text-zinc-400 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {translate("Llegada estimada")}: 3 minutos
              </p>

              <div
                className={`flex items-center gap-4 p-4 rounded-lg ${
                  theme === "dark"
                    ? "bg-zinc-800"
                    : "bg-white border border-yellow-500"
                }`}
              >
                <div>
                  <p
                    className={`font-semibold ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Juan Rodríguez{" "}
                    <span className="text-yellow-500">★ 4.8</span>
                  </p>
                  <p
                    className={`text-sm ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Toyota Corolla • XYZ-123 • Azul
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleShowChat}
                  className={`flex-1 py-2 border rounded-lg cursor-pointer ${
                    theme === "dark"
                      ? "bg-zinc-800 border-zinc-700  hover:bg-zinc-800 "
                      : "bg-yellow-500 border border-yellow-600 hover:bg-yellow-400 "
                  }`}
                >
                  {translate("Confirmar")}
                </button>
                <button
                  onClick={() => handleCancel()}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-500 rounded-lg cursor-pointer"
                >
                  {translate("Cancelar")}
                </button>
              </div>

              {/* Modal de confirmación de cancelación */}
              {showCancelConfirmation && (
                <Modal onClose={() => setShowCancelConfirmation(false)}>
                  <h2
                    className={`${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    } text-xl font-bold`}
                  >
                    {translate("Confirmar Cancelación")}
                  </h2>
                  <p
                    className={`${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    } text-sm mb-4`}
                  >
                    {translate("¿Estás seguro que deseas cancelar tu viaje?")}
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowCancelConfirmation(false)}
                      className={`flex-1 py-2 rounded-lg cursor-pointer ${
                        theme === "dark"
                          ? "bg-zinc-800 hover:bg-zinc-700"
                          : "bg-gray-200 hover:bg-gray-300"
                      }`}
                    >
                      {translate("Cancelar")}
                    </button>
                    <button
                      onClick={handleConfirmCancel}
                      className={`flex-1 py-2 bg-red-600 hover:bg-red-500 rounded-lg cursor-pointer`}
                    >
                      {translate("Confirmar")}
                    </button>
                  </div>
                </Modal>
              )}

              <div
                className={`p-3 rounded-lg text-sm ${
                  theme === "dark"
                    ? "bg-zinc-800"
                    : "bg-white border border-yellow-500"
                }`}
              >
                <strong
                  className={`${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {translate("¡Taxi en camino!")}
                </strong>
                <p
                  className={`${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {translate(
                    "Tu conductor llegará en aproximadamente 3 minutos"
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapForm;
