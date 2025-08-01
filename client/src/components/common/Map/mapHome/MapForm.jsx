import { useEffect, useState, useContext } from "react";
import MapSearch from "../MapSearch";
import MapSearchResult from "../MapSearchResult";
import ChatPassenger from "../../../../page/driver/chat/ChatPassenger";
import Modal from "../../../ui/Modal";
import { useTranslate } from "../../../../hooks/useTranslate";
import { ThemeContext } from "../../../../context/ThemeContext";
import { useConnection } from "@/context/ConnectionContext";
import { Star } from "lucide-react";
import { ratingDriver, deleteRide } from "../../../../services/ride";
import { useRide } from "@/context/RideContext";

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
  handleConfirm,
  setShowInfo, //para llamar a la api
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
  const [showRateDriver, setShowRateDriver] = useState(false);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [idDriver, setidDriver] = useState(null);
  const [cancelId, setCancelId] = useState(null);

  const translate = useTranslate();
  const { on, invoke } = useConnection();
  const { theme } = useContext(ThemeContext);
  const { accepteRide, setAccepteRide } = useRide();

  const handlePedirTaxi = async () => {
    setShowModal(false);
    handleConfirm();
    setShowRequestModal(true);
  };

  const handleShowChat = () => {
    setShowConfirmationModal(false);
  };

  const resetState = () => {
    setAccepteRide(null);
    setShowRateDriver(false);
    setShowConfirmationModal(false);
    setShowRequestModal(false);
    setShowCancelConfirmation(false);
    setShowModal(false);
    setRating(0);
    setHovered(0);
    setidDriver(null);
    handleSearchResults([]);
    inputValues.origin = "";
    inputValues.destination = "";
  };

  const handleSubmit = async () => {
    if (!idDriver || rating === 0) {
      console.log("Falta ID del driver o calificación");
      return;
    }
    try {
      const response = await ratingDriver(idDriver, rating);
      console.log("enviando calificacion", response);
      resetState();
    } catch (err) {
      console.error("Error al enviar calificación:", err);
    }
  };

  useEffect(() => {
    on("RideAccepted", (ride) => {
      if (ride.status !== "Completed" && ride.status !== "Canceled") {
        setAccepteRide(ride);
        setShowRequestModal(false);
        setShowConfirmationModal(true);
        invoke("JoinRideGroup", ride.id)
          .then(() => console.log("Unido al grupo de ride:", ride.id))
          .catch((err) => console.error("Error al unirse al grupo:", err));
      } else {
        // Si el viaje ya está completado o cancelado, no lo seteamos
        setAccepteRide(null);
      }
    });

    on("ridecanceled", (rideId) => {
      console.log("El viaje fue cancelado :(", rideId);
      invoke("LeaveRideGroup", rideId);
      setCancelId(true);
      setAccepteRide(null);
    });

    // 🚨 Aca manejamos finalización
    on("RideCompleted", (rideId) => {
      console.log("El viaje fue completado", rideId);
      invoke("LeaveRideGroup", rideId);
      setidDriver(rideId);
      setAccepteRide(null);
      setShowRateDriver(true);
    });
  }, []);
  // Efecto para reaccionar al cambio de showConfirmationModal
  useEffect(() => {
    if (showConfirmationModal === false) {
      setShowInfo(true);
    } else {
      setShowInfo(false);
    }
  }, [showConfirmationModal]);

  const handleCancel = async () => {
    if (!accepteRide.id) {
      console.log("Falta ID del driver");
      return;
    }

    try {
      console.log("Cancelando viaje con ID:", accepteRide.id);
      const responseCancelViaje = await deleteRide(accepteRide.id);
      console.log("Viaje cancelado con éxito:", responseCancelViaje);
      resetState();
    } catch (error) {
      console.error("Error cancelando viaje:", error);
    }
  };
  useEffect(() => {
    console.log("accepteRide cambiado:", accepteRide);
  }, [accepteRide]);

  return (
    <div className="w-80 max-w-md mx-auto md:max-w-xl lg:max-w-2xl h-auto max-h-[90vh] md:h-[500px] overflow-hidden p-6 bg-zinc-900 shadow-lg ">
      {/* Contenedor principal */}
      <div className="flex flex-col h-full">
        {/* Contenedor de Inputs o Chat */}
        {accepteRide ? (
          <div className="flex flex-col h-100 rounded-lg overflow-hidden border border-zinc-700">
            <ChatPassenger rideId={accepteRide.id} />
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
        {showConfirmationModal && accepteRide && (
          <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div
              className={` w-[90%] max-w-md rounded-2xl p-6 space-y-4 text-white shadow-xl relative ${
                theme === "dark"
                  ? "bg-zinc-900"
                  : "bg-white border border-yellow-500"
              }`}
            >
              <div className="relative space-y-8 p-6">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute top-10 left-10 w-32 h-32 bg-green-500/5 rounded-full blur-3xl animate-pulse"></div>
                  <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-500/3 rounded-full blur-3xl animate-pulse delay-500"></div>
                </div>

                {/* Header Section */}
                <div className="relative text-center space-y-6">
                  {/* Futuristic Icon Container */}
                  <div className="flex justify-center">
                    <div className="relative">
                      {/* Outer Ring */}
                      <div className="absolute inset-0 w-28 h-28 rounded-full border-2 border-green-500/30 animate-spin-slow"></div>
                      <div className="absolute inset-2 w-24 h-24 rounded-full border border-green-400/20 animate-pulse"></div>

                      {/* Main Icon Container */}
                      <div
                        className={`relative w-24 h-24 rounded-full flex items-center justify-center text-4xl backdrop-blur-xl border ${
                          theme === "dark"
                            ? "bg-gradient-to-br from-green-500/20 via-emerald-600/30 to-green-700/20 border-green-400/30 shadow-2xl shadow-green-500/20"
                            : "bg-gradient-to-br from-green-400/20 via-emerald-500/30 to-green-600/20 border-green-500/40 shadow-2xl shadow-green-400/30"
                        }`}
                      >
                        {/* Glow Effect */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400/20 to-emerald-500/20 blur-xl animate-pulse"></div>

                        {/* Icon */}
                        <span className="relative z-10 filter drop-shadow-lg">
                          ⏱️
                        </span>

                        {/* Inner Pulse */}
                        <div className="absolute inset-4 rounded-full bg-green-400/10 animate-ping"></div>
                      </div>

                      {/* Orbiting Dots */}
                      <div className="absolute inset-0 w-28 h-28">
                        <div className="absolute top-0 left-1/2 w-2 h-2 bg-green-400 rounded-full transform -translate-x-1/2 animate-pulse"></div>
                        <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-emerald-400 rounded-full transform -translate-x-1/2 animate-pulse delay-500"></div>
                        <div className="absolute left-0 top-1/2 w-2 h-2 bg-green-300 rounded-full transform -translate-y-1/2 animate-pulse delay-1000"></div>
                        <div className="absolute right-0 top-1/2 w-2 h-2 bg-emerald-300 rounded-full transform -translate-y-1/2 animate-pulse delay-1500"></div>
                      </div>
                    </div>
                  </div>

                  {/* Futuristic Title */}
                  <div className="space-y-4">
                    <h2
                      className={`text-4xl font-black tracking-tight bg-gradient-to-r bg-clip-text text-transparent ${
                        theme === "dark"
                          ? "from-white via-green-100 to-emerald-200"
                          : "from-gray-900 via-green-800 to-emerald-900"
                      }`}
                    >
                      {translate("¡Tu taxi está en camino!")}
                    </h2>

                    {/* Animated Underline */}
                    <div className="flex justify-center">
                      <div className="relative w-32 h-1">
                        <div
                          className={`absolute inset-0 rounded-full ${
                            theme === "dark"
                              ? "bg-green-500/30"
                              : "bg-green-400/40"
                          }`}
                        ></div>
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse"></div>
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-green-300 to-transparent animate-ping"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Driver Info Card - Glassmorphism Style */}
                <div className="flex justify-center">
                  <div
                    className={`relative w-full max-w-lg p-8 rounded-3xl backdrop-blur-2xl border transition-all duration-500 hover:scale-105 group ${
                      theme === "dark"
                        ? "bg-gradient-to-br from-zinc-900/80 via-zinc-800/60 to-zinc-900/80 border-zinc-700/50 shadow-2xl shadow-green-500/10"
                        : "bg-gradient-to-br from-white/80 via-gray-50/60 to-white/80 border-white/50 shadow-2xl shadow-green-400/20"
                    }`}
                  >
                    {/* Card Glow Effect */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-green-500/10 via-emerald-500/5 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>

                    {/* Top Border Glow */}
                    <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-green-400 to-transparent"></div>

                    <div className="relative flex items-center gap-6">
                      {/* Futuristic Driver Avatar */}
                      <div className="relative">
                        <div
                          className={`w-20 h-20 rounded-2xl flex items-center justify-center font-black text-2xl backdrop-blur-xl border-2 ${
                            theme === "dark"
                              ? "bg-gradient-to-br from-green-500/30 to-emerald-600/30 border-green-400/50 text-white shadow-lg shadow-green-500/30"
                              : "bg-gradient-to-br from-green-400/30 to-emerald-500/30 border-green-500/60 text-white shadow-lg shadow-green-400/40"
                          }`}
                        >
                          {accepteRide.driver.name.charAt(0)}
                        </div>

                        {/* Avatar Glow */}
                        <div className="absolute inset-0 rounded-2xl bg-green-400/20 blur-lg animate-pulse"></div>

                        {/* Status Indicator */}
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        </div>
                      </div>

                      {/* Driver Details */}
                      <div className="flex-1 space-y-3">
                        {/* Driver Name and Rating */}
                        <div className="flex items-center gap-3">
                          <h3
                            className={`font-bold text-xl ${
                              theme === "dark" ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {accepteRide.driver.name}
                          </h3>
                          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400/20 to-amber-500/20 border border-yellow-400/30 backdrop-blur-sm">
                            <span className="text-yellow-500 text-sm">★</span>
                            <span className="text-yellow-600 text-sm font-bold">
                              4.8
                            </span>
                          </div>
                        </div>

                        {/* Vehicle Info with Tech Style */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-lg ${
                                theme === "dark"
                                  ? "bg-zinc-800/50"
                                  : "bg-gray-100/50"
                              } backdrop-blur-sm`}
                            >
                              <svg
                                className={`w-4 h-4 ${
                                  theme === "dark"
                                    ? "text-green-400"
                                    : "text-green-600"
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p
                                className={`text-xs uppercase tracking-wider font-semibold ${
                                  theme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-500"
                                }`}
                              >
                                PLACA
                              </p>
                              <p
                                className={`font-mono font-bold ${
                                  theme === "dark"
                                    ? "text-white"
                                    : "text-gray-900"
                                }`}
                              >
                                {accepteRide.vehicle.licensePlate}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-lg ${
                                theme === "dark"
                                  ? "bg-zinc-800/50"
                                  : "bg-gray-100/50"
                              } backdrop-blur-sm`}
                            >
                              <svg
                                className={`w-4 h-4 ${
                                  theme === "dark"
                                    ? "text-blue-400"
                                    : "text-blue-600"
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h6m-6 4h6m-2 4h2"
                                />
                              </svg>
                            </div>
                            <div>
                              <p
                                className={`text-xs uppercase tracking-wider font-semibold ${
                                  theme === "dark"
                                    ? "text-gray-400"
                                    : "text-gray-500"
                                }`}
                              >
                                MODELO
                              </p>
                              <p
                                className={`font-semibold ${
                                  theme === "dark"
                                    ? "text-white"
                                    : "text-gray-900"
                                }`}
                              >
                                {accepteRide.vehicle.model}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Tech Line */}
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-400/50 to-transparent"></div>
                  </div>
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
                  {translate("Aceptar")}
                </button>
                <button
                  onClick={() => setShowCancelConfirmation(true)}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-500 rounded-lg cursor-pointer"
                >
                  {translate("Cancelar")}
                </button>
              </div>

              {/* Modal de confirmación de cancelación */}
              {showCancelConfirmation && (
                <Modal onClose={() => setShowCancelConfirmation(false)}>
                  <div>
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
                        onClick={handleCancel}
                        className={`flex-1 py-2 bg-red-600 hover:bg-red-500 rounded-lg cursor-pointer`}
                      >
                        {translate("Confirmar")}
                      </button>
                    </div>
                  </div>
                </Modal>
              )}
            </div>
          </div>
        )}

        {showRateDriver && (
          <div className="w-full fixed  max-w-md mx-auto p-6 rounded-2xl shadow-lg bg-white dark:bg-zinc-900">
            <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-4">
              ¿Cómo fue tu experiencia?
            </h2>

            <div className="flex justify-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={32}
                  className={`cursor-pointer transition-colors ${
                    (hovered || rating) >= star
                      ? "text-yellow-400"
                      : "text-gray-300 dark:text-gray-600"
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  fill={(hovered || rating) >= star ? "currentColor" : "none"}
                />
              ))}
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-2 px-4 rounded-lg bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition"
            >
              Enviar calificación
            </button>
          </div>
        )}

        {cancelId && (
          <Modal onClose={() => setCancelId(false)}>
            <div className="p-6 text-center">
              <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                El conductor canceló el viaje 😞
              </h2>
              <button
                onClick={() => {
                  setCancelId(false);
                  resetState(); // <-- limpia inputs, resetea modales, etc.
                }}
                className="px-4 py-2 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white transition"
              >
                Buscar nuevo viaje
              </button>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default MapForm;
