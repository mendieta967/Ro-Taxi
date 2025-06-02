import {
  Home,
  Clock,
  User,
  CreditCard,
  Settings,
  Menu,
  Locate,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/auth";
import { useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import { useTranslate } from "../../../hooks/useTranslate";
const Sidebar = ({ isMobile, isOpen, toggleSidebar }) => {
  const {
    user: { role },
  } = useAuth();
  const { theme } = useContext(ThemeContext);
  const translate = useTranslate();
  const passengerLinks = [
    { icon: <Home />, label: translate("Inicio"), to: "/app/home" },
    { icon: <User />, label: translate("Perfil"), to: "/app/perfil" },
    {
      icon: <Clock />,
      label: translate("Mis Viajes"),
      to: "/app/mis-viajes",
    },
    { icon: <CreditCard />, label: translate("Pagos"), to: "/app/pagos" },
    {
      icon: <Settings />,
      label: translate("Configuración"),
      to: "/app/configuracion",
    },
  ];
  const driverLinks = [
    { icon: <Home />, label: translate("Inicio"), to: "/app/home" },
    { icon: <User />, label: translate("Perfil"), to: "/app/perfil" },
    {
      icon: <Clock />,
      label: translate("Mis Viajes"),
      to: "/app/mis-viajes",
    },
    { icon: <CreditCard />, label: translate("Chat"), to: "/app/chat" },
    { icon: <CreditCard />, label: translate("Vehiculos"), to: "/app/vehiculos" },
    {
      icon: <Settings />,
      label: translate("Configuración"),
      to: "/app/configuracion",
    },
  ];
  const adminLinks = [
    { icon: <Home />, label: translate("Inicio"), to: "/app/home" },
    { icon: <User />, label: translate("Perfil"), to: "/app/perfil" },
    {
      icon: <Locate />,
      label: translate("Ubicaciones"),
      to: "/app/ubicaciónes",
    },

    {
      icon: <Settings />,
      label: translate("Configuración"),
      to: "/app/configuracion",
    },
  ];

  const links =
    role === "Client"
      ? passengerLinks
      : role === "Driver"
      ? driverLinks
      : adminLinks;

  const sidebarContent = (
    <div
      className={`flex flex-col h-full w-64 ${
        theme === "dark"
          ? "bg-yellow-500"
          : "bg-gray-900 border-r border-yellow-500"
      } text-taxi-contrast`}
    >
      {!(isMobile && isOpen) && (
        <div className="flex justify-center items-center gap-2 px-6 py-8">
          <img
            src="/logo.png"
            alt="logo-taxi"
            className="w-12 h-12 rounded-full border-2 border-gray-800"
          />
          <h1 className="text-2xl font-bold">
            <span
              className={`bg-taxi-contrast p-1 rounded-md ${
                theme === "dark" ? "text-gray-900 " : "text-yellow-500"
              }`}
            >
              Ro-Taxi
            </span>
          </h1>
        </div>
      )}

      <nav className="flex-1 px-4 mt-20 sm:mt-0">
        {" "}
        {/* Aquí se añade mt-20 para dispositivos pequeños */}
        <ul className="space-y-2">
          {links.map(({ icon, label, to }, i) => (
            <li key={i}>
              <Link
                to={to}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  theme === "dark"
                    ? "text-gray-900 hover:bg-gray-900/95 hover:text-yellow-500"
                    : "text-yellow-500 hover:bg-yellow-500 hover:text-gray-900"
                } font-bold`}
              >
                <span className="mr-3 w-5 h-5">{icon}</span>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 mt-auto">
        <div
          className={`border-2 border-gray-800 ${
            theme === "dark" ? "bg-gray-900" : "bg-yellow-500"
          } rounded-lg p-4`}
        >
          <p
            className={`font-medium  text-center ${
              theme === "dark" ? "text-yellow-500" : "text-gray-900"
            }`}
          >
            ¿Necesitas ayuda?
          </p>
          <p
            className={`text-sm text-center opacity-90 mt-1 ${
              theme === "dark" ? "text-gray-400" : "text-gray-800"
            }`}
          >
            Contáctanos al soporte
          </p>
          <button
            className={`mt-3 w-full  font-medium px-3 py-2 rounded-lg text-sm transition-colors ${
              theme === "dark"
                ? "bg-yellow-500 hover:bg-yellow-400"
                : " bg-gray-900 hover:bg-gray-800 text-yellow-500"
            }`}
          >
            Contactar
          </button>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <button
          onClick={toggleSidebar}
          className="md:hidden fixed top-4 left-4 z-50  p-2 rounded-md shadow-lg"
        >
          <Menu className="h-6 w-6 text-white" />
        </button>
        {isOpen && (
          <div className="fixed inset-0 z-40 flex">
            <div className="w-64 h-full shadow-lg z-50">{sidebarContent}</div>
            <div
              className="flex-1 bg-transparent bg-opacity-30"
              onClick={toggleSidebar}
            />
          </div>
        )}
      </>
    );
  }

  return <div className="hidden md:flex h-screen">{sidebarContent}</div>;
};

export default Sidebar;
