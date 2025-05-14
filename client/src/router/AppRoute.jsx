// src/routes/AppRoute.jsx

import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import HomePassenger from "../page/passenger/home/HomePassenger";
import HistorialPassenger from "../page/passenger/historial/HistorialPassenger";
import PagosPassenger from "../page/passenger/pagos/PagosPassenger";
import PerfilPassenger from "../page/passenger/perfil/PerfilPassenger";
import PassengerLayout from "../page/passenger/PassangerLayout";
import SettingsPassenger from "../page/passenger/settings/SettingsPassenger";

import AuthPage from "../page/auth/AuthPage";
import CompleteAccount from "../page/auth/completeAccount/CompleteAccount";

import HomeDriver from "../page/driver/home/HomeDriver";
import HistorialDrivers from "../page/driver/historial/HistorialDriver";
import ChatDriver from "../page/driver/chat/ChatDriver";
import VehiculosDriver from "../page/driver/misVehiculos/VehiculosDriver";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PassengerLayout />,
    children: [
      // Redirección automática desde "/"
      { index: true, element: <Navigate to="home" replace /> },

      // Rutas del pasajero
      { path: "home", element: <HomeDriver /> },
      { path: "perfil", element: <HomePassenger /> },
      { path: "mis-viajes", element: <HistorialDrivers /> },
      { path: "pagos", element: <HistorialPassenger /> },
      { path: "configuracion", element: <VehiculosDriver /> },

      // Ruta para errores 404 dentro del layout
      { path: "*", element: <h1>404 - Página no encontrada</h1> },
    ],
  },
  // Ruta para errores 404 globales
  // { path: "complete-account", element: <CompleteAccount /> },
  { path: "*", element: <h1>404 - Página no encontrada</h1> },
]);

const AppRoute = () => {
  return <RouterProvider router={router} />;
};

export default AppRoute;
