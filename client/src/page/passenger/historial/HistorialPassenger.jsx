import { useState, useContext, useEffect } from "react";
import { Clock, MapPin, Navigation, Search } from "lucide-react";
import Pagination from "../../../components/ui/Pagination";
import MainLayout from "../../../components/layout/MainLayout";
import { ThemeContext } from "../../../context/ThemeContext";
import { useTranslate } from "../../../hooks/useTranslate";
import MapView from "../../../components/common/Map/MapView";
import { getRides, deleteRide, editRide } from "../../../services/ride";
import Modal from "../../../components/ui/Modal";

const HistorialPassenger = () => {
  const { theme } = useContext(ThemeContext);
  const translate = useTranslate();

  const [activeTab, setActiveTab] = useState("todos");
  //const [ratings, setRatings] = useState({});

  const [isEditing, setIsEditing] = useState(null);
  const [showDetails, setShowDetails] = useState(null);
  const [scheduledTrips, setScheduledTrips] = useState([]); //viajes programados
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [abrirModal, setAbrirModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [totalPagesRider, setTotalPagesRider] = useState(1);
  const [pageNumberRider, setPageNumberRider] = useState(1);
  const pageSizeRider = 10;

  const [editingData, setEditingData] = useState({
    from: "",
    to: "",
    date: "",
    time: "",
    metodoPago: "",
  });

  //mostramos los viajes programados
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
        setScheduledTrips(scheduledTrips);
        setTotalPagesRider(response.totalPages);

        console.log(scheduledTrips);
      } catch (error) {
        console.error("Error fetching rides:", error);
      }
    };
    fetchRides();
  }, [pageNumberRider, searchTerm]);

  //elimino los viajes programados terminado
  const handleDelete = async (riderId) => {
    try {
      console.log("Deleting ride with ID:", riderId);
      await deleteRide(riderId);

      const response = await getRides(
        pageNumberRider,
        pageSizeRider,
        searchTerm
      );
      console.log("Response:", response); // Ver la estructura real de la respuesta
      const newScheduledTrips = response.data.filter(
        (ride) => ride?.status === "Pending"
      );
      setScheduledTrips(newScheduledTrips);
      console.log(newScheduledTrips);
      setAbrirModal(false);
    } catch (error) {
      console.error(`Error cancelando viaje con ID ${riderId}:`, error);
    }
  };

  const handlePageChange = (newPage) => {
    console.log("Cambiando a página:", newPage); // DEBUG
    setPageNumberRider(newPage);
    console.log("Página cambiada a:", newPage);
  };

  //editamos los viajes programados
  const handleEdit = (riderId) => {
    const editeRide = scheduledTrips.find((trip) => trip.id === riderId);
    console.log("Viaje a editar:", editeRide);
    if (editeRide) {
      //perseamos la fecha y hora
      const fechaHora = new Date(editeRide.scheduledAt);
      const formattedDate = fechaHora.toISOString().split("T")[0]; // "2025-06-03"
      const formattedTime = fechaHora.toTimeString().slice(0, 5); // "14:30"
      console.log(formattedDate);
      console.log(formattedTime);

      setEditingData({
        id: editeRide.id,
        from: editeRide.originAddress,
        fromLat: editeRide.originLat,
        fromLng: editeRide.originLng,
        to: editeRide.destinationAddress,
        toLat: editeRide.destinationLat,
        toLng: editeRide.destinationLng,
        date: formattedDate,
        time: formattedTime,
      });

      setIsEditing(true);
    } else {
      console.log("No se encontro el viaje");
    }
  };

  //guardamos los viajes programados
  const handleSave = async (e) => {
    e.preventDefault();

    if (!editingData) {
      console.warn("No hay datos para editar");
      return;
    }

    try {
      const updatedRide = {
        id: editingData.id,
        originAddress: editingData.from,
        originLat: editingData.fromLat,
        originLng: editingData.fromLng,
        destinationAddress: editingData.to,
        destinationLat: editingData.toLat,
        destinationLng: editingData.toLng,
        scheduledAt: `${editingData.date}T${editingData.time}:00`,
      };

      await editRide(editingData.id, updatedRide);

      // Actualizá el estado local
      setScheduledTrips((prevTrips) =>
        prevTrips.map((trip) =>
          trip.id === editingData.id ? { ...trip, ...updatedRide } : trip
        )
      );

      setIsEditing(false);
    } catch (error) {
      console.error(`Error updating ride with ID ${editingData.id}:`, error);
    }
  };

  const handleDetails = (tripId) => {
    const selectedTrip = scheduledTrips.find((trip) => trip.id === tripId);
    setShowDetails(selectedTrip);
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

            {showScheduleModal && (
              <div>
                <div className="fixed inset-0">
                  <MapView cancel={() => setShowScheduleModal(false)} />
                </div>
              </div>
            )}
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
                    ? "bg-yellow-500 text-white"
                    : theme === "dark"
                    ? " text-gray-400 hover:text-gray-300"
                    : "bg-zinc-800 text-white hover:text-gray-300"
                }`}
              >
                {tab === "todos"
                  ? translate("Todos")
                  : tab === "completados"
                  ? translate("Completado")
                  : translate("Programados")}
              </div>
            ))}
          </div>
          {/* Scheduled Trips */}
          {(activeTab === "todos" ||
            activeTab === "programados" ||
            activeTab === "completados") &&
            scheduledTrips
              .filter((trip) => {
                if (activeTab === "completados") {
                  return trip.status === "Completed";
                }
                if (activeTab === "programados") {
                  // Mostrar solo Pending e InProgress
                  return (
                    trip.status === "Pending" || trip.status === "InProgress"
                  );
                }
                if (activeTab === "todos") {
                  return true; // Todos los viajes
                }
                return false;
              })
              .map((trip) => (
                <div
                  key={trip.id}
                  className={`rounded-md p-4 space-y-2 transition-colors duration-200 ${
                    theme === "dark"
                      ? "bg-zinc-800 hover:bg-zinc-700 border border-yellow-500"
                      : "bg-white border border-yellow-500"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      {["InProgress", "Pending"].includes(trip.status) && (
                        <div>
                          <h3
                            className={`font-bold text-lg ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-900"
                            }`}
                          >
                            {translate("Viaje programado")}
                          </h3>
                          <p
                            className={`text-sm ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-900"
                            }`}
                          >
                            {translate("Tu próximo viaje")}
                          </p>
                        </div>
                      )}

                      <div
                        className={`flex items-center mt-2 gap-2 text-sm ${
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
                        {trip.originAddress}
                      </div>
                      <div
                        className={`flex items-center mt-5 gap-2 text-sm ${
                          theme === "dark" ? "text-gray-400" : "text-gray-900"
                        }`}
                      >
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
                        </span>
                        {trip.destinationAddress}
                      </div>
                      {["InProgress", "Pending"].includes(trip.status) && (
                        <div>
                          <p
                            className={`font-semibold mt-4 ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-900"
                            }`}
                          >
                            {translate("Metodo de pago")}:
                          </p>
                          <p
                            className={`font-semibold mt-1 ${
                              theme === "dark"
                                ? "text-gray-400"
                                : "text-gray-900"
                            }`}
                          >
                            {translate("Tarifa")}: ${trip.payment.amount}
                          </p>
                        </div>
                      )}

                      <div className="flex justify-between  mt-4 text-sm flex-col items-start">
                        <p
                          className={`${
                            theme === "dark" ? "text-gray-400" : "text-gray-900"
                          }`}
                        >
                          <strong>{translate("Conductor")}:</strong>{" "}
                          {trip.driver
                            ? trip.driver.name
                            : translate("Sin conductor asignado")}
                        </p>
                        <p
                          className={`font-semibold  px-2 py-1 mt-5 rounded-md text-white ${
                            trip.status === "Pending"
                              ? "bg-yellow-500"
                              : trip.status === "InProgress"
                              ? "bg-blue-600"
                              : trip.status === "Completed"
                              ? "bg-green-600"
                              : trip.status === "Expired"
                              ? "bg-red-600"
                              : "bg-gray-500"
                          }`}
                        >
                          {trip.status}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <div className="mb-3">
                        <p
                          className={`font-semibold mt-4 ${
                            theme === "dark" ? "text-gray-400" : "text-gray-900"
                          }`}
                        >
                          {translate("Fecha")}:{" "}
                          {new Date(trip.scheduledAt).toLocaleDateString()}
                        </p>
                      </div>
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
                        {translate("Hora")}:{" "}
                        {new Date(trip.scheduledAt).toLocaleTimeString()}
                      </div>

                      <div className="mt-4">
                        {trip.status === "Completed" && (
                          <button
                            onClick={() => handleDetails(trip.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-md transition-colors duration-200 cursor-pointer"
                          >
                            {translate("Ver detalles")}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {["Pending", "InProgress"].includes(trip.status) && (
                    <div className="flex justify-end gap-2 mt-4">
                      <button
                        onClick={() => handleEdit(trip.id)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md transition-colors duration-200 cursor-pointer"
                      >
                        {translate("Editar")}
                      </button>
                      <button
                        onClick={() => setAbrirModal(true)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md transition-colors duration-200 cursor-pointer"
                      >
                        {translate("Cancelar")}
                      </button>
                    </div>
                  )}

                  {abrirModal && (
                    <Modal onClose={() => setAbrirModal(false)}>
                      <div className="flex flex-col items-center p-6">
                        <h2 className="text-xl font-semibold mb-4 text-red-600">
                          {translate("¿Estás seguro de cancelar el viaje?")}
                        </h2>
                        <div className="flex gap-4">
                          <button
                            onClick={() => handleDelete(trip.id)}
                            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all cursor-pointer"
                          >
                            {translate("Confirmar")}
                          </button>
                          <button
                            onClick={() => setAbrirModal(false)}
                            className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all cursor-pointer"
                          >
                            {translate("Cancelar")}
                          </button>
                        </div>
                      </div>
                    </Modal>
                  )}
                </div>
              ))}

          {showDetails && (
            <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 backdrop-blur-sm">
              <div
                className={`p-8 rounded-2xl space-y-6 shadow-2xl max-w-lg w-full mx-4 ${
                  theme === "dark"
                    ? "bg-zinc-900 border border-yellow-500"
                    : "bg-white border border-yellow-500"
                } transform transition-all duration-300`}
                style={{ animation: "modalFadeIn 0.3s ease-out" }}
              >
                <h3
                  className={`text-2xl font-extrabold text-center ${
                    theme === "dark" ? "text-yellow-400" : "text-yellow-600"
                  } mb-4 tracking-wide`}
                >
                  <span className="border-b-4 border-yellow-500 pb-2 inline-block">
                    {translate("Detalles del Viaje")}
                  </span>
                </h3>

                <div className="space-y-6 text-sm">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <p
                        className={`font-medium opacity-70 ${
                          theme === "dark" ? "text-white" : "text-gray-600"
                        }`}
                      >
                        {translate("Origen")}:
                      </p>
                      <p
                        className={`font-semibold text-lg ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {showDetails.originAddress}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p
                        className={`font-medium opacity-70 ${
                          theme === "dark" ? "text-white" : "text-gray-600"
                        }`}
                      >
                        {translate("Destino")}:
                      </p>
                      <p
                        className={`font-semibold text-lg ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {showDetails.destinationAddress}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <p
                        className={`font-medium opacity-70 ${
                          theme === "dark" ? "text-white" : "text-gray-600"
                        }`}
                      >
                        {translate("Fecha")}:
                      </p>
                      <p
                        className={`font-semibold text-lg ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {new Date(showDetails.scheduledAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p
                        className={`font-medium opacity-70 ${
                          theme === "dark" ? "text-white" : "text-gray-600"
                        }`}
                      >
                        {translate("Precio")}:
                      </p>
                      <p
                        className={`font-semibold text-lg ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        ${showDetails.payment.amount}
                      </p>
                    </div>
                  </div>

                  {showDetails.driver && (
                    <div className="space-y-1">
                      <p
                        className={`font-medium opacity-70 ${
                          theme === "dark" ? "text-white" : "text-gray-600"
                        }`}
                      >
                        {translate("Conductor")}:
                      </p>
                      <p
                        className={`font-semibold text-lg ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {showDetails.driver.name}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => setShowDetails(null)}
                    className={`px-8 py-3 rounded-xl cursor-pointer font-semibold transition-transform duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                      theme === "dark"
                        ? "bg-zinc-700 hover:bg-zinc-600 text-white"
                        : "bg-yellow-500 hover:bg-yellow-600 text-gray-900"
                    }`}
                  >
                    {translate("Cerrar")}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal Edit Form */}
          {isEditing && (
            <form
              onSubmit={handleSave}
              className="fixed inset-0 bg-transparent bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm"
            >
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
                  Ajustar fecha y hora de salida
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
                      value={editingData.from}
                      disabled
                      type="text"
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
                      value={editingData.to}
                      disabled
                      type="text"
                      className={`w-full p-2 rounded  focus:outline-none focus:border-yellow-500 transition-yellow-500 transition-colors ${
                        theme === "dark"
                          ? "bg-zinc-800 text-white border border-zinc-700 "
                          : "bg-white text-zinc-900 border border-yellow-500"
                      }`}
                      placeholder={translate("Destino")}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="date"
                      className={`font-semibold text-sm mb-2 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-900"
                      }`}
                    >
                      {translate("Fecha")}
                    </label>
                    <input
                      id="date"
                      value={editingData.date}
                      onChange={(e) =>
                        setEditingData({
                          ...editingData,
                          date: e.target.value,
                        })
                      }
                      type="date"
                      className={`w-full p-2 rounded  focus:outline-none focus:border-yellow-500 transition-colors ${
                        theme === "dark"
                          ? "bg-zinc-800 text-white border border-zinc-700 "
                          : "bg-white text-zinc-900 border border-yellow-500"
                      }`}
                      placeholder={translate("Fecha")}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="time"
                      className={`font-semibold text-sm mb-2 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-900"
                      }`}
                    >
                      {translate("Hora")}
                    </label>
                    <input
                      id="time"
                      value={editingData.time}
                      onChange={(e) =>
                        setEditingData({
                          ...editingData,
                          time: e.target.value,
                        })
                      }
                      type="time"
                      className={`w-full p-2 rounded  focus:outline-none focus:border-yellow-500 transition-colors ${
                        theme === "dark"
                          ? "bg-zinc-800 text-white border border-zinc-700 "
                          : "bg-white text-zinc-900 border border-yellow-500"
                      }`}
                      placeholder={translate("Hora")}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="metodoPago"
                      className={`font-semibold text-sm mb-2 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-900"
                      }`}
                    >
                      {translate("Metodo de Pago")}
                    </label>
                    <select
                      id="metodoPago"
                      disabled
                      className={`w-full p-2 rounded  focus:outline-none focus:border-yellow-500 transition-colors ${
                        theme === "dark"
                          ? "bg-zinc-800 text-white border border-zinc-700 "
                          : "bg-white text-zinc-900 border border-yellow-500"
                      }`}
                    >
                      <option value="">
                        {translate("Seleccionar metodo de pago")}
                      </option>
                      <option value="efectivo">{translate("Efectivo")}</option>
                      <option value="tarjeta">{translate("Tarjeta")}</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-4 pt-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded transition-colors duration-200 cursor-pointer"
                  >
                    {translate("Cancelar")}
                  </button>
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded transition-colors duration-200 cursor-pointer">
                    {translate("Guardar")}
                  </button>
                </div>
              </div>
            </form>
          )}
          {/* Modal Trip Details */}
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

export default HistorialPassenger;

{
  /* Trip History 
          {(activeTab === "todos" || activeTab === "completados") &&
            trips.map((trip) => (
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
                  ></span>
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
                  {trip.originAddress}
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
                  {trip.destinationAddress}
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
                    onClick={() => handleDetails(trip.id)}
                    className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-1 rounded transition-colors duration-200 cursor-pointer"
                  >
                    {translate("Ver detalles")}
                  </button>
                </div>
              </div>
            ))}
*/
}
