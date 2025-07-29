// src/routes/AppRoute.jsx

import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import PagosPassenger from "../page/passenger/pagos/PagosPassenger";
import PerfilApp from "../page/perfil/PerfilApp";
import PassengerLayout from "../page/passenger/PassangerLayout";
import SettingsApp from "../page/settings/SettingsApp";
import AuthPage from "../page/auth/AuthPage";
import CompleteAccount from "../page/auth/completeAccount/CompleteAccount";
import HomeSuperAdmin from "../page/admin/home/HomeSuperAdmin";
import ChatDriver from "../page/driver/chat/ChatDriver";
import VehiculosDriver from "../page/driver/misVehiculos/VehiculosDriver";
import ProtectedRoute from "../utils/ProtectedRoute";
import Ubicaciones from "../page/admin/ubicacion/Ubicaciones";
import NotFound from "../page/notFound/NotFound";
import RecoverPassword from "../page/auth/recoverPassword/recoverPassword";
import LandingPage from "../page/landing/LandingPage";
import { Historial, Home } from "./CommonRoute";

const router = createBrowserRouter([
  {
    path: "/app",
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
            <PerfilApp />
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
            <SettingsApp />
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

      // Rutas del conductor
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
      // Rutas del admin
      {
        path: "home-admin",
        element: (
          <ProtectedRoute role={["Admin"]}>
            <HomeSuperAdmin />
          </ProtectedRoute>
        ),
      },
      {
        path: "ubicaciónes",
        element: (
          <ProtectedRoute role={["Admin"]}>
            <Ubicaciones />
          </ProtectedRoute>
        ),
      },
    ],
  },

  { path: "/", element: <LandingPage /> },
  { path: "complete-account", element: <CompleteAccount /> },
  { path: "login", element: <AuthPage /> },
  { path: "*", element: <NotFound /> },
  { path: "/recoverPassword", element: <RecoverPassword /> },
]);

const AppRoute = () => {
  return <RouterProvider router={router} />;
};

export default AppRoute;
