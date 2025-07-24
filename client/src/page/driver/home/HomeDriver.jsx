import MainLayout from "../../../components/layout/MainLayout";
import { ThemeContext } from "../../../context/ThemeContext";
import { useTranslate } from "../../../hooks/useTranslate";
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
} from "lucide-react";
import { useContext, useState, useEffect } from "react";
import {
  getDriver,
  getVehicles,
  acceptViaje,
  cancelViaje,
} from "../../../services/driver";

const HomeDriver = () => {
  const { theme } = useContext(ThemeContext);
  const translate = useTranslate();

  const [isOnline, setIsOnline] = useState(true);
  const [showRequest, setShowRequest] = useState(true);
  const [drivingMode, setDrivingMode] = useState(false);
  const [showRider, setShowRider] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState([]);
  const [ShowConfirm, setShowConfirm] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  //Primero nos aseguramos que el conductor se encuentre adherido a como minimo un viaje vehiculo

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await getVehicles(); // llamás a tu API
        console.log("Response:", response.data);

        const vehiculosValidos = response.data.filter(
          (vehiculo) => vehiculo.status === "Active"
        );
        console.log(vehiculosValidos);

        // Si no hay ningún vehículo válido, mostramos el modal
        if (vehiculosValidos.length === 0) {
          console.log("No hay vehículos activos");
          setShowScheduleModal(true);
        } else {
          setShowScheduleModal(false);
        }
      } catch (error) {
        console.error("Error fetching scheduled trips:", error);
      }
    };
    fetchVehicles();
  });

  // LLamado a los viajes programados
  useEffect(() => {
    const fetchScheduledTrips = async () => {
      try {
        const response = await getDriver(); // llamás a tu API
        console.log("Response:", response);
        const pendingTrips = response.data.filter(
          (trip) => trip?.status === "Pending"
        );
        setSelectedTrip(pendingTrips);
        console.log(pendingTrips);
      } catch (error) {
        console.error("Error fetching scheduled trips:", error);
      }
    };
    fetchScheduledTrips();
  }, []);

  // funcion para aceptar viaje programados
  const handleAcceptTrip = async (trip) => {
    try {
      const response = await acceptViaje(trip.id); // llamás a tu API
      console.log("Response:", response);
      setShowConfirm(true);
    } catch (error) {
      console.error("Error fetching scheduled trips:", error);
    }
  };

  useEffect(() => {
    if (ShowConfirm) {
      const timer = setTimeout(() => {
        window.location.reload(); // recarga después de 3 segundos
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [ShowConfirm]);

  // Función para aceptar el viaje
  const handleAccept = async () => {
    setShowRequest(false);
    setDrivingMode(true);
    setShowRider(false);
    // Aquí iría la lógica para aceptar el viaje
  };

  // Función para rechazar el viaje
  const handleRejectTrip = async (riderId) => {
    try {
      console.log("Deleting ride with ID:", riderId);
      await cancelViaje(riderId);
      console.log("Viaje cancelado con éxito");
      setShowRequest(false);
      window.location.reload();
    } catch (error) {
      console.error(`Error cancelando viaje con ID ${riderId}:`, error);
    }
    // Aquí iría la lógica para rechazar el viaje
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
                Para continuar, debes agregar o activar al menos un vehículo.
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

        {!drivingMode && (
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
                  onClick={() => setIsOnline(!isOnline)}
                  className={`flex items-center gap-2 cursor-pointer ${
                    isOnline
                      ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500"
                      : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500"
                  } text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 shadow-lg`}
                >
                  <Power size={20} />
                  {isOnline
                    ? translate("Conectado")
                    : translate("Desconectado")}
                </button>
              </div>

              {/* Solicitud de viaje entrante con mapa */}
              {showRequest && isOnline && (
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

                        <div
                          className={`absolute bottom-4 right-4  p-2 rounded-lg ${
                            theme === "dark"
                              ? "bg-zinc-800/70"
                              : "bg-white text-yellow-500"
                          }`}
                        >
                          <p className="text-sm ">3.5 km • 15 min</p>
                        </div>
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
                          <p className="font-medium">María González</p>
                        </div>
                        <div className="ml-auto text-right">
                          <p className="font-medium">$1,250</p>
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
                          <p className="font-medium">
                            Av. Libertador 1250, Buenos Aires
                          </p>
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
                            Plaza de Mayo, Buenos Aires
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Botones grandes y claros */}
                    <div className="flex gap-4">
                      <button className="flex-1 flex items-center justify-center cursor-pointer gap-2 bg-red-600 hover:bg-red-700 py-4 px-4 rounded-xl transition-all duration-300 font-medium text-lg">
                        <X size={24} />
                        {translate("Rechazar")}
                      </button>
                      <button
                        onClick={handleAccept}
                        className="flex-1 flex items-center cursor-pointer justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-medium py-4 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-green-500/20 text-lg"
                      >
                        <Check size={24} />
                        {translate("Aceptar")}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {showRider &&
                selectedTrip.map((viaje) => (
                  <div
                    key={viaje.id}
                    className={`backdrop-blur-md rounded-2xl border shadow-xl mb-6 overflow-hidden ${
                      theme === "dark"
                        ? "bg-zinc-900/70 border-zinc-800/50"
                        : "bg-white/70 border-yellow-500"
                    }`}
                  >
                    {/* Cabecera con fecha y precio */}
                    <div
                      className={`p-3 flex justify-between items-center ${
                        theme === "dark"
                          ? "bg-zinc-800/70"
                          : "bg-white text-yellow-500"
                      }`}
                    >
                      <div className="text-sm font-medium text-gray-400">
                        {new Date(viaje.scheduledAt).toLocaleString("es-AR", {
                          weekday: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "2-digit",
                          month: "short",
                        })}
                      </div>
                      <div className="text-lg font-bold">
                        ${viaje.payment.amount}
                      </div>
                    </div>

                    {/* Ruta del viaje */}
                    <div className="p-4 space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-900/30 flex items-center justify-center flex-shrink-0">
                          <MapPin size={20} className="text-green-500" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Recoger en</p>
                          <p className="font-medium">{viaje.originAddress}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-900/30 flex items-center justify-center flex-shrink-0">
                          <MapPin size={20} className="text-red-500" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Destino</p>
                          <p className="font-medium">
                            {viaje.destinationAddress}
                          </p>
                        </div>
                      </div>

                      {/* Botones de acción */}
                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          onClick={() => handleAcceptTrip(viaje)}
                          className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg"
                        >
                          Aceptar
                        </button>
                        <button
                          onClick={() => handleRejectTrip(viaje.id)}
                          className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-lg"
                        >
                          Rechazar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

              {ShowConfirm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                  <div className="relative bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full text-center">
                    {/* Botón para cerrar manualmente */}
                    <button
                      onClick={() => {
                        setShowConfirm(false);
                        window.location.reload(); // recarga si se cierra manualmente
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

              {/* Estadísticas simplificadas */}
              {!showRequest && !drivingMode && (
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
            </div>
          </div>
        )}

        {/* Modo conducción - Interfaz minimalista */}
        {drivingMode && (
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
                      María González
                    </p>
                  </div>
                  <div className="ml-auto text-right">
                    <p
                      className={`font-medium text-lg ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      $1,250
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

                <button
                  onClick={() => setDrivingMode(false)}
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
                    {translate("Salir")}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default HomeDriver;
