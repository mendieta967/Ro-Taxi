import { useEffect, useState, useContext } from "react";
import MapSearch from "../MapSearch";
import MapSearchResult from "../MapSearchResult";
import Modal from "../../../ui/Modal";
import { modalOrderTaxi } from "../../../../data/data";
import { useTranslate } from "../../../../hooks/useTranslate";
import { ThemeContext } from "../../../../context/ThemeContext";

const MapForm = ({
    handleSelect,
    inputOriginRef,
    inputDestinationRef,
    activeInput,
    handleActiveInput,
    handleSearchResults,
    searchResults,
    inputValues,
    handleInputChange,
    currentLocation,
    mapLoading,
    handleConfirm, //para llamar a la api
}) => {
    function getDistance(lat1, lon1, lat2, lon2) {
        function toRad(x) {
          return (x * Math.PI) / 180;
        }
        const R = 6371; // km
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRad(lat1)) *
            Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
      }

      useEffect(() => {
        const search =
          activeInput === "origin" ? inputValues.origin : inputValues.destination;
        const handler = setTimeout(() => {
          if (search.length > 2) {
            const params = new URLSearchParams({
              q: search,
              format: "json",
              addressdetails: 1,
              limit: 10,
            });
            fetch("https://nominatim.openstreetmap.org/search?" + params)
              .then((res) => res.json())
              .then((data) => {
                if (currentLocation && Array.isArray(data)) {
                  data.sort((a, b) => {
                    const d1 = getDistance(
                      currentLocation.lat,
                      currentLocation.lng,
                      parseFloat(a.lat),
                      parseFloat(a.lon)
                    );
                    const d2 = getDistance(
                      currentLocation.lat,
                      currentLocation.lng,
                      parseFloat(b.lat),
                      parseFloat(b.lon)
                    );
                    return d1 - d2;
                  });
                }
                handleSearchResults(data);
              })
              .catch(() => handleSearchResults([]));
          } else {
            handleSearchResults([]);
          }
        }, 400); // 400ms debounce
        return () => clearTimeout(handler);
      }, [
        inputValues.origin,
        inputValues.destination,
        activeInput,
        currentLocation,
        handleSearchResults,
      ]);


  const [showModal, setShowModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("efectivo");
  const [selectedCar, setSelectedCar] = useState("estandar");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);


  const translate = useTranslate();
  const {theme} = useContext(ThemeContext);

  const handlePedirTaxi = async () => {
    // Aquí ya sabemos que los inputs están completos porque el modal solo se muestra si lo están
    
    // Primero cerramos el modal actual
    setShowModal(false);
    
    // Luego confirmamos el viaje
    handleConfirm();
    
    // Mostrar el modal de solicitud
    setShowRequestModal(true);
    
    // Después de 2 segundos, mostrar el modal de confirmación
    setTimeout(() => {
      setShowRequestModal(false);
      setShowConfirmationModal(true);
    }, 2000);
  }

  const handleCancel = () => {
    // Mostrar el modal de confirmación de cancelación
    setShowCancelConfirmation(true);
  }

  const handleConfirmCancel = () => {
    // Limpiar los inputs usando el estado directamente
    inputValues.origin = '';
    inputValues.destination = '';
    
    // Limpiar la consola
    console.clear();
    
    // Cerrar todos los modales
    setShowCancelConfirmation(false);
    setShowConfirmationModal(false);
    setShowRequestModal(false);
    setShowModal(false);
  }

    return (
      <div className="w-full max-w-md mx-auto md:max-w-xl lg:max-w-2xl h-auto max-h-[90vh] md:h-[500px] overflow-y-auto p-6 bg-zinc-900  shadow-lg">
      {/* Contenedor principal */}
      <div className="flex flex-col h-80">
        {/* Contenedor de Inputs */}
        <div className="flex flex-col gap-4 mb-6">
          {/* Input Origen */}
          <div className="relative">
            <MapSearch
              type="origin"
              title="Origen"
              ref={inputOriginRef}
              activeInput={activeInput}
              handleActiveInput={handleActiveInput}
              handleInputChange={handleInputChange}
              value={inputValues.origin}
            />
            {activeInput === "origin" &&
              (mapLoading || (searchResults.length > 0 && !mapLoading)) && (
                <div className="absolute z-10 top-full left-0 right-0 max-h-[240px] bg-zinc-900 rounded-lg shadow-lg border border-zinc-700 overflow-y-auto">
                  {mapLoading ? (
                    <div className="flex items-center justify-center h-16">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500"></div>
                    </div>
                  ) : (
                    <MapSearchResult
                      handleSelect={handleSelect}
                      searchResults={searchResults}
                    />
                  )}
                </div>
              )}
          </div>
    
          {/* Input Destino */}
          <div className="relative">
            <MapSearch
              type="destination"
              title="Destino"
              ref={inputDestinationRef}
              activeInput={activeInput}
              handleActiveInput={handleActiveInput}
              handleInputChange={handleInputChange}
              value={inputValues.destination}
            />
            {activeInput === "destination" &&
              (mapLoading || (searchResults.length > 0 && !mapLoading)) && (
                <div className="absolute z-10 top-full left-0 right-0 max-h-[240px] bg-zinc-900 rounded-lg shadow-lg border border-zinc-700 overflow-y-auto">
                  {mapLoading ? (
                    <div className="flex items-center justify-center h-16">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500"></div>
                    </div>
                  ) : (
                    <MapSearchResult
                      handleSelect={handleSelect}
                      searchResults={searchResults}
                    />
                  )}
                </div>
              )}
          </div>
        </div>
    
        {/* Contenedor de botones */}
        <div className="flex justify-center gap-4 mt-auto">
        
          <button
            onClick={() => {
              if (!inputValues.origin || !inputValues.destination) {
                alert('Por favor, complete tanto el origen como el destino');
                return;
              }
              setShowModal(true);
            }}
            className={`bg-yellow-500 hover:bg-yellow-400 cursor-pointer text-black px-6 py-2 rounded-lg transition-colors font-semibold ${
              !inputValues.origin || !inputValues.destination ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {translate("Confirmar")}
          </button>
        </div>
        {/* Modal Pedir taxi */}
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
          {/* Opciones de vehículos */}
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

          {/* Método de pago */}
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

          {/* Confirmar */}
          <button
            className="w-full cursor-pointer bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-2 px-4 rounded"
            onClick={() => handlePedirTaxi()}
          >
            {translate("Pedir Ahora")}
          </button>
        </Modal>
      )}
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
        {/* Modal de confirmación */}
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
                onClick={() => handleCancel()}
                className="flex-1 py-2 bg-red-600 hover:bg-red-500 rounded-lg cursor-pointer"
              >
                {translate("Cancelar")}
              </button>
            </div>

            {/* Modal de confirmación de cancelación */}
            {showCancelConfirmation && (
              <Modal onClose={() => setShowCancelConfirmation(false)}>
                <h2
                  className={`${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  } text-xl font-bold`}
                >
                  {translate("Confirmar Cancelación")}
                </h2>
                <p
                  className={`${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  } text-sm mb-4`}
                >
                  {translate("¿Estás seguro que deseas cancelar tu viaje?")}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCancelConfirmation(false)}
                    className={`flex-1 py-2 rounded-lg cursor-pointer ${
                      theme === "dark"
                        ? "bg-zinc-800 hover:bg-zinc-700"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    {translate("Cancelar")}
                  </button>
                  <button
                    onClick={handleConfirmCancel}
                    className={`flex-1 py-2 bg-red-600 hover:bg-red-500 rounded-lg cursor-pointer`}
                  >
                    {translate("Confirmar")}
                  </button>
                </div>
              </Modal>
            )}

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
      )}
      </div>
    </div>
    
)
}

export default MapForm
