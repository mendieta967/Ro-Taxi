import MainLayout from "../../../components/layout/MainLayout";
import { ThemeContext } from "../../../context/ThemeContext";
import { useTranslate } from "../../../hooks/useTranslate";
import Pagination from "../../../components/ui/Pagination";
import { getRides } from "../../../services/ride";
import {
  Calendar,
  Search,
  MapPin,
  Clock,
  DollarSign,
  ChevronRight,
  Download,
} from "lucide-react";
import { useState, useContext, useEffect } from "react";
const HistorialDriver = () => {
  const { theme } = useContext(ThemeContext);
  const translate = useTranslate();

  const [activeTab, setActiveTab] = useState("all");
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [totalPagesRider, setTotalPagesRider] = useState(1);
  const [pageNumberRider, setPageNumberRider] = useState(1);
  const pageSizeRider = 10;

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await getRides(
          pageNumberRider,
          pageSizeRider,
          searchTerm
        );
        console.log("Response:", response);

        const scheduledTrips = response.data.filter((ride) =>
          ["InProgress", "Completed", "Expired", "Pending"].includes(
            ride?.status
          )
        );
        setTrips(scheduledTrips);
        setTotalPagesRider(response.totalPages);

        console.log(scheduledTrips);
      } catch (error) {
        console.error("Error fetching rides:", error);
      }
    };
    fetchRides();
  }, [pageNumberRider, searchTerm]);

  const handlePageChange = (newPage) => {
    console.log("Cambiando a página:", newPage); // DEBUG
    setPageNumberRider(newPage);
    console.log("Página cambiada a:", newPage);
  };

  const openModal = (trip) => {
    setSelectedTrip(trip);
    setShowModal(true);
  };

  return (
    <MainLayout>
      <div
        className={`min-h-screen  rounded-2xl  p-6 md:p-8 ${
          theme === "dark"
            ? "bg-zinc-900 border-zinc-800 text-white"
            : "bg-white text-gray-900 border border-yellow-500 "
        }`}
      >
        <div className="max-w-4xl mx-auto">
          {/* Filtros y búsqueda */}
          <div
            className={`backdrop-blur-md rounded-2xl p-6 border  shadow-xl mb-8 ${
              theme === "dark"
                ? "bg-zinc-900/70 border-zinc-800/50"
                : "bg-white/70 border-yellow-500"
            }`}
          >
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search
                    className={`h-5 w-5  ${
                      theme === "dark" ? "text-yellow-500" : "text-gray-900"
                    }`}
                  />
                </div>
                <input
                  type="text"
                  className={`block w-full pl-10 pr-3 py-3  transition-all duration-200 ${
                    theme === "dark"
                      ? "border border-zinc-700 rounded-lg bg-zinc-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500"
                      : "border border-yellow-500 rounded-lg bg-white/50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500"
                  }`}
                  placeholder={translate("Buscar por dirección o fecha")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Tabs */}
            <div
              className={`flex  mb-6 ${
                theme === "dark"
                  ? "border-b border-zinc-800"
                  : "border-b border-yellow-500"
              }`}
            >
              <button
                onClick={() => setActiveTab("all")}
                className={`py-2 px-4 font-medium text-sm cursor-pointer ${
                  activeTab === "all"
                    ? "border-b-2 border-yellow-500 text-yellow-500"
                    : theme === "dark"
                    ? "text-gray-400 hover:text-gray-400"
                    : "text-gray-900 hover:text-gray-400"
                }`}
              >
                {translate("Todos")}
              </button>
              <button
                onClick={() => setActiveTab("InProgress")}
                className={`py-2 px-4 font-medium text-sm cursor-pointer ${
                  activeTab === "InProgress"
                    ? "border-b-2 border-yellow-500 text-yellow-500"
                    : theme === "dark"
                    ? "text-gray-400 hover:text-gray-400"
                    : "text-gray-900 hover:text-gray-400"
                }`}
              >
                Pendientes
              </button>
              <button
                onClick={() => setActiveTab("Completed")}
                className={`py-2 px-4 font-medium text-sm cursor-pointer ${
                  activeTab === "completed"
                    ? "border-b-2 border-yellow-500 text-yellow-500"
                    : theme === "dark"
                    ? "text-gray-400 hover:text-gray-400"
                    : "text-gray-900 hover:text-gray-400"
                }`}
              >
                {translate("Completado")}
              </button>
              <button
                onClick={() => setActiveTab("canceled")}
                className={`py-2 px-4 font-medium text-sm cursor-pointer ${
                  activeTab === "canceled"
                    ? "border-b-2 border-yellow-500 text-yellow-500"
                    : theme === "dark"
                    ? "text-gray-400 hover:text-gray-400"
                    : "text-gray-900 hover:text-gray-400"
                }`}
              >
                {translate("Cancelado")}
              </button>
            </div>

            {/* Resumen */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div
                className={`backdrop-blur-md  rounded-xl p-4 border  ${
                  theme === "dark"
                    ? "bg-zinc-900/70 border border-zinc-800/50"
                    : "bg-white/70 border border-yellow-500"
                }`}
              >
                <h3 className="text-sm text-yellow-500 mb-1">
                  {translate("Total de viajes")}
                </h3>
                <p className="text-2xl font-bold">342</p>
              </div>

              <div
                className={`backdrop-blur-md  rounded-xl p-4 border  ${
                  theme === "dark"
                    ? "bg-zinc-900/70 border border-zinc-800/50"
                    : "bg-white/70 border border-yellow-500"
                }`}
              >
                <h3 className="text-sm text-yellow-500 mb-1">
                  {translate("Ingresos totales")}
                </h3>
                <p className="text-2xl font-bold">$45,320</p>
              </div>

              <div
                className={`backdrop-blur-md  rounded-xl p-4 border  ${
                  theme === "dark"
                    ? "bg-zinc-900/70 border border-zinc-800/50"
                    : "bg-white/70 border border-yellow-500"
                }`}
              >
                <h3 className="text-sm text-yellow-500 mb-1">
                  {translate("Distancia total")}
                </h3>
                <p className="text-2xl font-bold">1,245 km</p>
              </div>
            </div>

            <button className="flex items-center justify-center gap-2 w-full bg-yellow-500 hover:bg-zinc-700 py-2 px-4 rounded-lg transition-all duration-200 text-sm font-medium cursor-pointer">
              <Download size={16} />
              {translate("Descargar Reporte")}
            </button>
          </div>

          {/* Lista de viajes */}
          {trips
            .filter((trip) => {
              if (activeTab === "all") return true;
              return trip.status === activeTab;
            })
            .map((trip) => (
              <div
                key={trip.id}
                className={`backdrop-blur-md rounded-2xl p-6 border  shadow-xl hover:shadow-yellow-500/10 transition-all duration-300 mb-4 ${
                  theme === "dark"
                    ? "bg-zinc-900/70 border-zinc-800/50"
                    : "bg-white/70 border-yellow-500"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      trip.status === "completed"
                        ? "bg-green-400/30 text-green-500 border-green-500/30"
                        : "bg-red-400/30 text-red-500 border-red-500/30"
                    }`}
                  >
                    {trip.status === "Completed"
                      ? "Completado"
                      : trip.status === "Cancelled"
                      ? "Cancelado"
                      : trip.status === "Pending"
                      ? "Pendiente"
                      : trip.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-8 h-8 rounded-full bg-zinc-800/80 flex items-center justify-center flex-shrink-0">
                      <MapPin size={16} className="text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">
                        {translate("Origen")}
                      </p>
                      <p className="text-sm">{trip.originAddress}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">
                        {translate("Destino")}
                      </p>
                      <p className="text-sm">{trip.destinationAddress}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-8 h-8 rounded-full bg-zinc-800/80 flex items-center justify-center flex-shrink-0">
                      <DollarSign size={16} className="text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">
                        {translate("Ganancias")}
                      </p>
                      <p className="text-sm font-bold">
                        ${trip.payment.amount}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => openModal(trip)}
                    className="flex items-center text-sm text-yellow-500 hover:text-yellow-400 cursor-pointer"
                  >
                    {translate("Ver detalles")} <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}

          {showModal && selectedTrip && (
            <div className="fixed inset-0 bg-transparent bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
              <div
                className={` rounded-2xl p-6 w-full max-w-lg shadow-lg relative ${
                  theme === "dark"
                    ? "bg-zinc-900 border-zinc-800/50 text-white "
                    : "bg-white border-yellow-500 text-gray-900"
                }`}
              >
                {/* Cierre del modal */}
                <button
                  className={`absolute top-3 right-3 cursor-pointer text-xl ${
                    theme === "dark"
                      ? "text-yellow-500 hover:text-white"
                      : "text-gray-900 hover:text-yellow-500"
                  }`}
                  onClick={() => setShowModal(false)}
                >
                  ×
                </button>

                <h2 className="text-xl text-center font-bold mb-4">
                  {translate("N° de Viaje")} {selectedTrip.id}
                </h2>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p
                      className={`text-sm font-medium ${
                        theme === "dark" ? "text-yellow-500" : "text-gray-900"
                      }`}
                    >
                      {translate("Fecha")}
                    </p>
                    <p
                      className={`text-lg font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {selectedTrip.date}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p
                      className={`text-sm font-medium ${
                        theme === "dark" ? "text-yellow-500" : "text-gray-900"
                      }`}
                    >
                      {translate("Ruta")}
                    </p>
                    <p
                      className={`text-lg font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {selectedTrip.route}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p
                      className={`text-sm font-medium ${
                        theme === "dark" ? "text-yellow-500" : "text-gray-900"
                      }`}
                    >
                      {translate("Duración")}
                    </p>
                    <p
                      className={`text-lg font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {selectedTrip.duration}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p
                      className={`text-sm font-medium ${
                        theme === "dark" ? "text-yellow-500" : "text-gray-900"
                      }`}
                    >
                      {translate("Ganancias")}
                    </p>
                    <p
                      className={`text-2xl font-bold ${
                        theme === "dark" ? "text-yellow-500" : "text-gray-900"
                      }`}
                    >
                      ${selectedTrip.earnings.toFixed(2)}
                    </p>
                  </div>
                  <div className="col-span-2 space-y-2">
                    <p
                      className={`text-sm font-medium ${
                        theme === "dark" ? "text-yellow-500" : "text-gray-900"
                      }`}
                    >
                      {translate("Estado")}
                    </p>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          selectedTrip.status === "completed"
                            ? "bg-green-400"
                            : "bg-red-400"
                        }`}
                      ></div>
                      <p
                        className={`text-lg font-semibold ${
                          selectedTrip.status === "completed"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {selectedTrip.status === "completed"
                          ? translate("Completado")
                          : translate("Cancelado")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <Pagination
          currentPage={pageNumberRider}
          totalPages={totalPagesRider}
          onPageChange={handlePageChange}
        />
      </div>
    </MainLayout>
  );
};
export default HistorialDriver;
