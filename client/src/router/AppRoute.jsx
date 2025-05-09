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
import ProtectedRoute from "../utils/ProtectedRoute";
import AuthPage from "../page/auth/AuthPage";
import CompleteAccount from "../page/auth/completeAccount/CompleteAccount";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <PassengerLayout />
      </ProtectedRoute>
    ),
    children: [
      // Redirección automática desde "/"
      { index: true, element: <Navigate to="home" replace /> },

      // Rutas del pasajero
      { path: "home", element: <HomePassenger /> },
      { path: "perfil", element: <PerfilPassenger /> },
      { path: "mis-viajes", element: <HistorialPassenger /> },
      { path: "pagos", element: <PagosPassenger /> },
      { path: "configuracion", element: <SettingsPassenger /> },

      // Ruta para errores 404 dentro del layout
      { path: "*", element: <h1>404 - Página no encontrada</h1> },
    ],
  },
  // Ruta para errores 404 globales
  { path: "login", element: <AuthPage /> },
  { path: "complete-account", element: <CompleteAccount /> },
  { path: "*", element: <h1>404 - Página no encontrada</h1> },
]);

const AppRoute = () => {
  return <RouterProvider router={router} />;
};

export default AppRoute;
