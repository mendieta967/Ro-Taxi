import MainLayout from "../../../components/layout/MainLayout";
import { Star } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useAuth } from "../../../context/auth";
import { ThemeContext } from "../../../context/ThemeContext";
import { useTranslate } from "../../../hooks/useTranslate";
import { getProgramados } from "../../../services/ride";
import MapOnly from "../../../components/common/Map/mapHome/MapOnly";
import { Link } from "react-router-dom";

//import { useConnection } from "@/context/ConnectionContext";

const HomePassenger = () => {
  const { user } = useAuth();
  const { theme } = useContext(ThemeContext);
  const [rideProximo, setRideProximo] = useState(null);
  //const [tripAccepted, setTripAccepted] = useState(null);
  const [viajesRecientes, setViajesRecientes] = useState([]);
  //const { on } = useConnection();

  const translate = useTranslate();

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await getProgramados();
        console.log("Response:", response);

        const scheduledTrips = response.data.filter((ride) =>
          ["Completed", "InProgress"].includes(ride?.status)
        );
        console.log(scheduledTrips);

        // Ordenar por fecha programada
        scheduledTrips.sort(
          (a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt)
        );
        console.log(scheduledTrips);

        // Tomar solo los 3 más recientes
        const top3Trips = scheduledTrips.slice(0, 3);
        console.log(top3Trips);
        // Guardar el más próximo
        setViajesRecientes(top3Trips);
        setRideProximo(scheduledTrips[0] || null);
      } catch (error) {
        console.error("Error fetching rides:", error);
      }
    };
    fetchRides();
  }, []);
  {
    /* 
  useEffect(() => {
    on("RideAccepted", (rideId) => {
      console.log("Tu viaje fue aceptado:", rideId);
      setTripAccepted(rideId);
       rideHub.joinRide(rideId); // Se une al mismo grupo ride-{rideId}
    });
  }, []);
 */
  }
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
                    5.0
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
                  {new Date(rideProximo.scheduledAt).toLocaleString("es-AR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
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
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePassenger;

{
  /* Modal Pedir taxi 
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <h2
            className={`${
              theme === "dark" ? "text-white" : "text-gray-900"
            } text-xl font-bold`}
          >
            {translate("Seleccione su vehículo")}
          </h2>
          <p
            className={`${
              theme === "dark" ? "text-white" : "text-gray-900"
            } text-sm mb-4`}
          >
            {translate("Elige el tipo de coche para tu viaje")}
          </p>
          {/* Opciones de vehículos 
          <div className="space-y-3">
            {modalOrderTaxi.map((car) => (
              <div
                key={car.type}
                onClick={() => setSelectedCar(car.type)}
                className={`border rounded-lg p-4 cursor-pointer ${
                  selectedCar === car.type
                    ? "border-yellow-500"
                    : "border-zinc-800"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p
                      className={`${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      } font-semibold`}
                    >
                      {car.name}
                    </p>
                    <p
                      className={`${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      } text-sm`}
                    >
                      {car.desc}
                    </p>
                    <span className="inline-block mt-1 text-xs bg-zinc-700 rounded-full px-2 py-0.5">
                      {car.seats} {translate("pasajeros")}
                    </span>
                  </div>
                  <div className="text-right">
                    <p
                      className={`${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      } text-md font-semibold`}
                    >
                      {car.price}
                    </p>
                    <p
                      className={`${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      } text-sm`}
                    >
                      {translate("Llegada")}: {car.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Método de pago 
          <div className="mt-4 flex space-x-2">
            <button
              onClick={() => setPaymentMethod("efectivo")}
              className={`flex-1 py-2 rounded-lg cursor-pointer ${
                paymentMethod === "efectivo"
                  ? "bg-zinc-700 text-yellow-500"
                  : "bg-zinc-800 text-white "
              }`}
            >
              {translate("Efectivo")}
            </button>
            <button
              onClick={() => setPaymentMethod("tarjeta")}
              className={`flex-1 py-2 rounded-lg cursor-pointer ${
                paymentMethod === "tarjeta"
                  ? "bg-zinc-700 text-yellow-500"
                  : "bg-zinc-800 text-white"
              }`}
            >
              {translate("Tarjeta")}
            </button>
          </div>

          <p
            className={`${
              theme === "dark" ? "text-white" : "text-gray-900"
            } text-sm mt-2`}
          >
            {translate("Pagarás")}{" "}
            {paymentMethod === "efectivo"
              ? translate("en efectivo")
              : translate("con tarjeta")}{" "}
            {translate("final del viaje")}
          </p>

          {/* Confirmar 
          <button
            className="w-full cursor-pointer bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-2 px-4 rounded"
            onClick={handlePedirAhora}
          >
            {translate("Pedir Ahora")}
          </button>
        </Modal>
      )}

      {/* Modal de solicitud 
      {showRequestModal && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-zinc-900 w-[90%] max-w-sm rounded-2xl p-6 text-white text-center">
            <div className="text-4xl mb-4 animate-spin">🚕</div>
            <h2 className="text-xl font-bold">
              {translate("Buscando un taxi cercano")}...
            </h2>
            <p className="text-zinc-400 mt-2">
              {translate("Esto tomará unos segundos")}
            </p>
          </div>
        </div>
      )}

      {/* Modal de confirmación
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            className={` w-[90%] max-w-md rounded-2xl p-6 space-y-4 text-white shadow-xl relative ${
              theme === "dark"
                ? "bg-zinc-900"
                : "bg-white border border-yellow-500"
            }`}
          >
            <div className="flex justify-center">
              <div
                className={`w-16 h-16  rounded-full flex items-center justify-center text-3xl ${
                  theme === "dark" ? "bg-green-800" : "bg-green-800"
                }`}
              >
                ⏱️
              </div>
            </div>

            <h2
              className={`text-2xl font-bold text-center ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {translate("¡Tu taxi está en camino!")}
            </h2>
            <p
              className={`text-center text-zinc-400 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {translate("Llegada estimada")}: 3 minutos
            </p>

            <div
              className={`flex items-center gap-4 p-4 rounded-lg ${
                theme === "dark"
                  ? "bg-zinc-800"
                  : "bg-white border border-yellow-500"
              }`}
            >
              <div>
                <p
                  className={`font-semibold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Juan Rodríguez <span className="text-yellow-500">★ 4.8</span>
                </p>
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Toyota Corolla • XYZ-123 • Azul
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                className={`flex-1 py-2 border rounded-lg cursor-pointer ${
                  theme === "dark"
                    ? "bg-zinc-800 border-zinc-700  hover:bg-zinc-800 "
                    : "bg-yellow-500 border border-yellow-600 hover:bg-yellow-400 "
                }`}
              >
                {translate("Contactar")}
              </button>
              <button
                onClick={() => setShowConfirmationModal(false)}
                className="flex-1 py-2 bg-red-600 hover:bg-red-500 rounded-lg cursor-pointer"
              >
                {translate("Cancelar")}
              </button>
            </div>

            <div
              className={`p-3 rounded-lg text-sm ${
                theme === "dark"
                  ? "bg-zinc-800"
                  : "bg-white border border-yellow-500"
              }`}
            >
              <strong
                className={`${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {translate("¡Taxi en camino!")}
              </strong>
              <p
                className={`${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                {translate("Tu conductor llegará en aproximadamente 3 minutos")}
              </p>
            </div>
          </div>
        </div>
      )} */
}
