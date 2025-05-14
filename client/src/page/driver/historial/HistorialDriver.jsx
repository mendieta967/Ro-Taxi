import MainLayout from "../../../components/layout/MainLayout";
import { tripsDriver } from "../../../data/data";
import { useSearch } from "../../../context/SearchContext";
import {
  Calendar,
  Search,
  MapPin,
  Clock,
  DollarSign,
  ChevronRight,
  Download,
  Filter,
} from "lucide-react";
import { useState } from "react";
const HistorialDriver = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { search, setSearch } = useSearch();

  const SearchDriver = tripsDriver.filter((trip) => {
    return (
      trip.date.toLowerCase().includes(search.toLowerCase()) ||
      trip.route.toLowerCase().includes(search.toLowerCase())
    );
  });

  const filteredTrips = SearchDriver.filter((trip) => {
    const isStatusMatch = activeTab === "all" || trip.status === activeTab;
    const isDateMatch = selectedDate ? trip.date === selectedDate : true;
    return isStatusMatch && isDateMatch;
  });

  const openModal = (trip) => {
    setSelectedTrip(trip);
    setShowModal(true);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-zinc-900 border-zinc-800 rounded-2xl text-white p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Filtros y búsqueda */}
          <div className="backdrop-blur-md bg-zinc-900/70 rounded-2xl p-6 border border-yellow-500/50 shadow-xl mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-yellow-500" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-3 border border-zinc-700 rounded-lg bg-zinc-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200"
                  placeholder="Buscar por dirección o fecha"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-yellow-500" />
                </div>
                <input
                  type="date"
                  className="block w-full cursor-pointer pl-10 pr-3 py-3 border border-zinc-700 rounded-lg bg-zinc-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-zinc-800 mb-6">
              <button
                onClick={() => setActiveTab("all")}
                className={`py-2 px-4 font-medium text-sm cursor-pointer ${
                  activeTab === "all"
                    ? "border-b-2 border-yellow-500 text-yellow-500"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setActiveTab("completed")}
                className={`py-2 px-4 font-medium text-sm cursor-pointer ${
                  activeTab === "completed"
                    ? "border-b-2 border-yellow-500 text-yellow-500"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Completados
              </button>
              <button
                onClick={() => setActiveTab("canceled")}
                className={`py-2 px-4 font-medium text-sm cursor-pointer ${
                  activeTab === "canceled"
                    ? "border-b-2 border-yellow-500 text-yellow-500"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Cancelados
              </button>
            </div>

            {/* Resumen */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="backdrop-blur-md bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
                <h3 className="text-sm text-yellow-500 mb-1">
                  Total de viajes
                </h3>
                <p className="text-2xl font-bold">342</p>
              </div>

              <div className="backdrop-blur-md bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
                <h3 className="text-sm text-yellow-500 mb-1">
                  Ingresos totales
                </h3>
                <p className="text-2xl font-bold">$45,320</p>
              </div>

              <div className="backdrop-blur-md bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
                <h3 className="text-sm text-yellow-500 mb-1">
                  Distancia total
                </h3>
                <p className="text-2xl font-bold">1,245 km</p>
              </div>
            </div>

            <button className="flex items-center justify-center gap-2 w-full bg-yellow-500 hover:bg-zinc-700 py-2 px-4 rounded-lg transition-all duration-200 text-sm font-medium cursor-pointer">
              <Download size={16} />
              Descargar Reporte
            </button>
          </div>

          {/* Lista de viajes */}
          {filteredTrips
            .filter((trip) => {
              if (activeTab === "all") return true;
              return trip.status === activeTab;
            })
            .map((trip) => (
              <div
                key={trip.id}
                className="backdrop-blur-md bg-zinc-900/70 rounded-2xl p-6 border border-yellow-500/50 shadow-xl hover:shadow-yellow-500/10 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-400">{trip.date}</p>
                    <h3 className="text-lg font-bold">Viaje #{trip.id}</h3>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      trip.status === "completed"
                        ? "bg-green-900/30 text-green-400 border-green-500/30"
                        : "bg-red-900/30 text-red-400 border-red-500/30"
                    }`}
                  >
                    {trip.status === "completed" ? "Completado" : "Cancelado"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-8 h-8 rounded-full bg-zinc-800/80 flex items-center justify-center flex-shrink-0">
                      <MapPin size={16} className="text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Ruta</p>
                      <p className="text-sm">{trip.route}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-8 h-8 rounded-full bg-zinc-800/80 flex items-center justify-center flex-shrink-0">
                      <Clock size={16} className="text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Duración</p>
                      <p className="text-sm">{trip.duration}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-1 w-8 h-8 rounded-full bg-zinc-800/80 flex items-center justify-center flex-shrink-0">
                      <DollarSign size={16} className="text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Ganancia</p>
                      <p className="text-sm font-bold">
                        ${trip.earnings.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => openModal(trip)}
                    className="flex items-center text-sm text-yellow-500 hover:text-yellow-400 cursor-pointer"
                  >
                    Ver detalles <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}

          {showModal && selectedTrip && (
            <div className="fixed inset-0 bg-transparent bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
              <div className="bg-zinc-900 border border-yellow-500/50 rounded-2xl p-6 w-full max-w-lg shadow-lg text-white relative">
                {/* Cierre del modal */}
                <button
                  className="absolute top-3 right-3 cursor-pointer text-yellow-500 hover:text-white text-xl"
                  onClick={() => setShowModal(false)}
                >
                  ×
                </button>

                <h2 className="text-xl text-center font-bold mb-4">
                  N° de Viaje: {selectedTrip.id}
                </h2>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-yellow-500">Fecha</p>
                    <p>{selectedTrip.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-yellow-500">Ruta</p>
                    <p>{selectedTrip.route}</p>
                  </div>
                  <div>
                    <p className="text-sm text-yellow-500">Duración</p>
                    <p>{selectedTrip.duration}</p>
                  </div>
                  <div>
                    <p className="text-sm text-yellow-500">Ganancia</p>
                    <p className="font-bold">
                      ${selectedTrip.earnings.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-yellow-500">Estado</p>
                    <p
                      className={`font-semibold ${
                        selectedTrip.status === "completed"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {selectedTrip.status === "completed"
                        ? "Completado"
                        : "Cancelado"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};
export default HistorialDriver;
