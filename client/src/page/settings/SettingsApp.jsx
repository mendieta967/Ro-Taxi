import MainLayout from "../../components/layout/MainLayout";
import {
  Globe,
  Bell,
  Moon,
  Volume2,
  Mail,
  ChevronDown,
  Shield,
  MapPin,
  Clock,
  LogOut,
  UserX,
} from "lucide-react";

const SettingsApp = () => {
  return (
    <MainLayout>
      <div className="min-h-screen bg-zinc-900 text-white p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Apariencia */}
          <div className="mb-8 backdrop-blur-md bg-zinc-900/70 rounded-2xl p-6 border border-zinc-700 shadow-xl transition-all duration-300 hover:shadow-yellow-500/10">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold">Apariencia</h2>
            </div>
            <p className="text-gray-400 text-sm mb-6 ">
              Personaliza la apariencia de la aplicación
            </p>

            <div className="flex items-center justify-between py-4 border-b border-zinc-700 hover:bg-zinc-800/20 px-3 rounded-lg transition-all duration-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center">
                  <Moon className="text-yellow-500" size={20} />
                </div>
                <div>
                  <p className="font-medium">Modo Oscuro</p>
                  <p className="text-gray-400 text-sm">
                    Cambia entre modo claro y oscuro
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked
                />
                <div className="w-14 h-7 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-yellow-400 peer-checked:to-yellow-600"></div>
              </label>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-6">
                <h2 className="text-xl font-bold">Idioma</h2>
              </div>

              <div className="relative">
                <select className="appearance-none w-full bg-zinc-800/50 border border-zinc-700 text-white py-3 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:border-yellow-500 transition-all duration-200 cursor-pointer">
                  <option className="bg-zinc-800 ">Español</option>
                  <option className="bg-zinc-800">English</option>
                  <option className="bg-zinc-800">Français</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                  <ChevronDown size={18} />
                </div>
              </div>
            </div>
          </div>

          {/* Idioma */}

          {/* Notificaciones */}
          <div className="mb-8 backdrop-blur-md bg-zinc-900/70 rounded-2xl p-6 border border-zinc-700 shadow-xl transition-all duration-300 hover:shadow-yellow-500/10">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold">Notificaciones</h2>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Configura cómo quieres recibir notificaciones
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-4 border-b border-zinc-800/50 hover:bg-zinc-800/20 px-3 rounded-lg transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center">
                    <Bell className="text-yellow-500" size={20} />
                  </div>
                  <div>
                    <p className="font-medium">Notificaciones Push</p>
                    <p className="text-gray-400 text-sm">
                      Recibe notificaciones en tu dispositivo
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-14 h-7 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-yellow-400 peer-checked:to-yellow-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-4 border-b border-zinc-800/50 hover:bg-zinc-800/20 px-3 rounded-lg transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center">
                    <Volume2 className="text-yellow-500" size={20} />
                  </div>
                  <div>
                    <p className="font-medium">Sonidos</p>
                    <p className="text-gray-400 text-sm">
                      Reproduce sonidos para notificaciones importantes
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-14 h-7 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-yellow-400 peer-checked:to-yellow-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-4 hover:bg-zinc-800/20 px-3 rounded-lg transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center">
                    <Mail className="text-yellow-500" size={20} />
                  </div>
                  <div>
                    <p className="font-medium">Correos Electrónicos</p>
                    <p className="text-gray-400 text-sm">
                      Recibe actualizaciones por correo electrónico
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-14 h-7 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-yellow-400 peer-checked:to-yellow-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Privacidad y Seguridad */}
          <div className="mb-8 backdrop-blur-md bg-zinc-900/70 rounded-2xl p-6 border border-zinc-700 shadow-xl transition-all duration-300 hover:shadow-yellow-500/10">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold">Privacidad y Seguridad</h2>
            </div>
            <p className="text-gray-400 text-sm mb-6 ">
              Gestiona la privacidad y seguridad de tu cuenta
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-4 border-b border-zinc-800/50 hover:bg-zinc-800/20 px-3 rounded-lg transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center">
                    <Shield className="text-yellow-500" size={20} />
                  </div>
                  <div>
                    <p className="font-medium">Autenticación de dos factores</p>
                    <p className="text-gray-400 text-sm">
                      Añade una capa extra de seguridad a tu cuenta
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-14 h-7 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-yellow-400 peer-checked:to-yellow-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-4 border-b border-zinc-800/50 hover:bg-zinc-800/20 px-3 rounded-lg transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center">
                    <MapPin className="text-yellow-500" size={20} />
                  </div>
                  <div>
                    <p className="font-medium">Compartir datos de ubicación</p>
                    <p className="text-gray-400 text-sm">
                      Permite que la app acceda a tu ubicación
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-14 h-7 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-yellow-400 peer-checked:to-yellow-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-4 hover:bg-zinc-800/20 px-3 rounded-lg transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-800/50 flex items-center justify-center">
                    <Clock className="text-yellow-500" size={20} />
                  </div>
                  <div>
                    <p className="font-medium">Historial de sesiones</p>
                    <p className="text-gray-400 text-sm">
                      Ver y gestionar tus sesiones activas
                    </p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-zinc-800 cursor-pointer hover:bg-zinc-700 rounded-lg text-sm font-medium transition-all duration-200 border border-zinc-700 hover:border-yellow-500/50">
                  Ver
                </button>
              </div>
            </div>
          </div>

          {/* Información Legal */}
          <div className="mb-8 backdrop-blur-md bg-zinc-900/70 rounded-2xl p-6 border border-zinc-700 shadow-xl transition-all duration-300 hover:shadow-yellow-500/10">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold">Información Legal</h2>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Términos y condiciones de uso
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-4 border-b border-zinc-800/50 hover:bg-zinc-800/20 px-3 rounded-lg transition-all duration-200">
                <p className="font-medium">Términos de Servicio</p>
                <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 cursor-pointer rounded-lg text-sm font-medium transition-all duration-200 border border-zinc-700 hover:border-yellow-500/50">
                  Ver
                </button>
              </div>

              <div className="flex items-center justify-between py-4 border-b border-zinc-800/50 hover:bg-zinc-800/20 px-3 rounded-lg transition-all duration-200">
                <p className="font-medium">Política de Privacidad</p>
                <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 cursor-pointer rounded-lg text-sm font-medium transition-all duration-200 border border-zinc-700 hover:border-yellow-500/50">
                  Ver
                </button>
              </div>

              <div className="flex items-center justify-between py-4 hover:bg-zinc-800/20 px-3 rounded-lg transition-all duration-200">
                <p className="font-medium">Licencias de Terceros</p>
                <button className="px-4 py-2 bg-zinc-800 cursor-pointer hover:bg-zinc-700 rounded-lg text-sm font-medium transition-all duration-200 border border-zinc-700 hover:border-yellow-500/50">
                  Ver
                </button>
              </div>
            </div>
          </div>

          {/* Botones de Sesión y Cuenta */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between mb-10">
            <button className="group flex items-center justify-center gap-2 px-6 py-3 cursor-pointer  bg-zinc-800 hover:bg-zinc-700 rounded-xl text-white font-medium transition-all duration-300 border border-zinc-700 hover:border-yellow-500/50 w-full sm:w-auto">
              <LogOut
                size={18}
                className="group-hover:translate-x-1 transition-transform duration-300 "
              />
              Cerrar Sesión
            </button>
            <button className="group flex items-center justify-center gap-2 px-6 py-3 cursor-pointer bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 rounded-xl text-white font-medium transition-all duration-300 shadow-lg hover:shadow-red-500/20 w-full sm:w-auto">
              <UserX
                size={18}
                className="group-hover:rotate-12 transition-transform duration-300 "
              />
              Eliminar Cuenta
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsApp;
