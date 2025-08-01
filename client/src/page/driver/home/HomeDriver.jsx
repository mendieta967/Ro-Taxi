import MainLayout from "../../../components/layout/MainLayout";
import { ThemeContext } from "../../../context/ThemeContext";
import { useTranslate } from "../../../hooks/useTranslate";
import ScheduledTrips from "./components/ScheduledTrips";
import { useRide } from "@/context/RideContext";
import Modal from "@/components/ui/Modal";
import { deleteRide } from "../../../services/ride";
import { Link } from "react-router-dom";
import {
  Power,
  MapPin,
  Clock,
  DollarSign,
  User,
  Check,
  X,
  MessageCircle,
  CheckCircle,
} from "lucide-react";
import { useContext, useState, useEffect, useRef } from "react";
import {
  acceptViaje,
  rejectViaje,
  pendingViaje,
  completeViaje,
} from "../../../services/driver";
import { useConnection } from "@/context/ConnectionContext";
import { useVehicle } from "@/context/VehicleContext";

const HomeDriver = () => {
  const { theme } = useContext(ThemeContext);
  const { selectVehicle } = useVehicle();
  const { accepteRide, setAccepteRide } = useRide();
  const translate = useTranslate();
  const intervalRef = useRef(null);

  const [ShowConfirm, setShowConfirm] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [pendingTrip, setPendingTrip] = useState(null);
  const [cancelTrip, setCancelTrip] = useState(false);
  const [tripCancelPassanger, setTripCancelPassanger] = useState(false);

  const {
    isConnected,
    disconnect,
    invoke,
    on,
    handleConnect: connect,
  } = useConnection();

  const handleConnect = async () => {
    if (isConnected) {
      disconnect();
      return;
    }

    if (!selectVehicle) {
      setShowScheduleModal(true);
      return;
    }
    await connect();
  };

  const handlePending = async () => {
    let responsePending;
    try {
      responsePending = await pendingViaje();
      console.log("Buscando viajes :", responsePending);
    } catch (error) {
      console.log("Error buscando viajes :", error);
    }
    if (responsePending) {
      setPendingTrip(responsePending);

      // Si se encuentra un viaje, limpiar el intervalo
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        console.log("Viaje encontrado, se detiene el polling.");
      }
    }
  };

  console.log({ selectVehicle });
  useEffect(() => {
    if (!isConnected || pendingTrip || accepteRide) return; // No hacer nada si está desconectado o ya hay viaje

    // Llamada inicial
    handlePending();

    // Iniciar el intervalo si aún no hay uno corriendo
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        handlePending();
      }, 5000); // 5 segundos
      console.log("Intervalo iniciado para buscar viajes cada 5 minutos.");
    }

    // Limpiar intervalo si el componente se desmonta
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        console.log(
          "Componente desmontado o cambio de estado: intervalo detenido."
        );
      }
    };
  }, [isConnected, pendingTrip, accepteRide]);

  // funcion para aceptar viajes en tiempo real
  const handleAcceptTrip = async (trip) => {
    console.log(trip);
    try {
      const response = await acceptViaje(trip.id, selectVehicle); // llamás a tu API
      console.log("Response:", response);
      invoke("JoinRideGroup", trip.id)
        .then(() => console.log("Unido al grupo de ride:", trip.id))
        .catch((err) => console.error("Error al unirse al grupo:", err));
      setAccepteRide(trip);
      setShowConfirm(true);
    } catch (error) {
      console.error("Error fetching scheduled trips:", error);
    }
  };

  // Función para rechazar el viajeconst handleRejectTrip = async (riderId) => {
  const handleRejectTrip = async (riderId) => {
    try {
      console.log("Cancelando viaje con ID:", riderId);
      await rejectViaje(riderId);
      console.log("Viaje cancelado con éxito");

      // Limpia el viaje actual y vuelve a buscar después de unos segundos
      setPendingTrip(null);

      // Opcional: volver a ejecutar la búsqueda inmediatamente
      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => {
          handlePending();
        }, 5000); // o 300000 para 5 minutos
        console.log("Se reinicia el polling tras rechazar.");
      }
    } catch (error) {
      console.error(`Error cancelando viaje con ID ${riderId}:`, error);
    }
  };

  useEffect(() => {
    if (ShowConfirm) {
      const timeout = setTimeout(() => {
        setShowConfirm(false);
      }, 3000); // 3 segundos

      // Limpiar el timeout si el componente se desmonta o si ShowConfirm cambia antes de los 3 seg
      return () => clearTimeout(timeout);
    }
  }, [ShowConfirm]);

  useEffect(() => {
    const handler = (rideId) => {
      console.log("El viaje fue cancelado :(", rideId);
      invoke("LeaveRideGroup", rideId);
      setTripCancelPassanger(true);
      setPendingTrip(null);
      setAccepteRide(null);

      // Reiniciar el polling después de finalizar el viaje
      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => {
          handlePending();
        }, 5000); // o 300000 para 5 minutos en producción
        console.log("Se reinicia el polling tras finalizar viaje.");
      }
    };
    on("ridecanceled", handler);
  }, [on]);

  useEffect(() => {
    if (!isConnected || !selectVehicle) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Ubicación actualizada:", latitude, longitude);
        invoke(
          "UpdateLocation",
          selectVehicle,
          accepteRide?.id,
          latitude,
          longitude
        );
      },
      (error) => {
        console.error("Error al obtener ubicación:", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [isConnected, selectVehicle]);

  const handleComplete = async () => {
    try {
      const responseComplete = await completeViaje(accepteRide.id);
      await invoke("LeaveRideGroup", accepteRide.id);
      console.log(responseComplete);

      setPendingTrip(null);
      setAccepteRide(null);

      // Reiniciar el polling después de finalizar el viaje
      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => {
          handlePending();
        }, 5000); // o 300000 para 5 minutos en producción
        console.log("Se reinicia el polling tras finalizar viaje.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelTrip = async () => {
    if (!accepteRide) return;

    try {
      const responseCancel = await deleteRide(accepteRide.id);
      console.log("cancelando, viaje aceptado:", responseCancel);
      await invoke("LeaveRideGroup", accepteRide.id);
      setAccepteRide(null);
      setPendingTrip(null);
      setCancelTrip(false);

      // Reiniciar polling si no está corriendo
      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => {
          handlePending();
        }, 5000);
        console.log("Se reinicia el polling tras cancelar viaje.");
      }
    } catch (error) {
      console.error(`Error cancelando viaje con ID ${accepteRide.id}:`, error);
    }
  };

  return (
    <MainLayout>
      <div
        className={`min-h-screen  rounded-lg  ${
          theme === "dark"
            ? "bg-zinc-900 text-white"
            : "bg-white text-gray-900 border border-yellow-500"
        }`}
      >
        {/* Modo normal - Solicitud de viaje */}
        {showScheduleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div
              className={`backdrop-blur-md rounded-2xl border shadow-2xl w-full max-w-md mx-4 p-8 text-center transform transition-all duration-300 animate-in zoom-in-95 ${
                theme === "dark"
                  ? "bg-zinc-900/90 border-zinc-800/50 text-white"
                  : "bg-white/90 border-yellow-500 text-gray-900"
              }`}
            >
              {/* Icono con animación */}
              <div className="mb-6">
                <div
                  className={`mx-auto h-16 w-16 rounded-full flex items-center justify-center animate-pulse ${
                    theme === "dark" ? "bg-yellow-500/20" : "bg-yellow-500/10"
                  }`}
                >
                  <svg
                    className="h-10 w-10 text-yellow-500 animate-bounce"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Título con gradiente */}
              <h2
                className={`text-2xl font-bold mb-3 bg-clip-text text-transparent ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                    : "bg-gradient-to-r from-gray-900 to-gray-600"
                }`}
              >
                ¡Atención!
              </h2>

              {/* Descripción */}
              <p
                className={`mb-8 text-base leading-relaxed ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Para continuar, debes seleccionar al menos un vehículo.
              </p>

              {/* Botón mejorado */}
              <Link to="/app/vehiculos">
                <button
                  onClick={() => {
                    setShowScheduleModal(false);
                  }}
                  className="w-full px-6 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-yellow-500/25 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  Registrar vehículo
                </button>
              </Link>
            </div>
          </div>
        )}
        <div className="p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h1
                className={`text-3xl font-bold bg-clip-text text-transparent ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-600 "
                    : "bg-gradient-to-r from-gray-900 to-gray-600"
                }`}
              >
                {translate("Panel del Conductor")}
              </h1>
              <button
                onClick={handleConnect}
                className={`flex items-center gap-2 cursor-pointer ${
                  isConnected
                    ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500"
                    : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500"
                } text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 shadow-lg`}
              >
                <Power size={20} />
                {isConnected
                  ? translate("Conectado")
                  : translate("Desconectado")}
              </button>
            </div>
          </div>
          {!pendingTrip && isConnected && !accepteRide && (
            <div className=" bg-transparent bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 mb-10">
              <div className="bg-zinc-900 w-[90%] max-w-sm rounded-2xl p-6 text-white text-center">
                <div className="text-4xl mb-4 animate-spin">🚕</div>
                <h2 className="text-xl font-bold">Buscando viajes...</h2>
                <p className="text-zinc-400 mt-2">
                  {translate("Esto tomará unos segundos")}
                </p>
              </div>
            </div>
          )}

          {/* Solicitud de viaje entrante con mapa ojos */}
          {isConnected && pendingTrip && !accepteRide && (
            <div
              className={`backdrop-blur-md  rounded-2xl border shadow-xl mb-6 overflow-hidden ${
                theme === "dark"
                  ? "bg-zinc-900/70 border-zinc-800/50 "
                  : "bg-white/70 border-yellow-500"
              }`}
            >
              {/* Mapa grande */}
              <div className="relative w-full h-64 bg-zinc-800">
                {/* Simulación de mapa */}
                <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center">
                  <div className="w-full h-full relative overflow-hidden">
                    {/* Imagen de mapa simulada */}
                    <div className="absolute inset-0 bg-zinc-700 opacity-50"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full animate-ping"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full"></div>

                    {/* Marcador de destino */}
                    <div className="absolute top-1/3 right-1/3 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
                        <MapPin size={16} className="text-white" />
                      </div>
                    </div>

                    {/* Línea de ruta */}
                    <div className="absolute top-1/2 left-1/2 w-32 h-1 bg-yellow-500 transform -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
                  </div>
                </div>

                {/* Overlay con información básica */}
                <div
                  className={`absolute top-4 left-4 right-4 p-3 rounded-lg ${
                    theme === "dark"
                      ? "bg-zinc-800/70"
                      : "bg-white text-yellow-500"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center">
                      <User className="text-yellow-500" size={20} />
                    </div>
                    <div>
                      <p className="font-medium">{pendingTrip.passeger.name}</p>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="font-medium">
                        ${pendingTrip.payment.amount}
                      </p>
                      <p className="text-sm text-gray-400">
                        {translate("Efectivo")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información de la solicitud */}
              <div className="p-4">
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-900/30 flex items-center justify-center flex-shrink-0">
                      <MapPin size={20} className="text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">
                        {translate("Recoger en")}
                      </p>
                      <p className="font-medium">{pendingTrip.originAddress}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-900/30 flex items-center justify-center flex-shrink-0">
                      <MapPin size={20} className="text-red-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">
                        {translate("Destino")}
                      </p>
                      <p className="font-medium">
                        {pendingTrip.destinationAddress}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Botones grandes y claros */}
                <div className="flex gap-4">
                  <button
                    onClick={() => handleRejectTrip(pendingTrip.id)}
                    className="flex-1 flex items-center justify-center cursor-pointer gap-2 bg-red-600 hover:bg-red-700 py-4 px-4 rounded-xl transition-all duration-300 font-medium text-lg"
                  >
                    <X size={24} />
                    {translate("Rechazar")}
                  </button>
                  <button
                    onClick={() => handleAcceptTrip(pendingTrip)}
                    className="flex-1 flex items-center cursor-pointer justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-medium py-4 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-green-500/20 text-lg"
                  >
                    <Check size={24} />
                    {translate("Aceptar")}
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* te salta cuando aceptas el viaje */}
          {ShowConfirm && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
              <div className="relative bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full text-center">
                {/* Botón para cerrar manualmente */}
                <button
                  onClick={() => {
                    setShowConfirm(false);
                  }}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
                >
                  &times;
                </button>

                <h2 className="text-xl font-semibold text-green-600 mb-3">
                  ¡Viaje confirmado!
                </h2>
                <p className="text-gray-600">
                  Has aceptado el viaje exitosamente.
                </p>
              </div>
            </div>
          )}
        </div>
        {/* Estadísticas simplificadas cuando terminas el dia */}
        {!isConnected && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 ">
            <div
              className={`backdrop-blur-md  rounded-xl p-4 border shadow-lg ${
                theme === "dark"
                  ? "bg-zinc-900/70 border-zinc-800/50 "
                  : "bg-white border-yellow-500"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Clock className="text-yellow-500" size={20} />
                <h3 className="font-medium">{translate("Tiempo")}</h3>
              </div>
              <p className="text-2xl font-bold">5h 23m</p>
            </div>

            <div
              className={`backdrop-blur-md  rounded-xl p-4 border shadow-lg ${
                theme === "dark"
                  ? "bg-zinc-900/70 border-zinc-800/50 "
                  : "bg-white border-yellow-500"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="text-yellow-500" size={20} />
                <h3 className="font-medium">{translate("Distancia")}</h3>
              </div>
              <p className="text-2xl font-bold">78.5 km</p>
            </div>

            <div
              className={`backdrop-blur-md  rounded-xl p-4 border shadow-lg ${
                theme === "dark"
                  ? "bg-zinc-900/70 border-zinc-800/50 "
                  : "bg-white border-yellow-500"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="text-yellow-500" size={20} />
                <h3 className="font-medium">{translate("Ganancias")}</h3>
              </div>
              <p className="text-2xl font-bold">$3,450000</p>
            </div>

            <div
              className={`backdrop-blur-md  rounded-xl p-4 border shadow-lg ${
                theme === "dark"
                  ? "bg-zinc-900/70 border-zinc-800/50 "
                  : "bg-white border-yellow-500"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <User className="text-yellow-500" size={20} />
                <h3 className="font-medium">{translate("Viajes")}</h3>
              </div>
              <p className="text-2xl font-bold">12</p>
            </div>
          </div>
        )}
        {/* Modo conducción - Interfaz minimalista */}
        {accepteRide && (
          <div className="h-screen flex flex-col  ">
            {/* Mapa a pantalla completa */}
            <div className="flex-1 relative ">
              {/* Simulación de mapa */}
              <div
                className={`absolute inset-0 ${
                  theme === "dark"
                    ? "bg-zinc-900/70"
                    : "bg-white text-yellow-500"
                }`}
              >
                <div className="w-full h-full relative">
                  {/* Imagen de mapa simulada */}
                  <div
                    className={`absolute inset-0 ${
                      theme === "dark"
                        ? "bg-zinc-700 opacity-50"
                        : "bg-white text-yellow-500"
                    }`}
                  ></div>

                  {/* Posición actual */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-blue-500 rounded-full"></div>

                  {/* Marcador de destino */}
                  <div className="absolute top-1/3 right-1/3 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
                      <MapPin size={20} className="text-white" />
                    </div>
                  </div>

                  {/* Línea de ruta */}
                  <div className="absolute top-1/2 left-1/2 w-40 h-2 bg-yellow-500 transform -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
                </div>
              </div>

              {/* Información del viaje - Overlay superior */}
              <div
                className={`absolute top-4 left-4 right-4  p-4 rounded-xl ${
                  theme === "dark"
                    ? "bg-zinc-900/70"
                    : "bg-white border border-yellow-500 text-yellow-500"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center">
                    <User className="text-yellow-500" size={24} />
                  </div>
                  <div>
                    <p
                      className={`font-medium text-lg ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {accepteRide.passeger.name}
                    </p>
                  </div>
                  <div className="ml-auto text-right">
                    <p
                      className={`font-medium text-lg ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      $ {accepteRide.payment.amount}
                    </p>
                    <p className="text-gray-400">{translate("Efectivo")}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Barra de acciones - Botones grandes para fácil acceso */}
            <div
              className={`p-4 ${
                theme === "dark"
                  ? "bg-zinc-900/70"
                  : "bg-white border border-yellow-500 text-yellow-500"
              }`}
            >
              <div className="flex justify-around">
                <Link to="/app/chat">
                  <button
                    className={`w-16 h-16 flex flex-col items-center justify-center rounded-xl cursor-pointer ${
                      theme === "dark"
                        ? "bg-zinc-900/70"
                        : "bg-white border border-yellow-500 text-yellow-500"
                    }`}
                  >
                    <MessageCircle size={28} className="text-green-500 mb-1" />
                    <span
                      className={`text-sm font-semibold ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {translate("Mensaje")}
                    </span>
                  </button>
                </Link>

                <button
                  onClick={() => setCancelTrip(true)}
                  className={`w-16 h-16 flex flex-col items-center justify-center rounded-xl cursor-pointer ${
                    theme === "dark"
                      ? "bg-zinc-900/70"
                      : "bg-white border border-yellow-500 text-yellow-500"
                  }`}
                >
                  <X size={28} className="text-red-500 mb-1" />
                  <span
                    className={`text-sm font-semibold ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {translate("Cancelar")}
                  </span>
                </button>
                <button
                  onClick={() => handleComplete()}
                  className={`w-16 h-16 flex flex-col items-center justify-center rounded-xl cursor-pointer ${
                    theme === "dark"
                      ? "bg-zinc-900/70"
                      : "bg-white border border-yellow-500 text-yellow-500"
                  }`}
                >
                  <CheckCircle size={28} className="text-blue-500 mb-1" />
                  <span
                    className={`text-sm font-semibold ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {translate("Finalizar")}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Viajes programados */}
        {isConnected && !accepteRide && <ScheduledTrips />}
        {cancelTrip && (
          <Modal onClose={() => setCancelTrip(false)}>
            <div className="p-6 text-center">
              <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                ¿Estás seguro de que querés cancelar el viaje?
              </h2>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => handleCancelTrip()}
                  className="px-4 py-2 rounded-lg font-medium bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600 transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCancelTrip} // asumido que tenés esta función
                  className="px-4 py-2 rounded-lg font-medium bg-red-500 hover:bg-red-600 text-white transition"
                >
                  Aceptar
                </button>
              </div>
            </div>
          </Modal>
        )}
        {tripCancelPassanger && (
          <Modal onClose={() => setTripCancelPassanger(false)}>
            <div className="p-6 text-center">
              <h2 className="text-xl font-semibold text-red-600 mb-4">
                El pasajero ha cancelado el viaje
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Lamentablemente, el pasajero ha decidido cancelar este viaje.
              </p>
              <button
                onClick={() => setTripCancelPassanger(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
              >
                Cerrar
              </button>
            </div>
          </Modal>
        )}
      </div>
    </MainLayout>
  );
};

export default HomeDriver;
