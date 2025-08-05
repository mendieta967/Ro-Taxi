import { ThemeContext } from "@/context/ThemeContext";
import { useContext, useEffect, useState } from "react";
import { useTranslate } from "../../../hooks/useTranslate";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { useConnection } from "@/context/ConnectionContext";
import MapDriver from "@/components/common/Map/mapHome/MapDriver";

export default function Ubicacion({ selectedVehicle }) {
  const { theme } = useContext(ThemeContext);
  const translate = useTranslate();
  const { on, off } = useConnection();
  const [driverLocation, setDriverLocation] = useState(null);

  var updatedAt = new Date(selectedVehicle.lastLocationAt);
  const humanReadable = formatDistanceToNow(updatedAt, {
    addSuffix: true,
    locale: es,
  });

  useEffect(() => {
    const handleDriverLocation = (data) => {
      console.log("📍 Nueva ubicación del conductor recibida:", data);
      setDriverLocation({ lat: data.lat, lng: data.lng });
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
      <div className="w-full h-96">
        <MapDriver driverLocation={driverLocation} />
      </div>
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
