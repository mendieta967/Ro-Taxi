import MainLayout from "../../../components/layout/MainLayout";
import { ThemeContext } from "../../../context/ThemeContext";
import { useTranslate } from "../../../hooks/useTranslate";
import Pagination from "../../../components/ui/Pagination";
import { getRides, deleteRide } from "../../../services/ride";
import {
  Search,
  MapPin,
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
          ["InProgress", "Completed", "Cancelled", "Pending"].includes(
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

  const handleDelete = async (tripId) => {
    try {
      const response = await deleteRide(tripId);
      console.log("Response:", response);
      // Actualizar la lista de viajes después de eliminar el viaje
      setTrips((prevTrips) => prevTrips.filter((trip) => trip.id !== tripId));
      setShowModal(false);
    } catch (error) {
      console.error(`Error cancelando viaje con ID ${tripId}:`, error);
    }
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
                onClick={() => setActiveTab("Cancelled")}
                className={`py-2 px-4 font-medium text-sm cursor-pointer ${
                  activeTab === "Cancelled"
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
          <div className="max-w-4xl mx-auto">
            {trips
              .filter((trip) => {
                if (activeTab === "all") return true;
                return trip.status === activeTab;
              })
              .map((trip) => {
                const status = trip.status;

                const statusStyles = {
                  Completed: {
                    border: "border-emerald-500/30",
                    badge:
                      "bg-gradient-to-r from-emerald-500/20 to-emerald-400/30 text-emerald-400 border-emerald-400/40 shadow-emerald-500/20",
                    label: "Completado",
                    glow: "shadow-emerald-500/10",
                  },
                  InProgress: {
                    border: "border-amber-500/30",
                    badge:
                      "bg-gradient-to-r from-amber-500/20 to-amber-400/30 text-amber-400 border-amber-400/40 shadow-amber-500/20",
                    label: "En progreso",
                    glow: "shadow-amber-500/10",
                  },
                  Cancelled: {
                    border: "border-rose-500/30",
                    badge:
                      "bg-gradient-to-r from-rose-500/20 to-rose-400/30 text-rose-400 border-rose-400/40 shadow-rose-500/20",
                    label: "Cancelado",
                    glow: "shadow-rose-500/10",
                  },
                  Default: {
                    border:
                      theme === "dark"
                        ? "border-slate-700/50"
                        : "border-amber-500/30",
                    badge:
                      "bg-gradient-to-r from-slate-500/20 to-slate-400/30 text-slate-400 border-slate-400/40",
                    label: status,
                    glow: "shadow-slate-500/10",
                  },
                };

                const current = statusStyles[status] || statusStyles.Default;

                return (
                  <div
                    key={trip.id}
                    className={`group relative backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:shadow-3xl 
                transition-all duration-500 ease-out mb-6 border-2 hover:scale-[1.02] hover:-translate-y-1
                ${
                  theme === "dark"
                    ? "bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-900"
                    : "bg-gradient-to-br from-white/90 via-white/80 to-white/90"
                } 
                ${current.border} hover:border-opacity-60 ${
                      current.glow
                    } hover:shadow-xl`}
                  >
                    {/* Efecto de brillo sutil */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-6">
                        <span
                          className={`inline-flex items-center px-4 py-2 rounded-2xl text-sm font-semibold border backdrop-blur-sm
                      shadow-lg transition-all duration-300 group-hover:scale-105 ${current.badge}`}
                        >
                          <div className="w-2 h-2 rounded-full bg-current mr-2 animate-pulse"></div>
                          {current.label}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Sección de ubicaciones */}
                        <div className="space-y-6">
                          <div className="flex items-start gap-4 group/item">
                            <div
                              className="mt-1 w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 
                        flex items-center justify-center flex-shrink-0 shadow-lg group-hover/item:scale-110 transition-transform duration-300"
                            >
                              <MapPin size={20} className="text-amber-400" />
                            </div>
                            <div className="flex-1 space-y-4">
                              <div>
                                <p className="text-xs font-medium text-slate-700 uppercase tracking-wider mb-1">
                                  {translate("Origen")}
                                </p>
                                <p className="text-base font-medium text-slate-500 leading-relaxed">
                                  {trip.originAddress}
                                </p>
                              </div>
                              <div className="h-px bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700"></div>
                              <div>
                                <p className="text-xs font-medium text-slate-700 uppercase tracking-wider mb-1">
                                  {translate("Destino")}
                                </p>
                                <p className="text-base font-medium text-slate-500 leading-relaxed">
                                  {trip.destinationAddress}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Sección de ganancias */}
                        <div className="flex items-center justify-center lg:justify-start">
                          <div className="flex items-start gap-4 group/item">
                            <div
                              className="mt-1 w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 
                        flex items-center justify-center flex-shrink-0 shadow-lg group-hover/item:scale-110 transition-transform duration-300"
                            >
                              <DollarSign size={20} className="text-white" />
                            </div>
                            <div className="text-center lg:text-left">
                              <p className="text-xs font-medium text-slate-700 uppercase tracking-wider mb-2">
                                {translate("Ganancias")}
                              </p>
                              <p
                                className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 
                          bg-clip-text text-transparent"
                              >
                                ${trip.payment.amount}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-4 border-t border-slate-700/50">
                        <button
                          onClick={() => openModal(trip)}
                          className="group/btn cursor-pointer flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold 
                      text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 
                      border border-amber-500/30 hover:border-amber-400/50 transition-all duration-300 
                      hover:shadow-lg hover:shadow-amber-500/25 hover:scale-105 backdrop-blur-sm"
                        >
                          {translate("Ver detalles")}
                          <ChevronRight
                            size={16}
                            className="group-hover/btn:translate-x-1 transition-transform duration-300"
                          />
                        </button>
                        {status === "InProgress" && (
                          <button
                            onClick={() => handleDelete(trip.id)}
                            className="ml-4 group/btn cursor-pointer flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold 
    text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 
    border border-red-500/30 hover:border-red-400/50 transition-all duration-300 
    hover:shadow-lg hover:shadow-red-500/25 hover:scale-105 backdrop-blur-sm"
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {showModal && selectedTrip && (
          <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 backdrop-blur-md">
            <div
              className={`rounded-3xl p-8 w-full max-w-2xl shadow-2xl relative border transition-all duration-300 ${
                theme === "dark"
                  ? "bg-gradient-to-br from-zinc-900 to-zinc-800 border-zinc-700/50 text-white shadow-yellow-500/10"
                  : "bg-gradient-to-br from-white to-gray-50 border-gray-200 text-gray-900 shadow-xl"
              }`}
            >
              {/* Close button */}
              <button
                className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 ${
                  theme === "dark"
                    ? "text-gray-400 hover:text-yellow-500 hover:bg-yellow-500/10"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setShowModal(false)}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Header */}
              <div className="text-center mb-8">
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                    theme === "dark" ? "bg-yellow-500/20" : "bg-yellow-100"
                  }`}
                >
                  <svg
                    className={`w-8 h-8 ${
                      theme === "dark" ? "text-yellow-500" : "text-yellow-600"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  {translate("Informacion del viaje")}
                </h2>
                <div
                  className={`w-20 h-1 mx-auto rounded-full ${
                    theme === "dark" ? "bg-yellow-500" : "bg-yellow-400"
                  }`}
                ></div>
              </div>

              {/* Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Origin */}
                <div
                  className={`p-4 rounded-2xl border transition-all duration-200 hover:shadow-md ${
                    theme === "dark"
                      ? "bg-zinc-800/50 border-zinc-700/50 hover:border-yellow-500/30"
                      : "bg-gray-50/50 border-gray-200 hover:border-yellow-300"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        theme === "dark" ? "bg-green-500/20" : "bg-green-100"
                      }`}
                    >
                      <svg
                        className={`w-4 h-4 ${
                          theme === "dark" ? "text-green-400" : "text-green-600"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <p
                      className={`text-sm font-semibold uppercase tracking-wide ${
                        theme === "dark" ? "text-yellow-500" : "text-gray-600"
                      }`}
                    >
                      {translate("Origen")}
                    </p>
                  </div>
                  <p
                    className={`text-lg font-bold ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {selectedTrip.originAddress}
                  </p>
                </div>

                {/* Destination */}
                <div
                  className={`p-4 rounded-2xl border transition-all duration-200 hover:shadow-md ${
                    theme === "dark"
                      ? "bg-zinc-800/50 border-zinc-700/50 hover:border-yellow-500/30"
                      : "bg-gray-50/50 border-gray-200 hover:border-yellow-300"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        theme === "dark" ? "bg-red-500/20" : "bg-red-100"
                      }`}
                    >
                      <svg
                        className={`w-4 h-4 ${
                          theme === "dark" ? "text-red-400" : "text-red-600"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <p
                      className={`text-sm font-semibold uppercase tracking-wide ${
                        theme === "dark" ? "text-yellow-500" : "text-gray-600"
                      }`}
                    >
                      {translate("Destino")}
                    </p>
                  </div>
                  <p
                    className={`text-lg font-bold ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {selectedTrip.destinationAddress}
                  </p>
                </div>
                {/* Date */}
                <div
                  className={`p-4 rounded-2xl border transition-all duration-200 hover:shadow-md ${
                    theme === "dark"
                      ? "bg-zinc-800/50 border-zinc-700/50 hover:border-yellow-500/30"
                      : "bg-gray-50/50 border-gray-200 hover:border-yellow-300"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        theme === "dark" ? "bg-yellow-500/20" : "bg-yellow-100"
                      }`}
                    >
                      <svg
                        className={`w-4 h-4 ${
                          theme === "dark"
                            ? "text-yellow-500"
                            : "text-yellow-600"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 11-18 0 2 2 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <p
                      className={`text-sm font-semibold uppercase tracking-wide ${
                        theme === "dark" ? "text-yellow-500" : "text-gray-600"
                      }`}
                    >
                      {translate("Fecha")}
                    </p>
                  </div>
                  <p
                    className={`text-lg font-bold ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {new Date(selectedTrip.startedAt).toLocaleString("es-AR", {
                      timeZone: "America/Argentina/Buenos_Aires",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {/* Earnings */}
                <div
                  className={`p-4 rounded-2xl border transition-all duration-200 hover:shadow-md ${
                    theme === "dark"
                      ? "bg-zinc-800/50 border-zinc-700/50 hover:border-yellow-500/30"
                      : "bg-gray-50/50 border-gray-200 hover:border-yellow-300"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        theme === "dark" ? "bg-yellow-500/20" : "bg-yellow-100"
                      }`}
                    >
                      <DollarSign
                        className={`w-5 h-5 ${
                          theme === "dark"
                            ? "text-yellow-500"
                            : "text-yellow-600"
                        }`}
                      />
                    </div>
                    <p
                      className={`text-sm font-semibold uppercase tracking-wide ${
                        theme === "dark" ? "text-yellow-500" : "text-gray-600"
                      }`}
                    >
                      {translate("Ganancias")}
                    </p>
                  </div>
                  <p
                    className={`text-3xl font-bold items-center ${
                      theme === "dark" ? "text-yellow-500" : "text-yellow-600"
                    }`}
                  >
                    ${selectedTrip.payment.amount}
                  </p>
                </div>

                {/* Status */}
                <div
                  className={`col-span-1 md:col-span-2 p-6 rounded-2xl border transition-all duration-200 hover:shadow-md ${
                    theme === "dark"
                      ? "bg-zinc-800/50 border-zinc-700/50 hover:border-yellow-500/30"
                      : "bg-gray-50/50 border-gray-200 hover:border-yellow-300"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        theme === "dark" ? "bg-yellow-500" : "bg-gray-900"
                      }`}
                    >
                      <svg
                        className={`w-4 h-4 ${
                          theme === "dark" ? "text-gray-900" : "text-yellow-500"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <p
                      className={`text-sm font-semibold uppercase tracking-wide ${
                        theme === "dark" ? "text-yellow-500" : "text-gray-700"
                      }`}
                    >
                      {translate("Estado")}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex items-center gap-3 px-4 py-2 rounded-full border ${
                        selectedTrip.status === "Completed"
                          ? "bg-green-500/10 border-green-500/30"
                          : selectedTrip.status === "InProgress"
                          ? "bg-yellow-500/10 border-yellow-500/30"
                          : "bg-red-500/10 border-red-500/30"
                      }`}
                    >
                      <div
                        className={`w-3 h-3 rounded-full animate-pulse ${
                          selectedTrip.status === "Completed"
                            ? "bg-green-500"
                            : selectedTrip.status === "InProgress"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      ></div>
                      <p
                        className={`text-lg font-bold ${
                          selectedTrip.status === "Completed"
                            ? "text-green-500"
                            : selectedTrip.status === "InProgress"
                            ? "text-yellow-500"
                            : "text-red-500"
                        }`}
                      >
                        {selectedTrip.status === "Completed"
                          ? translate("Completado")
                          : selectedTrip.status === "InProgress"
                          ? translate("Pendiente")
                          : translate("Cancelado")}
                      </p>
                    </div>
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
    </MainLayout>
  );
};
export default HistorialDriver;
