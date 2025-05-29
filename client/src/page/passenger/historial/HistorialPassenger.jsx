import { useState, useContext } from "react";
import { Clock, MapPin, Navigation, Search } from "lucide-react";
import MainLayout from "../../../components/layout/MainLayout";
import { ThemeContext } from "../../../context/ThemeContext";
import { useTranslate } from "../../../hooks/useTranslate";
import {
  trips as initialTrips,
  scheduledTrip as initialScheduledTrips,
} from "../../../data/data";
import MapView from "../../../components/common/Map/MapView";

const HistorialPassenger = () => {
  const { theme } = useContext(ThemeContext);
  const translate = useTranslate();

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
      <div
        className={`flex-1 p-4 sm:px-6 sm:py-6 text-white min-h-screen rounded ${
          theme === "dark"
            ? "bg-zinc-900 border-zinc-800 "
            : "bg-white border border-yellow-500"
        }`}
      >
        <div className="space-y-6">
          {/* Search & Program Button */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div
              className={`relative w-full sm:w-72 rounded ${
                theme === "dark" ? "bg-zinc-800" : "bg-white "
              }`}
            >
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="search"
                placeholder={translate("Buscar viajes")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-8 pr-4 py-2 rounded placeholder-gray-400 ${
                  theme === "dark"
                    ? " bg-zinc-900 border border-zinc-700 text-white"
                    : "bg-white border border-yellow-500 text-gray-900"
                }`}
              />
            </div>
            <button
              onClick={() => setShowScheduleModal(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium px-4 py-2 rounded transition-colors duration-200 cursor-pointer"
            >
              {translate("Programar Viaje")}
            </button>
          </div>

          {/* Tabs */}
          <div
            className={`grid grid-cols-3 rounded overflow-hidden text-center font-medium text-sm ${
              theme === "dark" ? "bg-zinc-800" : "bg-yellow-500 "
            }`}
          >
            {["todos", "completados", "programados"].map((tab) => (
              <div
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 cursor-pointer transition-colors duration-200 ${
                  activeTab === tab
                    ? "bg-zinc-800 text-white"
                    : theme === "dark"
                    ? "text-gray-400 hover:text-gray-300"
                    : "text-gray-900 hover:text-gray-300"
                }`}
              >
                {tab === "todos"
                  ? translate("Todos")
                  : tab === "completados"
                  ? translate("Completado")
                  : translate("Programado")}
              </div>
            ))}
          </div>

          {/* Scheduled Trips */}
          {(activeTab === "todos" || activeTab === "programados") &&
            filteredScheduledTrips.map((trip) => (
              <div
                key={trip.id}
                className={` rounded-md p-4  space-y-2 transition-colors duration-200 ${
                  theme === "dark"
                    ? "bg-zinc-800 hover:bg-zinc-700 border border-yellow-500"
                    : "bg-white border border-yellow-500"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3
                      className={`font-bold text-lg ${
                        theme === "dark" ? "text-gray-400" : "text-gray-900"
                      }`}
                    >

                      {translate("Viaje programado")}

                    </h3>
                    <p
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-900"
                      }`}
                    >

                      {translate("Tu próximo viaje")}

                    </p>
                    <div
                      className={`flex items-center gap-2 text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-900"
                      }`}
                    >
                      <MapPin
                        size={16}
                        className={`text-gray-400 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-900"
                        }`}
                      />
                      <span
                        className={`font-semibold ${
                          theme === "dark" ? "text-gray-400" : "text-gray-900"
                        }`}
                      >

                        {translate("Origen")}:

                      </span>{" "}
                      {trip.from}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Navigation
                        size={16}
                        className={`text-gray-400 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-900"
                        }`}
                      />
                      <span
                        className={`font-semibold ${
                          theme === "dark" ? "text-gray-400" : "text-gray-900"
                        }`}
                      >

                        {translate("Destino")}:

                      </span>{" "}
                      {trip.to}
                    </div>
                    <p
                      className={`font-semibold mt-4 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-900"
                      }`}
                    >
                      {trip.price}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div
                      className={`flex items-center gap-1 text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-900"
                      }`}
                    >
                      <Clock
                        size={16}
                        className={`text-yellow-400 ${
                          theme === "dark" ? "text-gray-400" : "text-gray-900"
                        }`}
                      />
                      {trip.date}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(trip)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition-colors duration-200 cursor-pointer"
                  >
                    {translate("Editar")}
                  </button>
                  <button
                    onClick={() => handleCancel(trip.id)}
                    className="bg-red-700 hover:bg-red-900 text-white px-3 py-1 rounded transition-colors duration-200 cursor-pointer"
                  >
                    {translate("Cancelar")}
                  </button>
                </div>
              </div>
            ))}

          {/* Trip History */}
          {(activeTab === "todos" || activeTab === "completados") &&
            filteredTrips.map((trip) => (
              <div
                key={trip.id}
                className={` rounded-md p-4  transition-colors duration-200 ${
                  theme === "dark"
                    ? "bg-zinc-800 hover:bg-zinc-700 border border-yellow-500"
                    : "bg-white border border-yellow-500"
                }`}
              >
                <div
                  className={`flex justify-between text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-900"
                  }`}
                >
                  <span
                    className={`font-semibold ${
                      theme === "dark" ? "text-gray-400" : "text-gray-900"
                    }`}
                  >
                    {trip.date}
                  </span>
                  <span
                    className={`font-semibold ${
                      theme === "dark" ? "text-gray-400" : "text-gray-900"
                    }`}
                  >
                    {trip.price}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin
                    size={16}
                    className={` ${
                      theme === "dark" ? "text-gray-400" : "text-gray-900"
                    }`}
                  />
                  <span
                    className={`font-semibold ${
                      theme === "dark" ? "text-gray-400" : "text-gray-900"
                    }`}
                  >

                    {translate("Origen")}:

                  </span>{" "}
                  {trip.from}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Navigation
                    size={16}
                    className={`text-gray-400 ${
                      theme === "dark" ? "text-gray-400" : "text-gray-900"
                    }`}
                  />
                  <span
                    className={`font-semibold ${
                      theme === "dark" ? "text-gray-400" : "text-gray-900"
                    }`}
                  >

                    {translate("Destino")}:

                  </span>{" "}
                  {trip.to}
                </div>
                <div className="flex justify-between items-center mt-2 text-sm">
                  <div className="flex items-center gap-4">
                    <p
                      className={` ${
                        theme === "dark" ? "text-gray-400" : "text-gray-900"
                      }`}
                    >
                      {trip.driver}
                    </p>
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
                    {translate("Ver detalles")}
                  </button>
                </div>
              </div>
            ))}

          {/* Schedule Trip Modal */}
          {showScheduleModal && (
            {/* <div className="fixed inset-0 bg-transparent bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
              <div
                className={`p-6 rounded-md space-y-4 shadow-xl max-w-md w-full mx-4 ${
                  theme === "dark" ? "bg-zinc-800" : "bg-white"
                }`}
              >
                <h3
                  className={` text-center text-lg font-bold ${
                    theme === "dark" ? "text-gray-400" : "text-gray-900"
                  }`}
                >
                  {translate("Programar Nuevo Viaje")}
                </h3>
                <div className="space-y-3">
                  <div>
                    <label
                      htmlFor="origin"
                      className={`font-semibold text-sm  mb-1 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-900"
                      }`}
                    >
                      {translate("Origen")}
                    </label>
                    <input
                      id="origin"
                      type="text"
                      value={newTrip.from}
                      onChange={(e) =>
                        setNewTrip({ ...newTrip, from: e.target.value })
                      }
                      className={`w-full p-2 rounded  focus:outline-none focus:border-yellow-500 transition-colors ${
                        theme === "dark"
                          ? "bg-zinc-800 text-white border border-zinc-700 "
                          : "bg-white text-zinc-900 border border-yellow-500"
                      }`}
                      placeholder="Ciudad de origen"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="destination"
                      className={`font-semibold text-sm  mb-1 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-900"
                      }`}
                    >
                      {translate("Destino")}
                    </label>
                    <input
                      id="destination"
                      type="text"
                      value={newTrip.to}
                      onChange={(e) =>
                        setNewTrip({ ...newTrip, to: e.target.value })
                      }
                      className={`w-full p-2 rounded  focus:outline-none focus:border-yellow-500 transition-colors ${
                        theme === "dark"
                          ? "bg-zinc-800 text-white border border-zinc-700 "
                          : "bg-white text-zinc-900 border border-yellow-500"
                      }`}
                      placeholder="Ciudad de destino"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="date"
                      className={`font-semibold text-sm  mb-1 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-900"
                      }`}
                    >
                      {translate("Fecha")}
                    </label>
                    <input
                      id="date"
                      type="date"
                      value={newTrip.date}
                      onChange={(e) =>
                        setNewTrip({ ...newTrip, date: e.target.value })
                      }
                      className={`w-full p-2 rounded  focus:outline-none focus:border-yellow-500 transition-colors ${
                        theme === "dark"
                          ? "bg-zinc-800 text-white border border-zinc-700 "
                          : "bg-white text-zinc-900 border border-yellow-500"
                      }`}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="time"
                      className={`font-semibold text-sm  mb-1 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-900"
                      }`}
                    >
                      {translate("Hora")}
                    </label>
                    <input
                      id="time"
                      type="time"
                      value={newTrip.time}
                      onChange={(e) =>
                        setNewTrip({ ...newTrip, time: e.target.value })
                      }
                      className={`w-full p-2   rounded border focus:outline-none focus:border-yellow-500 transition-colors ${
                        theme === "dark"
                          ? "bg-zinc-800 text-white border-zinc-700 "
                          : "bg-white text-zinc-900 border-yellow-500"
                      }`}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-4 pt-2">
                  <button
                    onClick={() => setShowScheduleModal(false)}
                    className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded transition-colors duration-200 cursor-pointer"
                  >
                    {translate("Cancelar")}
                  </button>
                  <button
                    onClick={handleScheduleTrip}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded transition-colors duration-200 cursor-pointer"
                  >
                    {translate("Programar")}
                  </button>
                </div>
              </div> */}
            <div className="fixed inset-0">
              <MapView cancel={() => setShowScheduleModal(false)} />
            </div>
          )}

          {/* Modal Edit Form */}
          {isEditing && (
            <div className="fixed inset-0 bg-transparent bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
              <div
                className={` p-6 rounded-md space-y-4 shadow-xl max-w-md w-full mx-4 ${
                  theme === "dark"
                    ? "bg-zinc-900"
                    : "bg-white border border-yellow-500 "
                }`}
              >
                <h3
                  className={`text-center text-lg font-bold ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                >

                  {translate("Editar Viaje")}

                </h3>
                <div className="space-y-3">
                  <div>
                    <label
                      htmlFor="origin"
                      className={`font-semibold text-sm mb-2 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-900"
                      }`}
                    >
                      {translate("Origen")}
                    </label>
                    <input
                      id="origin"
                      type="text"
                      value={editingData.from}
                      onChange={(e) =>
                        setEditingData({ ...editingData, from: e.target.value })
                      }
                      className={`w-full p-2 rounded  focus:outline-none focus:border-yellow-500 transition-colors ${
                        theme === "dark"
                          ? "bg-zinc-800 text-white border border-zinc-700 "
                          : "bg-white text-zinc-900 border border-yellow-500"
                      }`}

                      placeholder={translate("Origen")}

                    />
                  </div>
                  <div>
                    <label
                      htmlFor="destination"
                      className={`font-semibold text-sm mb-2 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-900"
                      }`}
                    >
                      {translate("Destino")}
                    </label>
                    <input
                      id="destination"
                      type="text"
                      value={editingData.to}
                      onChange={(e) =>
                        setEditingData({ ...editingData, to: e.target.value })
                      }
                      className={`w-full p-2 rounded  focus:outline-none focus:border-yellow-500 transition-colors ${
                        theme === "dark"
                          ? "bg-zinc-800 text-white border border-zinc-700 "
                          : "bg-white text-zinc-900 border border-yellow-500"
                      }`}

                      placeholder={translate("Destino")}

                    />
                  </div>
                </div>
                <div className="flex justify-end gap-4 pt-2">
                  <button
                    onClick={() => setIsEditing(null)}
                    className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded transition-colors duration-200 cursor-pointer"
                  >
                    {translate("Cancelar")}
                  </button>
                  <button
                    onClick={() => handleSave(isEditing)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded transition-colors duration-200 cursor-pointer"
                  >
                    {translate("Guardar")}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal Trip Details */}
          {showDetails && (
            <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 backdrop-blur-sm">
              <div
                className={`p-8 rounded-xl space-y-6 shadow-2xl max-w-md w-full mx-4 ${
                  theme === "dark"
                    ? "bg-zinc-900"
                    : "bg-white border border-yellow-500"
                } transform transition-all duration-300`}
                style={{
                  animation: "modalFadeIn 0.3s ease-out",
                }}
              >
                <h3
                  className={`text-xl font-bold text-center ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  } mb-4`}
                >
                  <span className="border-b-4 border-yellow-500 pb-1">
                    Detalles del Viaje
                  </span>
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p
                        className={`text-sm font-medium ${
                          theme === "dark" ? "text-white/80" : "text-gray-600"
                        } opacity-80`}
                      >
                        Origen:
                      </p>
                      <p
                        className={`font-semibold text-lg ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        } transition-colors duration-200`}
                      >
                        {showDetails.from}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p
                        className={`text-sm font-medium ${
                          theme === "dark" ? "text-white/80" : "text-gray-600"
                        } opacity-80`}
                      >
                        Destino:
                      </p>
                      <p
                        className={`font-semibold text-lg ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        } transition-colors duration-200`}
                      >
                        {showDetails.to}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p
                        className={`text-sm font-medium ${
                          theme === "dark" ? "text-white/80" : "text-gray-600"
                        } opacity-80`}
                      >
                        Fecha:
                      </p>
                      <p
                        className={`font-semibold text-lg ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        } transition-colors duration-200`}
                      >
                        {showDetails.date}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p
                        className={`text-sm font-medium ${
                          theme === "dark" ? "text-white/80" : "text-gray-600"
                        } opacity-80`}
                      >
                        Precio:
                      </p>
                      <p
                        className={`font-semibold text-lg ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        } transition-colors duration-200`}
                      >
                        {showDetails.price}
                      </p>
                    </div>
                  </div>
                  {showDetails.driver && (
                    <div className="space-y-2">
                      <p
                        className={`text-sm font-medium ${
                          theme === "dark" ? "text-white/80" : "text-gray-600"
                        } opacity-80`}
                      >
                        Conductor:
                      </p>
                      <p
                        className={`font-semibold text-lg ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        } transition-colors duration-200`}
                      >
                        {showDetails.driver}
                      </p>
                    </div>
                  )}
                  <div className="space-y-2">
                    <p
                      className={`text-sm font-medium ${
                        theme === "dark" ? "text-white/80" : "text-gray-600"
                      } opacity-80`}
                    >
                      Estado:
                    </p>
                    <p
                      className={`font-semibold text-lg ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      } transition-colors duration-200`}
                    >
                      {showDetails.status}
                    </p>
                  </div>
                  {showDetails.rating && (
                    <div className="space-y-2">
                      <p
                        className={`text-sm font-medium ${
                          theme === "dark" ? "text-white/80" : "text-gray-600"
                        } opacity-80`}
                      >
                        Calificación:
                      </p>
                      <div className="flex justify-center items-center">
                        <div
                          className={`text-2xl ${
                            theme === "dark"
                              ? "text-yellow-300"
                              : "text-yellow-500"
                          } flex gap-1`}
                        >
                          {Array.from({ length: 5 }, (_, i) => (
                            <span key={`details-${showDetails.id}-star-${i}`}>
                              {i < showDetails.rating ? "★" : "☆"}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => setShowDetails(null)}
                    className={`cursor-pointer px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                      theme === "dark"
                        ? "bg-zinc-700 hover:bg-zinc-600 text-white"
                        : "bg-yellow-500 hover:bg-yellow-600 text-gray-900"
                    } shadow-lg hover:shadow-xl `}
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
