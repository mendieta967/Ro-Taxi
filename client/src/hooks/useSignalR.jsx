import { useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";

const hubUrl = `${import.meta.env.VITE_BASE_URL}/rideHub`;

export default function useSignalR() {
  const [isConnected, setIsConnected] = useState(false);
  const connectionRef = useRef(null);

  const connect = async () => {
    if (connectionRef.current) return; // ya conectado o en proceso

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connection.onclose(() => {
      setIsConnected(false);
      connectionRef.current = null;
    });

    connection
      .start()
      .then(() => {
        console.log("Conectado al hub:", hubUrl);
        setIsConnected(true);
      })
      .catch((err) => console.error("Error al conectar al hub:", err));

    connectionRef.current = connection;
  };

  const on = (eventName, callback) => {
    connectionRef.current?.on(eventName, callback);
  };

  const invoke = async (methodName, ...args) => {
    if (connectionRef.current) {
      return connectionRef.current.invoke(methodName, ...args);
    }
    throw new Error("Connection not established");
  };

  const disconnect = () => {
    if (connectionRef.current) {
      return connectionRef.current.stop();
    }
    return Promise.resolve();
  };

  const off = (eventName, callback) => {
    connectionRef.current?.off(eventName, callback);
  };

  return { isConnected, connect, on, invoke, disconnect, off };
}
