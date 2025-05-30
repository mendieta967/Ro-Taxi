import MainLayout from "../../../components/layout/MainLayout";
import { ThemeContext } from "../../../context/ThemeContext";
import {useTranslate} from "../../../hooks/useTranslate";
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
import { useContext, useState } from "react";

export default function HomeDriver() {
  const { theme } = useContext(ThemeContext);
  const translate = useTranslate();

  const [isOnline, setIsOnline] = useState(true);
  const [showRequest, setShowRequest] = useState(true);
  const [drivingMode, setDrivingMode] = useState(false);



  // Simular la posición del conductor y del pasajero

  // Función para aceptar el viaje
  const handleAccept = () => {
    setShowRequest(false);
    setDrivingMode(true);
    // Aquí iría la lógica para aceptar el viaje
  };

  // Función para rechazar el viaje
  const handleReject = () => {
    setShowRequest(false);
    // Aquí iría la lógica para rechazar el viaje
  };

  return (
    <MainLayout>
      <div className={`min-h-screen  rounded-lg  ${theme === 'dark' ? 'bg-zinc-900 text-white' : 'bg-white text-gray-900 border border-yellow-500'}`}>
        {/* Modo normal - Solicitud de viaje */}
        {!drivingMode && (
          <div className="p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-4">
                <h1 className={`text-3xl font-bold bg-clip-text text-transparent ${theme === 'dark' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 ' : 'bg-gradient-to-r from-gray-900 to-gray-600'}`}>
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
                  {isOnline ? translate("Conectado") : translate("Desconectado")}
                </button>
              </div>

              {/* Solicitud de viaje entrante con mapa */}
              {showRequest && isOnline && (
                <div className={`backdrop-blur-md  rounded-2xl border shadow-xl mb-6 overflow-hidden ${theme === 'dark' ? 'bg-zinc-900/70 border-zinc-800/50 ' : 'bg-white/70 border-yellow-500'}`}>
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

                        <div className={`absolute bottom-4 right-4  p-2 rounded-lg ${theme === 'dark' ? 'bg-zinc-800/70' : 'bg-white text-yellow-500'}`}>
                          <p className="text-sm ">3.5 km • 15 min</p>
                        </div>
                      </div>
                    </div>

                    {/* Overlay con información básica */}
                    <div className={`absolute top-4 left-4 right-4 p-3 rounded-lg ${theme === 'dark' ? 'bg-zinc-800/70' : 'bg-white text-yellow-500'}`}>
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center">
                          <User className="text-yellow-500" size={20} />
                        </div>
                        <div>
                          <p className="font-medium">María González</p>
                        </div>
                        <div className="ml-auto text-right">
                          <p className="font-medium">$1,250</p>
                          <p className="text-sm text-gray-400">{translate("Efectivo")}</p>
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
                          <p className="text-sm text-gray-400">{translate("Recoger en")}</p>
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
                          <p className="text-sm text-gray-400">{translate("Destino")}</p>
                          <p className="font-medium">
                            Plaza de Mayo, Buenos Aires
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Botones grandes y claros */}
                    <div className="flex gap-4">
                      <button
                        onClick={handleReject}
                        className="flex-1 flex items-center justify-center cursor-pointer gap-2 bg-red-600 hover:bg-red-700 py-4 px-4 rounded-xl transition-all duration-300 font-medium text-lg"
                      >
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

              {/* Estadísticas simplificadas */}
              {!showRequest && !drivingMode && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 ">
                  <div className={`backdrop-blur-md  rounded-xl p-4 border shadow-lg ${theme === 'dark' ? 'bg-zinc-900/70 border-zinc-800/50 ' : 'bg-white border-yellow-500'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="text-yellow-500" size={20} />
                      <h3 className="font-medium">{translate("Tiempo")}</h3>
                    </div>
                    <p className="text-2xl font-bold">5h 23m</p>
                  </div>

                  <div className={`backdrop-blur-md  rounded-xl p-4 border shadow-lg ${theme === 'dark' ? 'bg-zinc-900/70 border-zinc-800/50 ' : 'bg-white border-yellow-500'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="text-yellow-500" size={20} />
                      <h3 className="font-medium">{translate("Distancia")}</h3>
                    </div>
                    <p className="text-2xl font-bold">78.5 km</p>
                  </div>

                  <div className={`backdrop-blur-md  rounded-xl p-4 border shadow-lg ${theme === 'dark' ? 'bg-zinc-900/70 border-zinc-800/50 ' : 'bg-white border-yellow-500'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="text-yellow-500" size={20} />
                      <h3 className="font-medium">{translate("Ganancias")}</h3>
                    </div>
                    <p className="text-2xl font-bold">$3,450</p>
                  </div>

                  <div className={`backdrop-blur-md  rounded-xl p-4 border shadow-lg ${theme === 'dark' ? 'bg-zinc-900/70 border-zinc-800/50 ' : 'bg-white border-yellow-500'}`}>
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
              <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-zinc-900/70' : 'bg-white text-yellow-500'}`}>
                <div className="w-full h-full relative">
                  {/* Imagen de mapa simulada */}
                  <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-zinc-700 opacity-50' : 'bg-white text-yellow-500'}`}></div>

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
              <div className={`absolute top-4 left-4 right-4  p-4 rounded-xl ${theme === 'dark' ? 'bg-zinc-900/70' : 'bg-white border border-yellow-500 text-yellow-500'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center">
                    <User className="text-yellow-500" size={24} />
                  </div>
                  <div>
                    <p className={`font-medium text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>María González</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className={`font-medium text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>$1,250</p>
                    <p className="text-gray-400">{translate("Efectivo")}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Barra de acciones - Botones grandes para fácil acceso */}
            <div className={`p-4 ${theme === 'dark' ? 'bg-zinc-900/70' : 'bg-white border border-yellow-500 text-yellow-500'}`}>
              <div className="flex justify-around">
                <button className={`w-16 h-16 flex flex-col items-center justify-center rounded-xl cursor-pointer ${theme === 'dark' ? 'bg-zinc-900/70' : 'bg-white border border-yellow-500 text-yellow-500'}`}>
                  <MessageCircle size={28} className="text-green-500 mb-1" />
                  <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{translate("Mensaje")}</span>
                </button>

                <button
                  onClick={() => setDrivingMode(false)}
                  className={`w-16 h-16 flex flex-col items-center justify-center rounded-xl cursor-pointer ${theme === 'dark' ? 'bg-zinc-900/70' : 'bg-white border border-yellow-500 text-yellow-500'}`}
                >
                  <X size={28} className="text-red-500 mb-1" />
                  <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{translate("Salir")}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
