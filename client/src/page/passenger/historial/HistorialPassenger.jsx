import { useState } from "react";
import { Clock, MapPin, Navigation, Search } from "lucide-react";
import MainLayout from "../../../components/layout/MainLayout";
import { trips, scheduledTrip } from "../../../data/data";

const HistorialPassenger = () => {
  const [activeTab, setActiveTab] = useState("todos");
  const [ratings, setRatings] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const filteredScheduledTrips = scheduledTrip.filter((trip) =>
    `${trip.from} ${trip.to} ${trip.date}`.toLowerCase().includes(searchTerm)
  );

  const filteredTrips = trips.filter((trip) =>
    `${trip.from} ${trip.to} ${trip.date} ${trip.driver}`
      .toLowerCase()
      .includes(searchTerm)
  );

  return (
    <MainLayout>
      <div className="flex-1 p-4 sm:px-6 sm:py-6 text-white bg-[#0f0f0f] min-h-screen rounded ">
        <div className="space-y-6">
          {/* Search & Program Button */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="search"
                placeholder="Buscar viajes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                className="w-full pl-8 pr-4 py-2 rounded bg-zinc-900 border border-zinc-700 text-white placeholder-gray-400"
              />
            </div>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-4 py-2 rounded">
              Programar Viaje
            </button>
          </div>

          {/* Tabs */}
          <div className="grid grid-cols-3 bg-zinc-900 rounded overflow-hidden text-center font-medium text-sm">
            {["todos", "completados", "programados"].map((tab) => (
              <div
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 cursor-pointer ${
                  activeTab === tab ? "bg-zinc-800 text-white" : "text-gray-400"
                }`}
              >
                {tab === "todos"
                  ? "Todos"
                  : tab === "completados"
                  ? "Completados"
                  : "Programados"}
              </div>
            ))}
          </div>

          {/* Scheduled Trips */}
          {(activeTab === "todos" || activeTab === "programados") &&
            filteredScheduledTrips.map((trip, i) => (
              <div
                key={i}
                className="border border-yellow-500 rounded-md p-4 bg-zinc-900 space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">Viaje Programado</h3>
                    <p className="text-sm text-gray-400 mb-2">
                      Tu próximo viaje
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin size={16} className="text-gray-400" />
                      <span className="font-semibold">Origen:</span> {trip.from}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Navigation size={16} className="text-gray-400" />
                      <span className="font-semibold">Destino:</span> {trip.to}
                    </div>
                    <p className="font-semibold mt-4">{trip.price}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1 text-sm text-gray-300">
                      <Clock size={16} className="text-yellow-400" />
                      {trip.date}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1 rounded">
                    Editar
                  </button>
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded">
                    Cancelar
                  </button>
                </div>
              </div>
            ))}

          {/* Trip History */}
          {(activeTab === "todos" || activeTab === "completados") &&
            filteredTrips.map((trip, index) => (
              <div
                key={index}
                className="border border-zinc-800 rounded-md p-4 bg-zinc-900 space-y-2"
              >
                <div className="flex justify-between text-sm text-gray-400">
                  <span>{trip.date}</span>
                  <span className="text-white font-semibold">{trip.price}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={16} className="text-gray-400" />
                  <span className="font-semibold">Origen:</span> {trip.from}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Navigation size={16} className="text-gray-400" />
                  <span className="font-semibold">Destino:</span> {trip.to}
                </div>
                <div className="flex justify-between items-center mt-2 text-sm">
                  <div className="flex items-center gap-4">
                    <p className="text-white">{trip.driver}</p>
                    {trip.status === "completado" ? (
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() =>
                              setRatings({
                                ...ratings,
                                [index]: star,
                              })
                            }
                            className="text-yellow-400 text-xl focus:outline-none"
                          >
                            {(ratings[index] ?? 0) >= star ? "★" : "☆"}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-yellow-400 text-xl">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span key={i}>{i < trip.rating ? "★" : "☆"}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-1 rounded">
                    Detalles
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default HistorialPassenger;
