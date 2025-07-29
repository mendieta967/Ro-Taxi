import { ThemeContext } from "../../../../context/ThemeContext";
import { useContext, useEffect, useState, useRef } from "react";
import { MapPin } from "lucide-react";
import { toast } from "sonner";
import { useVehicle } from "@/context/VehicleContext";

import {
  getDriver,
  acceptViaje,
  rejectViaje,
} from "../../../../services/driver";

const ScheduledTrips = () => {
  const [selectedTrip, setSelectedTrip] = useState([]);
  const { theme } = useContext(ThemeContext);
  const { selectVehicle } = useVehicle();
  const intervalRef = useRef(null);

  // Llamado a los viajes programados
  const fetchScheduledTrips = async () => {
    try {
      const response = await getDriver();
      const pendingTrips = response.data.filter(
        (trip) => trip?.status === "Pending"
      );
      setSelectedTrip(pendingTrips);
    } catch (error) {
      console.error("Error fetching scheduled trips:", error);
    }
  };

  useEffect(() => {
    // Primera llamada inmediata
    fetchScheduledTrips();

    // Iniciar polling si no existe
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        fetchScheduledTrips();
      }, 10000);
      console.log("Polling iniciado cada 5 segundos.");
    }

    // Cleanup cuando el componente se desmonta
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        console.log("Polling detenido al desmontar componente.");
      }
    };
  }, []);

  // Función para aceptar viaje programados
  const handleAcceptTrip = async (trip) => {
    try {
      const response = await acceptViaje(trip.id, selectVehicle);
      console.log("Response:", response);
      setSelectedTrip((prev) => prev.filter((t) => t.id !== trip.id));
      toast("✅ Viaje aceptado", {
        description: "El viaje programado fue aceptado correctamente.",
      });
    } catch (error) {
      console.error("Error aceptando viaje:", error);
    }
  };

  // Función para rechazar viaje programados
  const handleRejectTrip = async (riderId) => {
    try {
      await rejectViaje(riderId);
      console.log("Viaje cancelado con éxito");
      setSelectedTrip((prev) => prev.filter((t) => t.id !== riderId));
      toast("❌ Viaje rechazado", {
        description: "El viaje programado fue rechazado correctamente.",
      });
    } catch (error) {
      console.error(`Error cancelando viaje con ID ${riderId}:`, error);
    }
  };

  return (
    <div>
      {selectedTrip.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          No hay viajes programados pendientes.
        </p>
      ) : (
        selectedTrip.map((viaje) => (
          <div
            key={viaje.id}
            className={`backdrop-blur-md rounded-2xl border shadow-xl mb-6 overflow-hidden ${
              theme === "dark"
                ? "bg-zinc-900/70 border-zinc-800/50"
                : "bg-white/70 border-yellow-500"
            }`}
          >
            {/* Cabecera con fecha y precio */}
            <div
              className={`p-3 flex justify-between items-center ${
                theme === "dark" ? "bg-zinc-800/70" : "bg-white text-yellow-500"
              }`}
            >
              <div className="text-sm font-medium text-gray-400">
                {new Date(viaje.scheduledAt).toLocaleString("es-AR", {
                  weekday: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                  day: "2-digit",
                  month: "short",
                })}
              </div>
              <div className="text-lg font-bold">${viaje.payment.amount}</div>
            </div>

            {/* Ruta del viaje */}
            <div className="p-4 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-green-900/30 flex items-center justify-center flex-shrink-0">
                  <MapPin size={20} className="text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Recoger en</p>
                  <p className="font-medium">{viaje.originAddress}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-red-900/30 flex items-center justify-center flex-shrink-0">
                  <MapPin size={20} className="text-red-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Destino</p>
                  <p className="font-medium">{viaje.destinationAddress}</p>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => handleAcceptTrip(viaje)}
                  className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg"
                >
                  Aceptar
                </button>

                <button
                  onClick={() => handleRejectTrip(viaje.id)}
                  className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-lg"
                >
                  Rechazar
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ScheduledTrips;
