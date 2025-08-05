import { ThemeContext } from "@/context/ThemeContext";
import { useContext, useEffect } from "react";
import { useTranslate } from "../../../hooks/useTranslate";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useConnection } from "@/context/ConnectionContext";

export default function Ubicacion({ selectedVehicle }) {
  const { theme } = useContext(ThemeContext);
  const translate = useTranslate();
  const { on, off } = useConnection();

  var updatedAt = new Date(selectedVehicle.lastLocationAt);
  const humanReadable = formatDistanceToNow(updatedAt, {
    addSuffix: true,
    locale: es,
  });

  useEffect(() => {
    const handleDriverLocation = (data) => {
      console.log("📍 Nueva ubicación del conductor recibida:", data);
    };

    on("DriverLocationUpdated", handleDriverLocation);

    return () => {
      off("DriverLocationUpdated", handleDriverLocation);
    };
  }, []);

  return (
    <main
      className={
        theme === "dark"
          ? "flex-1 bg-zinc-900 border border-zinc-700 rounded-2xl overflow-hidden shadow-lg"
          : "flex-1 bg-white border border-yellow-500 rounded-2xl overflow-hidden shadow-lg"
      }
    >
      {/* Placeholder Mapa */}
      <section
        className={
          theme === "dark"
            ? "flex flex-col items-center justify-center text-center p-8 border-b border-zinc-700"
            : "flex flex-col items-center justify-center text-center p-8 border-b border-yellow-500"
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-60 w-60 text-gray-500 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 20l-5.447-2.724A2 2 0 013 15.382V5.618a2 2 0 011.105-1.789L9 2m0 0l6 2.618M9 2v18m6-15.382l5.447 2.724A2 2 0 0121 8.618v9.764a2 2 0 01-1.105 1.789L15 22V5.618z"
          />
        </svg>
        <p className="text-base">
          En una implementación real, aquí se mostraría un mapa interactivo con
          la ubicación de los vehículos.
        </p>
        <p className="text-sm text-gray-400 mt-1">
          Se necesitaría integrar una API de mapas como Google Maps o Mapbox.
        </p>
      </section>

      {/* Detalles del vehículo seleccionado */}

      <section className="p-6">
        <header className="flex justify-between items-start mb-6">
          <h2 className="text-xl font-bold">
            {translate("vehiculo")} {selectedVehicle.plate}
          </h2>
          <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {selectedVehicle.status}
          </span>
        </header>

        <div
          className={
            theme === "dark"
              ? "grid grid-cols-1 sm:grid-cols-2 gap-y-6 text-sm text-white mb-6"
              : "grid grid-cols-1 sm:grid-cols-2 gap-y-6 text-sm text-gray-900 mb-6"
          }
        >
          <div>
            <p
              className={
                theme === "dark" ? "text-gray-400 mb-1" : "text-gray-900 mb-1"
              }
            >
              {translate("Conductor")}
            </p>
            <p className="font-semibold">{selectedVehicle.driver.name}</p>
          </div>
          <div>
            <p
              className={
                theme === "dark" ? "text-gray-400 mb-1" : "text-gray-900 mb-1"
              }
            >
              {translate("Ultima actualización")}
            </p>
            <p className="font-semibold">{humanReadable}</p>
          </div>
          <div className="sm:col-span-2">
            <p
              className={
                theme === "dark" ? "text-gray-400 mb-1" : "text-gray-900 mb-1"
              }
            >
              {translate("Ubicación actual")}
            </p>
            <p className="font-semibold">{selectedVehicle.location}</p>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button className="bg-yellow-600 hover:bg-yellow-500 text-white font-semibold px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200">
            {translate("Ver ruta")}
          </button>
        </div>
      </section>
    </main>
  );
}
