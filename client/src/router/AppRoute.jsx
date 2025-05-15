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
import ProtectedRoute from "../utils/ProtectedRoute";
import { Historial, Home, Perfil } from "./CommonRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PassengerLayout />,
    children: [
      // Redirección automática desde "/"
      { index: true, element: <Navigate to="home" replace /> },

      // Rutas del pasajero
      {
        path: "home",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "perfil",
        element: (
          <ProtectedRoute>
            <PerfilPassenger />
          </ProtectedRoute>
        ),
      },
      {
        path: "mis-viajes",
        element: (
          <ProtectedRoute>
            <Historial />
          </ProtectedRoute>
        ),
      },
      {
        path: "configuracion",
        element: (
          <ProtectedRoute>
            <SettingsPassenger />
          </ProtectedRoute>
        ),
      },
      {
        path: "pagos",
        element: (
          <ProtectedRoute role={["Client"]}>
            <PagosPassenger />
          </ProtectedRoute>
        ),
      },
      {
        path: "chat",
        element: (
          <ProtectedRoute role={["Driver"]}>
            <ChatDriver />
          </ProtectedRoute>
        ),
      },
      {
        path: "vehiculos",
        element: (
          <ProtectedRoute role={["Driver"]}>
            <VehiculosDriver />
          </ProtectedRoute>
        ),
      },

      // Ruta para errores 404 dentro del layout
      { path: "*", element: <h1>404 - Página no encontrada</h1> },
    ],
  },

  { path: "complete-account", element: <CompleteAccount /> },
  { path: "login", element: <AuthPage /> },
  { path: "*", element: <h1>404 - Página no encontrada</h1> },
]);

const AppRoute = () => {
  return <RouterProvider router={router} />;
};

export default AppRoute;
