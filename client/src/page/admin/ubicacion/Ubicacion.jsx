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
  const { on, off, invoke } = useConnection();
  const [driverLocation, setDriverLocation] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [loading, setLoading] = useState(true);

  const updatedAt = (date) => {
    if (!date) return;
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: es,
    });
  };

  console.log({ driverLocation });

  useEffect(() => {
    setLoading(true);
    if (selectedVehicle.latitude && selectedVehicle.longitude) {
      setDriverLocation({
        lat: selectedVehicle.latitude,
        lng: selectedVehicle.longitude,
      });
    }
    setLastUpdate(selectedVehicle.lastLocationAt);

    const handleDriverLocation = (data) => {
      console.log("📍 Nueva ubicación del conductor recibida:", data);
      setDriverLocation({ lat: data.lat, lng: data.lng });
      setLastUpdate(new Date());
      setLoading(false);
    };

    invoke("JoinVehicleGroup", selectedVehicle.id).then(() => {
      console.log("Unido al grupo del vehículo", selectedVehicle.id);
    });

    on("DriverLocationUpdated", handleDriverLocation);

    const timeoutId = setTimeout(() => {
      console.warn("⚠️ No se recibió la ubicación del conductor a tiempo");
      setLoading(false);
    }, 5000);

    return () => {
      setDriverLocation(null);
      off("DriverLocationUpdated", handleDriverLocation);
      invoke("LeaveVehicleGroup", selectedVehicle.id).then(() => {
        console.log("Salido del grupo del vehículo", selectedVehicle.id);
      });
      clearTimeout(timeoutId);
    };
  }, [selectedVehicle]);

  const statusColors =
    selectedVehicle.status === "Active"
      ? "bg-green-600 text-white"
      : selectedVehicle.status === "Inactive"
      ? "bg-yellow-500 text-white"
      : "bg-red-600 text-white";

  return (
    <main
      className={
        theme === "dark"
          ? "flex-1 bg-zinc-900 border border-zinc-700 rounded-2xl overflow-hidden shadow-lg"
          : "flex-1 bg-white border border-yellow-500 rounded-2xl overflow-hidden shadow-lg"
      }
    >
      {/* Detalles */}
      <section className="p-6">
        <header className="flex justify-between items-start mb-6">
          <h2 className="text-xl font-bold">
            {translate("vehiculo")} {selectedVehicle.plate}
          </h2>
          <span
            className={`${statusColors} text-xs font-semibold px-3 py-1 rounded-full`}
          >
            {selectedVehicle.status ? "Activo" : "Inactivo"}
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
            <p className="font-semibold">
              {loading
                ? "cargando..."
                : lastUpdate
                ? updatedAt(lastUpdate)
                : "-"}
            </p>
          </div>
        </div>
      </section>
      {/* Mapa */}
      <div className="w-full h-150 ">
        <MapDriver driverLocation={driverLocation} />
      </div>
    </main>
  );
}
