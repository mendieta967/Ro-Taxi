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
const Sidebar = ({ isMobile, isOpen, toggleSidebar }) => {
  const {
    user: { role },
  } = useAuth();
  const passengerLinks = [
    { icon: <Home />, label: "Inicio", to: "/home" },
    { icon: <User />, label: "Perfil", to: "/perfil" },
    {
      icon: <Clock />,
      label: "Mis Viajes",
      to: "/mis-viajes",
    },
    { icon: <CreditCard />, label: "Pagos", to: "/pagos" },
    {
      icon: <Settings />,
      label: "Configuración",
      to: "/configuracion",
    },
  ];
  const driverLinks = [
    { icon: <Home />, label: "Inicio", to: "/home" },
    { icon: <User />, label: "Perfil", to: "/perfil" },
    {
      icon: <Clock />,
      label: "Mis Viajes",
      to: "/mis-viajes",
    },
    { icon: <CreditCard />, label: "Chat", to: "/chat" },
    { icon: <CreditCard />, label: "Vehiculos", to: "/vehiculos" },
    {
      icon: <Settings />,
      label: "Configuración",
      to: "/configuracion",
    },
  ];
  const adminLinks = [
    { icon: <Home />, label: "Inicio", to: "/home" },
    { icon: <User />, label: "Perfil", to: "/perfil" },
    {
      icon: <Locate />,
      label: "Ubicaciones",
      to: "/ubicaciónes",
    },

    {
      icon: <Settings />,
      label: "Configuración",
      to: "/configuracion",
    },
  ];

  const links =
    role === "Client"
      ? passengerLinks
      : role === "Driver"
      ? driverLinks
      : adminLinks;

  const sidebarContent = (
    <div className="flex flex-col h-full w-64 bg-yellow-500 text-taxi-contrast">
      {!(isMobile && isOpen) && (
        <div className="flex justify-center items-center gap-2 px-6 py-8">
          <img
            src="/logo.png"
            alt="logo-taxi"
            className="w-12 h-12 rounded-full border-2 border-gray-800"
          />
          <h1 className="text-2xl font-bold">
            <span className="bg-taxi-contrast text-gray-900 p-1 rounded-md">
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
                className="flex items-center px-4 py-3 rounded-lg transition-colors text-gray-900 hover:bg-gray-900/95 hover:text-yellow-500 font-bold"
              >
                <span className="mr-3 w-5 h-5">{icon}</span>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 mt-auto">
        <div className="border-2 border-gray-800 rounded-lg p-4">
          <p className="font-medium text-gray-900 text-center">
            ¿Necesitas ayuda?
          </p>
          <p className="text-sm text-center text-gray-800 opacity-90 mt-1">
            Contáctanos al soporte
          </p>
          <button className="mt-3 w-full bg-gray-900 hover:bg-gray-800 text-yellow-500 font-medium px-3 py-2 rounded-lg text-sm transition-colors">
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
              className="flex-1 bg-black bg-opacity-50"
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
