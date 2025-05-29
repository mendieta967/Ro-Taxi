import MainLayout from "../../../components/layout/MainLayout";
import { historailViajes, cardViajes } from "../../../data/data";
import { MapPin, Clock, Star } from "lucide-react";
import Modal from "../../../components/ui/Modal";
import { modalOrderTaxi } from "../../../data/data";
import { useState, useContext } from "react";
import { useAuth } from "../../../context/auth";
import { ThemeContext } from "../../../context/ThemeContext";
import { useTranslate } from "../../../hooks/useTranslate";

const HomePassenger = () => {
  const [showModal, setShowModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("efectivo");
  const [selectedCar, setSelectedCar] = useState("estandar");
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  
  const { user } = useAuth();
  const {theme} = useContext(ThemeContext);
  const  translate  = useTranslate();

  const handleOrderTaxi = () => {
    setShowModal(true);
  };

  const handlePedirAhora = () => {
    setShowModal(false); // Cerrar el modal de selección de vehículo
    setShowRequestModal(true); // Mostrar el modal de búsqueda de taxi

    // Después de unos segundos (simulación de carga), mostrar el modal de confirmación
    setTimeout(() => {
      setShowRequestModal(false); // Ocultar el modal de búsqueda
      setShowConfirmationModal(true); // Mostrar el modal de confirmación
    }, 2000); // Simula 2 segundos de carga
  };

  return (
    <MainLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-white">
        {/* Columna izquierda (Formulario + Mapa) */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-yellow-500' : 'text-gray-900'}`}>
              !{translate("Hola")}, {user.userName.split(" ")[0]}!
            </h1>
            <p className={`  ${theme === 'dark' ? 'text-white' : 'text-gray-800'}` }>{translate("¿A dónde quieres ir hoy?")}</p>
          </div>
          {/* Formulario */}
          <div className={`p-6 rounded-xl space-y-6  ${theme === 'dark' ? 'bg-zinc-900' : 'bg-white border border-yellow-500'}`}>
            {/* Inputs */}
            <div className="space-y-4">
              <div className={`flex items-center gap-3  px-4 py-3 rounded-lg ${theme === 'dark' ? 'bg-zinc-800' : 'bg-white border border-yellow-500'}`}>
                <MapPin className={`${theme === 'dark' ? 'text-yellow-500' : 'text-gray-900'}`} size={20} />
                <input
                  type="text"
                  placeholder={translate("Mi ubicación actual")}
                  className={`bg-transparent outline-none w-full ${theme === 'dark' ? 'text-white' : 'text-gray-900'} placeholder:text-zinc-400`}
                />
              </div>
              <div className={`flex items-center gap-3  px-4 py-3 rounded-lg ${theme === 'dark' ? 'bg-zinc-800' : 'bg-white border border-yellow-500'}`}>
                <MapPin className={`${theme === 'dark' ? 'text-yellow-500' : 'text-gray-900'}`} size={20} />
                <input
                  type="text"
                  placeholder={translate("¿A dónde vas?")}
                  className={`bg-transparent outline-none w-full ${theme === 'dark' ? 'text-white' : 'text-gray-900'} placeholder:text-zinc-400`}
                />
              </div>
            </div>

            {/* Mapa simulado */}
            <div className="bg-zinc-700 h-64 rounded-lg grid place-items-center">
              <div className="w-5 h-5 bg-yellow-500 rounded-full shadow-md" />
            </div>

            {/* Botón */}
            <div className="flex items-center justify-center ">
              <button
                onClick={handleOrderTaxi}
                className="w-full  bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-3 rounded-lg transition-colors cursor-pointer"
              >
                {translate("Solicitar Taxi")}
              </button>
            </div>
          </div>
        </div>

        {/* Columna derecha (Viajes recientes) */}
        <div className={`p-4 rounded-xl space-y-6 ${theme === 'dark' ? 'bg-zinc-900' : 'bg-white border border-yellow-500'}`}>
          {/* Título */}
          <h2 className={`text-2xl font-bold  ${theme === 'dark' ? 'text-yellow-500' : 'text-gray-900'}`}>
            {translate("Viajes Recientes")}
          </h2>

          {/* Lista de viajes */}
          <div className="space-y-4">
            {historailViajes.map((viajes, id) => (
              <div
                key={id}
                className={` p-4 rounded-lg flex justify-between items-start shadow-sm  transition ${theme === 'dark' ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-white border border-yellow-500 hover:bg-yellow-50'}`}
              >
                <div className="space-y-1">
                  <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} font-medium`}>{viajes.title}</p>
                  <p className="text-sm text-zinc-400 flex items-center gap-1">
                    <Clock size={14} /> {viajes.date}
                  </p>
                  <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} font-semibold`}>
                    {viajes.price}
                  </p>
                </div>
                <div className={`flex items-center ${theme === 'dark' ? 'text-yellow-500' : 'text-gray-900'} text-sm`}>
                  <Star size={16} className="mr-1" />
                  5.0
                </div>
              </div>
            ))}
          </div>

          {/* Ver todos */}
          <button className={` hover:underline w-full text-sm font-medium text-center cursor-pointer ${theme === 'dark' ? 'text-yellow-500' : 'text-gray-900'}`}>
            {translate("Ver todos los viajes")}
          </button>
        </div>

        {/* Tarjetas informativas */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {/* Tarjeta común */}
          {cardViajes.map((item, id) => (
            <div
              key={id}
              className={`transition p-5 rounded-lg space-y-1 shadow-sm ${theme === 'dark' ? 'bg-zinc-900 hover:bg-zinc-800' : 'bg-white border border-yellow-500 hover:bg-yellow-50'}`}
            >
              <h3 className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} font-semibold text-lg`}>{item.title}</h3>
              <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-sm `}>{item.description}</p>
            </div>
          ))}

          {/* Tarjeta especial para agregar */}
          <div className={`transition p-5 rounded-lg flex flex-col items-center justify-center text-center space-y-2 shadow-sm ${theme === 'dark' ? 'bg-zinc-900 hover:bg-zinc-800' : 'bg-white border border-yellow-500 hover:bg-yellow-50'}`}>
            <div className={`w-10 h-10 flex items-center justify-center  text-black text-xl font-bold rounded-full ${theme === 'dark' ? 'bg-yellow-500' : 'bg-yellow-500'}`}>
              +
            </div>
            <h3 className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} font-semibold`}>{translate("Agregar")}</h3>
            <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-sm`}>
              {translate("Añadir nuevo destino o preferencia")}
            </p>
          </div>
        </div>
      </div>

      {/* Modal Pedir taxi */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <h2 className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-xl font-bold`}>{translate("Seleccione su vehículo")}</h2>
          <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-sm mb-4`}>
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
                    <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} font-semibold`}>{car.name}</p>
                    <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-sm`}>{car.desc}</p>
                    <span className="inline-block mt-1 text-xs bg-zinc-700 rounded-full px-2 py-0.5">
                      {car.seats} {translate("pasajeros")}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-md font-semibold`}>{car.price}</p>
                    <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-sm`}>{translate("Llegada")}: {car.time}</p>
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

          <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-sm mt-2`}>
            {translate("Pagarás")}{" "}
            {paymentMethod === "efectivo" ? translate("en efectivo") : translate("con tarjeta")} {translate("final del viaje")}
          </p>

          {/* Confirmar */}
          <button
            className="w-full cursor-pointer bg-yellow-400 hover:bg-yellow-300 text-black font-bold py-2 px-4 rounded"
            onClick={handlePedirAhora}
          >
            {translate("Pedir Ahora")}
          </button>
        </Modal>
      )}

      {/* Modal de solicitud */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-zinc-900 w-[90%] max-w-sm rounded-2xl p-6 text-white text-center">
            <div className="text-4xl mb-4 animate-spin">🚕</div>
            <h2 className="text-xl font-bold">{translate("Buscando un taxi cercano")}...</h2>
            <p className="text-zinc-400 mt-2">{translate("Esto tomará unos segundos")}</p>
          </div>
        </div>
      )}

      {/* Modal de confirmación */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className={  ` w-[90%] max-w-md rounded-2xl p-6 space-y-4 text-white shadow-xl relative ${theme === 'dark' ? 'bg-zinc-900' : 'bg-white border border-yellow-500'}`}>
            <div className="flex justify-center">
              <div className={`w-16 h-16  rounded-full flex items-center justify-center text-3xl ${theme === 'dark' ? 'bg-green-800' : 'bg-green-800'}`}>
                ⏱️
              </div>
            </div>

            <h2 className={`text-2xl font-bold text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {translate("¡Tu taxi está en camino!")}
            </h2>
            <p className={`text-center text-zinc-400 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {translate("Llegada estimada")}: 3 minutos
            </p>

            <div className={`flex items-center gap-4 p-4 rounded-lg ${theme === 'dark' ? 'bg-zinc-800' : 'bg-white border border-yellow-500'}`}>
     
              <div>
                <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Juan Rodríguez <span className="text-yellow-500">★ 4.8</span>
                </p>
                <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Toyota Corolla • XYZ-123 • Azul
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button className={`flex-1 py-2 border rounded-lg cursor-pointer ${theme === 'dark' ? 'bg-zinc-800 border-zinc-700  hover:bg-zinc-800 ' : 'bg-yellow-500 border border-yellow-600 hover:bg-yellow-400 '}`}>
                {translate("Contactar")}
              </button>
              <button
                onClick={() => setShowConfirmationModal(false)}
                className="flex-1 py-2 bg-red-600 hover:bg-red-500 rounded-lg cursor-pointer"
              >
                {translate("Cancelar")}
              </button>
            </div>

            <div className={`p-3 rounded-lg text-sm ${theme === 'dark' ? 'bg-zinc-800' : 'bg-white border border-yellow-500'}`}>
              <strong className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{translate("¡Taxi en camino!")}</strong>
              <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{translate("Tu conductor llegará en aproximadamente 3 minutos")}</p>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default HomePassenger;
