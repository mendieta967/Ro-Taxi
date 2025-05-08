import { useState } from "react";
import { Clock, MapPin, Navigation, Search } from "lucide-react";
import MainLayout from "../../../components/layout/MainLayout";
import {
  trips as initialTrips,
  scheduledTrip as initialScheduledTrips,
} from "../../../data/data";

const HistorialPassenger = () => {
  const [activeTab, setActiveTab] = useState("todos");
  const [ratings, setRatings] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(null);
  const [editingData, setEditingData] = useState({ from: "", to: "" });
  const [showDetails, setShowDetails] = useState(null);
  const [trips, setTrips] = useState(initialTrips);
  const [scheduledTrips, setScheduledTrips] = useState(initialScheduledTrips);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [newTrip, setNewTrip] = useState({
    from: "",
    to: "",
    date: "",
    time: "",
  });

  const filteredScheduledTrips = scheduledTrips.filter((trip) =>
    `${trip.from} ${trip.to} ${trip.date}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const filteredTrips = trips.filter((trip) =>
    `${trip.from} ${trip.to} ${trip.date} ${trip.driver}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const handleEdit = (trip) => {
    setIsEditing(trip.id);
    setEditingData({ from: trip.from, to: trip.to });
  };

  const handleCancel = (id) => {
    const updatedScheduledTrips = scheduledTrips.filter(
      (trip) => trip.id !== id
    );
    setScheduledTrips(updatedScheduledTrips);
    console.log(`Viaje con ID ${id} cancelado exitosamente`);
  };

  const handleSave = (id) => {
    const tripToUpdate = trips.find((trip) => trip.id === id);

    if (tripToUpdate) {
      const updatedTrips = trips.map((trip) =>
        trip.id === id
          ? { ...trip, from: editingData.from, to: editingData.to }
          : trip
      );
      setTrips(updatedTrips);
    } else {
      const updatedScheduledTrips = scheduledTrips.map((trip) =>
        trip.id === id
          ? { ...trip, from: editingData.from, to: editingData.to }
          : trip
      );
      setScheduledTrips(updatedScheduledTrips);
    }

    setIsEditing(null);
  };

  const handleDetails = (trip) => {
    setShowDetails(trip);
  };

  const handleScheduleTrip = () => {
    const newScheduledTrip = {
      id: scheduledTrips.length + 1,
      from: newTrip.from,
      to: newTrip.to,
      date: `${newTrip.date} ${newTrip.time}`,
      price: "$50.00", // Example price
      status: "programados",
    };

    setScheduledTrips([...scheduledTrips, newScheduledTrip]);
    setNewTrip({ from: "", to: "", date: "", time: "" });
    setShowScheduleModal(false);
  };

  return (
    <MainLayout>
      <div className="flex-1 p-4 sm:px-6 sm:py-6 text-white bg-zinc-900 border-zinc-800 min-h-screen rounded">
        <div className="space-y-6">
          {/* Search & Program Button */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="search"
                placeholder="Buscar viajes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-4 py-2 rounded bg-zinc-900 border border-zinc-700 text-white placeholder-gray-400"
              />
            </div>
            <button
              onClick={() => setShowScheduleModal(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-4 py-2 rounded transition-colors duration-200 cursor-pointer"
            >
              Programar Viaje
            </button>
          </div>

          {/* Tabs */}
          <div className="grid grid-cols-3 bg-zinc-900 rounded overflow-hidden text-center font-medium text-sm">
            {["todos", "completados", "programados"].map((tab) => (
              <div
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 cursor-pointer transition-colors duration-200 ${
                  activeTab === tab
                    ? "bg-zinc-800 text-white"
                    : "text-gray-400 hover:text-gray-300"
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
            filteredScheduledTrips.map((trip) => (
              <div
                key={trip.id}
                className="border border-yellow-500 rounded-md p-4 bg-zinc-900 space-y-2 hover:bg-zinc-800 transition-colors duration-200"
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
                  <button
                    onClick={() => handleEdit(trip)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition-colors duration-200 cursor-pointer"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleCancel(trip.id)}
                    className="bg-red-700 hover:bg-red-900 text-white px-3 py-1 rounded transition-colors duration-200 cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ))}

          {/* Trip History */}
          {(activeTab === "todos" || activeTab === "completados") &&
            filteredTrips.map((trip) => (
              <div
                key={trip.id}
                className="border border-zinc-800 rounded-md p-4 bg-zinc-900 space-y-2 hover:bg-zinc-800 transition-colors duration-200"
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
                            key={`${trip.id}-${star}`}
                            type="button"
                            onClick={() =>
                              setRatings({
                                ...ratings,
                                [trip.id]: star,
                              })
                            }
                            className="text-yellow-400 text-xl focus:outline-none transition-transform duration-200 hover:scale-110"
                          >
                            {(ratings[trip.id] ?? 0) >= star ? "★" : "☆"}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-yellow-400 text-xl">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span key={`${trip.id}-star-${i}`}>
                            {i < trip.rating ? "★" : "☆"}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleDetails(trip)}
                    className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-1 rounded transition-colors duration-200 cursor-pointer"
                  >
                    Detalles
                  </button>
                </div>
              </div>
            ))}

          {/* Schedule Trip Modal */}
          {showScheduleModal && (
            <div className="fixed inset-0 bg-transparent bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
              <div className="bg-zinc-900 p-6 rounded-md space-y-4 shadow-xl max-w-md w-full mx-4">
                <h3 className="text-white text-lg font-bold">
                  Programar Nuevo Viaje
                </h3>
                <div className="space-y-3">
                  <div>
                    <label
                      htmlFor="origin"
                      className="block text-sm text-gray-400 mb-1"
                    >
                      Origen
                    </label>
                    <input
                      id="origin"
                      type="text"
                      value={newTrip.from}
                      onChange={(e) =>
                        setNewTrip({ ...newTrip, from: e.target.value })
                      }
                      className="w-full p-2 bg-zinc-800 text-white rounded border border-zinc-700 focus:outline-none focus:border-yellow-500 transition-colors"
                      placeholder="Ciudad de origen"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="destination"
                      className="block text-sm text-gray-400 mb-1"
                    >
                      Destino
                    </label>
                    <input
                      id="destination"
                      type="text"
                      value={newTrip.to}
                      onChange={(e) =>
                        setNewTrip({ ...newTrip, to: e.target.value })
                      }
                      className="w-full p-2 bg-zinc-800 text-white rounded border border-zinc-700 focus:outline-none focus:border-yellow-500 transition-colors"
                      placeholder="Ciudad de destino"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="date"
                      className="block text-sm text-gray-400 mb-1"
                    >
                      Fecha
                    </label>
                    <input
                      id="date"
                      type="date"
                      value={newTrip.date}
                      onChange={(e) =>
                        setNewTrip({ ...newTrip, date: e.target.value })
                      }
                      className="w-full p-2 bg-zinc-800 text-white rounded border border-zinc-700 focus:outline-none focus:border-yellow-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="time"
                      className="block text-sm text-gray-400 mb-1"
                    >
                      Hora
                    </label>
                    <input
                      id="time"
                      type="time"
                      value={newTrip.time}
                      onChange={(e) =>
                        setNewTrip({ ...newTrip, time: e.target.value })
                      }
                      className="w-full p-2 bg-zinc-800 text-white rounded border border-zinc-700 focus:outline-none focus:border-yellow-500 transition-colors"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-4 pt-2">
                  <button
                    onClick={() => setShowScheduleModal(false)}
                    className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded transition-colors duration-200"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleScheduleTrip}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded transition-colors duration-200"
                  >
                    Programar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal Edit Form */}
          {isEditing && (
            <div className="fixed inset-0 bg-transparent bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
              <div className="bg-zinc-900 p-6 rounded-md space-y-4 shadow-xl max-w-md w-full mx-4">
                <h3 className="text-white text-lg font-bold">Editar Viaje</h3>
                <div className="space-y-3">
                  <div>
                    <label
                      htmlFor="origin"
                      className="block text-sm text-gray-400 mb-1"
                    >
                      Origen
                    </label>
                    <input
                      id="origin"
                      type="text"
                      value={editingData.from}
                      onChange={(e) =>
                        setEditingData({ ...editingData, from: e.target.value })
                      }
                      className="w-full p-2 bg-zinc-800 text-white rounded border border-zinc-700 focus:outline-none focus:border-yellow-500 transition-colors"
                      placeholder="Origen"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="destination"
                      className="block text-sm text-gray-400 mb-1"
                    >
                      Destino
                    </label>
                    <input
                      id="destination"
                      type="text"
                      value={editingData.to}
                      onChange={(e) =>
                        setEditingData({ ...editingData, to: e.target.value })
                      }
                      className="w-full p-2 bg-zinc-800 text-white rounded border border-zinc-700 focus:outline-none focus:border-yellow-500 transition-colors"
                      placeholder="Destino"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-4 pt-2">
                  <button
                    onClick={() => setIsEditing(null)}
                    className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded transition-colors duration-200"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => handleSave(isEditing)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded transition-colors duration-200"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal Trip Details */}
          {showDetails && (
            <div className="fixed inset-0 bg-transparent bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
              <div className="bg-zinc-900 p-6 rounded-md space-y-4 shadow-xl max-w-md w-full mx-4">
                <h3 className="text-white text-lg font-bold text-center">
                  Detalles del Viaje
                </h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm text-gray-400">Origen:</p>
                      <p className="text-white">{showDetails.from}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Destino:</p>
                      <p className="text-white">{showDetails.to}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm text-gray-400">Fecha:</p>
                      <p className="text-white">{showDetails.date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Precio:</p>
                      <p className="text-white">{showDetails.price}</p>
                    </div>
                  </div>
                  {showDetails.driver && (
                    <div>
                      <p className="text-sm text-gray-400">Conductor:</p>
                      <p className="text-white">{showDetails.driver}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-400">Estado:</p>
                    <p className="text-white capitalize">
                      {showDetails.status}
                    </p>
                  </div>
                  {showDetails.rating && (
                    <div>
                      <p className="text-sm text-gray-400 text-center mt-2">
                        Calificación:
                      </p>
                      <div className="text-yellow-400 text-xl text-center">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span key={`details-${showDetails.id}-star-${i}`}>
                            {i < showDetails.rating ? "★" : "☆"}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex justify-center mt-4">
                  <button
                    onClick={() => setShowDetails(null)}
                    className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded transition-colors duration-200"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default HistorialPassenger;
