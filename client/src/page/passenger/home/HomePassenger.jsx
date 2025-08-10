import MainLayout from "../../../components/layout/MainLayout";
import { Star } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useAuth } from "../../../context/auth";
import { ThemeContext } from "../../../context/ThemeContext";
import { useTranslate } from "../../../hooks/useTranslate";
import { getProgramados } from "../../../services/ride";
import MapOnly from "../../../components/common/Map/mapHome/MapOnly";
import { Link } from "react-router-dom";

const HomePassenger = () => {
  const { user } = useAuth();
  const { theme } = useContext(ThemeContext);
  const [rideProximo, setRideProximo] = useState(null);
  //const [tripAccepted, setTripAccepted] = useState(null);
  const [viajesRecientes, setViajesRecientes] = useState([]);

  const translate = useTranslate();

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await getProgramados();
        console.log("Response:", response);

        // ✅ VIAJES PROGRAMADOS (futuros o activos con fecha programada)
        const programados = response.data.filter(
          (ride) => ride?.startedAt !== null && ride.status !== "Completed"
        );

        // Ordenar por fecha programada (más próximos primero)
        programados.sort(
          (a, b) => new Date(a.startedAt) - new Date(b.startedAt)
        );

        // Guardar el próximo viaje programado
        setRideProximo(programados[0] || null);

        // ✅ VIAJES COMPLETADOS
        const completados = response.data
          .filter((ride) => ride.status === "Completed")
          .sort(
            (a, b) =>
              new Date(b.scheduledAt || b.startedAt) -
              new Date(a.scheduledAt || a.startedAt)
          );

        // Tomar los 3 más recientes
        const top3Completados = completados.slice(0, 3);

        // Guardar los completados
        setViajesRecientes(top3Completados);
      } catch (error) {
        console.error("Error fetching rides:", error);
      }
    };

    fetchRides();
  }, []);

  return (
    <MainLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda (Formulario + Mapa) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Encabezado */}
          <div>
            <h1
              className={`text-3xl font-bold ${
                theme === "dark" ? "text-yellow-500" : "text-gray-900"
              }`}
            >
              ¡{translate("Hola")}, {user.userName.split(" ")[0]}!
            </h1>
            <p
              className={`text-lg ${
                theme === "dark" ? "text-zinc-300" : "text-gray-800"
              }`}
            >
              {translate("¿A dónde quieres ir hoy?")}
            </p>
          </div>

          {/* Contenedor principal */}
          <div
            className={`rounded-xl overflow-hidden ${
              theme === "dark"
                ? "bg-zinc-900 border border-zinc-800"
                : "bg-white border border-yellow-500"
            }`}
          >
            <div className="h-113  rounded-lg overflow-hidden">
              <MapOnly />
            </div>
          </div>
        </div>

        {/* Columna derecha (Viajes recientes) */}
        <div
          className={`p-5 rounded-xl space-y-6 h-fit ${
            theme === "dark"
              ? "bg-zinc-900 border border-zinc-800"
              : "bg-white border border-yellow-500"
          }`}
        >
          <h2
            className={`text-2xl font-bold ${
              theme === "dark" ? "text-yellow-500" : "text-gray-900"
            }`}
          >
            {translate("Viajes Recientes")}
          </h2>

          <div className="space-y-4">
            {viajesRecientes
              .filter((viaje) => viaje.status === "Completed")
              .map((viaje) => (
                <div
                  key={viaje.id}
                  className={`p-5 rounded-xl flex justify-between items-start shadow transition-transform hover:scale-[1.01] ${
                    theme === "dark"
                      ? "bg-zinc-800 hover:bg-zinc-700 border border-zinc-700"
                      : "bg-white hover:bg-yellow-50 border border-yellow-300"
                  }`}
                >
                  <div className="space-y-3">
                    <div>
                      <p
                        className={`text-sm font-semibold ${
                          theme === "dark"
                            ? "text-yellow-400"
                            : "text-yellow-700"
                        }`}
                      >
                        Origen
                      </p>
                      <p
                        className={`text-base ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {viaje.originAddress}
                      </p>
                    </div>

                    <div>
                      <p
                        className={`text-sm font-semibold ${
                          theme === "dark"
                            ? "text-yellow-400"
                            : "text-yellow-700"
                        }`}
                      >
                        Destino
                      </p>
                      <p
                        className={`text-base ${
                          theme === "dark" ? "text-zinc-300" : "text-gray-700"
                        }`}
                      >
                        {viaje.destinationAddress}
                      </p>
                    </div>

                    <p
                      className={`text-base font-bold ${
                        theme === "dark" ? "text-yellow-300" : "text-yellow-600"
                      }`}
                    >
                      Precio: ${viaje.payment.amount}
                    </p>
                  </div>

                  <div
                    className={`flex items-center rounded-full px-3 py-1 text-sm font-medium shadow-sm ${
                      theme === "dark"
                        ? "bg-yellow-600 text-white"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    <Star size={16} className="mr-1" />
                    {viaje.driver.averageRating}
                  </div>
                </div>
              ))}
          </div>
          <Link to="/app/mis-viajes">
            <button
              className={`w-full text-sm text-center cursor-pointer font-medium hover:underline ${
                theme === "dark" ? "text-yellow-400" : "text-gray-800"
              }`}
            >
              {translate("Ver todos los viajes")}
            </button>
          </Link>
        </div>

        {/* Tarjetas informativas */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {rideProximo && (
            <Link to="/app/mis-viajes" className="block">
              <div
                className={`transition p-6 rounded-2xl shadow-lg border-l-8 ${
                  theme === "dark"
                    ? "bg-zinc-900 border-yellow-500 hover:bg-zinc-800"
                    : "bg-white border-yellow-500 hover:bg-yellow-50"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <svg
                    className="w-6 h-6 text-yellow-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7V3m8 4V3m-9 4h10M5 11h14M5 19h14M5 15h14M3 7h18"
                    />
                  </svg>
                  <h3
                    className={`text-lg font-semibold ${
                      theme === "dark" ? "text-white" : "text-gray-800"
                    }`}
                  >
                    Próximo viaje programado
                  </h3>
                </div>
                <p
                  className={`text-base ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {new Date(rideProximo.startedAt).toLocaleString("es-AR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <p
                  className={`text-base ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Precio: {rideProximo.payment.amount}
                </p>
              </div>
            </Link>
          )}

          {/* Tarjeta para agregar */}
          <div
            className={`transition p-5 rounded-lg flex flex-col items-center justify-center text-center space-y-2 shadow-sm ${
              theme === "dark"
                ? "bg-zinc-900 hover:bg-zinc-800"
                : "bg-white border border-yellow-500 hover:bg-yellow-50"
            }`}
          >
            <div className="w-10 h-10 flex items-center justify-center bg-yellow-500 text-black text-xl font-bold rounded-full">
              +
            </div>
            <h3
              className={`font-semibold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {translate("Agregar")}
            </h3>

            <p
              className={`text-sm ${
                theme === "dark" ? "text-zinc-300" : "text-gray-700"
              }`}
            >
              {translate("Añadir nuevo destino o preferencia")}
            </p>
          </div>

          <div
            className={`transition p-5 rounded-lg flex flex-col items-center justify-center text-center space-y-2 shadow-sm ${
              theme === "dark"
                ? "bg-zinc-900 hover:bg-zinc-800"
                : "bg-white border border-yellow-500 hover:bg-yellow-50"
            }`}
          >
            <div className="w-10 h-10 flex items-center justify-center bg-yellow-500 text-black text-xl font-bold rounded-full">
              +
            </div>
            <h3
              className={`font-semibold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {translate("Agregar")}
            </h3>

            <p
              className={`text-sm ${
                theme === "dark" ? "text-zinc-300" : "text-gray-700"
              }`}
            >
              Añadir metodo de pago
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePassenger;
