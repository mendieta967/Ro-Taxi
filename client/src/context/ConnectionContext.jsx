import useSignalR from "@/hooks/useSignalR";
import { createContext, useContext } from "react";

const ConnectionContext = createContext();

export default function ConnectionProvider({ children }) {
  const { isConnected, connect, disconnect } = useSignalR();
  return (
    <ConnectionContext.Provider value={{ isConnected, connect, disconnect }}>
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
