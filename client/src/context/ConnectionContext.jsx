import useSignalR from "@/hooks/useSignalR";
import { createContext, useContext, useEffect } from "react";
import { useAuth } from "./auth";
import Loader from "@/components/common/Loader";

const ConnectionContext = createContext();

export default function ConnectionProvider({ children }) {
  const { isConnected, connect, disconnect, on, invoke, off, loading } =
    useSignalR();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    if (user.role === "Driver") return;
    connect();
  });

  if (loading) return <Loader />;

  return (
    <ConnectionContext.Provider
      value={{ isConnected, connect, disconnect, on, invoke, off }}
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
