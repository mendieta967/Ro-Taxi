import useSignalR from "@/hooks/useSignalR";
import { createContext, useContext, useEffect } from "react";
import { useAuth } from "./auth";
import Loader from "@/components/common/Loader";
import { validateLocationPermission } from "@/lib/utils";

const ConnectionContext = createContext();

export default function ConnectionProvider({ children }) {
  const { isConnected, connect, disconnect, on, invoke, off, loading } =
    useSignalR();

  const { user } = useAuth();

  const handleConnect = async () => {
    if (!user) return;
    try {
      if (user.role === "Driver") {
        await validateLocationPermission();
      }
      await connect();
    } catch (error) {
      console.log(error);
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert(
              "Debés habilitar la ubicación desde la configuración del navegador."
            );
            break;
          case error.POSITION_UNAVAILABLE:
            alert("No se pudo determinar la ubicación.");
            break;
          case error.TIMEOUT:
            alert("La solicitud de ubicación tardó demasiado.");
            break;
          default:
            alert("Ocurrió un error desconocido con la ubicación.");
        }
      }
    }
  };

  useEffect(() => {
    if (!user) return;
    if (user.role === "Driver") return;
    handleConnect();
  });

  if (loading) return <Loader />;

  return (
    <ConnectionContext.Provider
      value={{
        isConnected,
        connect,
        disconnect,
        on,
        invoke,
        off,
        handleConnect,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
}

export const useConnection = () => {
  const context = useContext(ConnectionContext);
  if (!context)
    throw new Error("useConnection must be within connection provider");
  return context;
};
