import MainLayout from "../../../components/layout/MainLayout";
import { House, Star, MapPin } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useAuth } from "../../../context/auth";
import { ThemeContext } from "../../../context/ThemeContext";
import { useTranslate } from "../../../hooks/useTranslate";
import { getProgramados } from "../../../services/ride";
import MapOnly from "../../../components/common/Map/mapHome/MapOnly";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Modal from "@/components/ui/Modal";
import {
  getAllFavorites,
  deleteFavorite,
} from "../../../services/locationFavorite";

const HomePassenger = () => {
  const { user } = useAuth();
  const { theme } = useContext(ThemeContext);
  const [rideProximo, setRideProximo] = useState(null);
  //const [tripAccepted, setTripAccepted] = useState(null);
  const [viajesRecientes, setViajesRecientes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [favorites, setFavorites] = useState([]);
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
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await getAllFavorites();
        console.log("Response:", response);

        // Si quieres ordenar por id descendente (último primero)
        response.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setFavorites(response); // Guardar todo el array, no solo response[0]
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, []);

  const handleDelete = async (id) => {
    console.log("Deleting favorite with ID:", id);
    try {
      await deleteFavorite(id);
      console.log("Favorite deleted successfully");
      setFavorites((prev) => prev.filter((favorite) => favorite.id !== id));
      toast("✅ Ubicación eliminada con éxito");
    } catch (error) {
      console.error("Error deleting favorite:", error);
    }
  };

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
            <div
              className={`h-113 rounded-lg overflow-hidden transition-all duration-300 ${
                showModal
                  ? "filter blur-sm pointer-events-none select-none"
                  : ""
              }`}
            >
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
                    {viaje.driver.averageRating.toFixed(2)}
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
          {/* Mostrar solo el último favorito */}
          {/* Tarjeta para agregar - Favorito último */}
          {favorites.length > 0 && (
            <div
              className={`transition p-6 rounded-2xl shadow-lg border-l-8 cursor-pointer ${
                theme === "dark"
                  ? "bg-zinc-900 border-yellow-500 hover:bg-zinc-800"
                  : "bg-white border-yellow-500 hover:bg-yellow-50"
              }`}
              onClick={() => setShowModal(true)}
            >
              <div className="flex items-center gap-3 mb-4">
                <Star size={24} className="text-yellow-500" />
                <h3
                  className={`text-lg font-semibold ${
                    theme === "dark" ? "text-white" : "text-gray-800"
                  }`}
                >
                  Ubicaciones Favoritos
                </h3>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <House className="text-yellow-500" size={20} />
                <p
                  className={`text-base font-medium truncate ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                  title={favorites[0].name} // tooltip al hacer hover
                >
                  {favorites[0].name}
                </p>
              </div>
              <div className="flex items-center gap-3 ">
                <MapPin className="text-yellow-500" size={20} />
                <p
                  className={`text-base   ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                  title={favorites[0].name} // tooltip al hacer hover
                >
                  {favorites[0].address}
                </p>
              </div>
            </div>
          )}

          {showModal && (
            <Modal
              onClose={() => setShowModal(false)}
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50"
            >
              <h2 className="text-yellow-400 text-xl font-semibold mb-4">
                Todos los favoritos
              </h2>
              <div className="max-h-[400px] overflow-y-auto space-y-4 px-2">
                {favorites.map((fav) => (
                  <div
                    key={fav.id}
                    className={`p-4 rounded-lg border shadow-sm flex flex-col justify-between ${
                      theme === "dark"
                        ? "border-zinc-700 bg-zinc-900 hover:bg-zinc-800"
                        : "border-yellow-400 bg-yellow-50 hover:bg-yellow-100"
                    } transition`}
                  >
                    <div className="mb-3">
                      <h3
                        className={`font-semibold text-lg ${
                          theme === "dark"
                            ? "text-yellow-400"
                            : "text-yellow-600"
                        } truncate`}
                        title={fav.name}
                      >
                        {fav.name}
                      </h3>
                      <p
                        className={`text-sm mt-1 ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        } truncate`}
                        title={fav.address}
                      >
                        {fav.address}
                      </p>
                    </div>

                    <div className="flex space-x-3 justify-end">
                      <button
                        className={`px-3 py-1 rounded-md text-sm font-semibold transition ${
                          theme === "dark"
                            ? "bg-yellow-600 text-white hover:bg-yellow-500"
                            : "bg-yellow-400 text-yellow-900 hover:bg-yellow-500"
                        }`}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(fav.id)}
                        className={`px-3 py-1 rounded-md text-sm font-semibold transition ${
                          theme === "dark"
                            ? "bg-red-600 text-white hover:bg-red-500"
                            : "bg-red-400 text-red-900 hover:bg-red-500"
                        }`}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="mt-4 px-4 py-2 bg-yellow-400 text-[#1E1E2F] rounded hover:bg-yellow-500 transition"
              >
                Cerrar
              </button>
            </Modal>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePassenger;
