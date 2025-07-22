import {
  historialPagos,
  historialCompleto,
  paymentMethods,
} from "../../../data/data";
import { ThemeContext } from "../../../context/ThemeContext";
import { useTranslate } from "../../../hooks/useTranslate";
import { useState, useContext } from "react";
import {
  Wallet,
  Calendar,
  ArrowRight,
  X,
  MapPin,
  DollarSign,
  Clock,
  CreditCardIcon,
} from "lucide-react";
import MainLayout from "../../../components/layout/MainLayout";

const PagosPassenger = () => {
  const { theme } = useContext(ThemeContext);
  const translate = useTranslate();

  const [selectedMethodId, setSelectedMethodId] = useState(1); // Ahora guardamos el ID del método seleccionado
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [showFullHistory, setShowFullHistory] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const openPaymentDetails = (payment) => {
    setSelectedPayment(payment);
    setShowPaymentDetails(true);
  };

  // Función para manejar el envío del formulario de nueva tarjeta
  return (
    <MainLayout>
      <div
        className={`flex-1 p-4 sm:px-6 sm:py-6  min-h-screen rounded ${
          theme === "dark"
            ? "bg-zinc-900 text-white "
            : "bg-white text-gray-900"
        }`}
      >
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Métodos de Pago */}
          <div
            className={` rounded-lg p-6 ${
              theme === "dark"
                ? "border border-zinc-800"
                : "border border-yellow-500"
            }`}
          >
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">
                {translate("Métodos de Pago Guardados")}
              </h1>
              <p className="text-gray-400">
                {translate("Selecciona tu método de pago predeterminado")}
              </p>
            </div>

            {/* Payment Methods List */}
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`rounded-lg p-4 ${
                    theme === "dark"
                      ? "bg-zinc-900 border border-zinc-800"
                      : "bg-white border border-yellow-500"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Radio seleccionable */}
                      <div
                        className={`w-6 h-6 rounded-full border-2 ${
                          selectedMethodId === method.id
                            ? "border-yellow-500"
                            : "border-zinc-600"
                        } flex items-center justify-center cursor-pointer`}
                        onClick={() => setSelectedMethodId(method.id)}
                      >
                        <div
                          className={`w-3 h-3 rounded-full ${
                            selectedMethodId === method.id
                              ? "bg-yellow-500"
                              : ""
                          }`}
                        ></div>
                      </div>

                      {/* Icono de método */}
                      <div
                        className={`${
                          method.type === "cash"
                            ? "bg-blue-500"
                            : "bg-green-500"
                        } p-2 rounded`}
                      >
                        {method.type === "mercado_pago" ? (
                          <Wallet className="w-6 h-6 text-white" />
                        ) : (
                          <DollarSign className="w-6 h-6 text-white" />
                        )}
                      </div>

                      {/* Detalles */}
                      <div>
                        <p className="font-medium">{method.name}</p>
                        <p className="text-sm text-gray-400">
                          {method.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Payment Method Button 
            <button
              className="mt-6 flex items-center gap-2 text-yellow-500 hover:text-yellow-400 transition-colors"
              onClick={() => setShowAddCard(!showAddCard)}
            >
              <Plus className="w-5 h-5" />
              <span className="cursor-pointer">
                {translate("Agregar método de pago")}
              </span>
            </button>*/}
          </div>

          {/* Historial de Pagos */}
          <div
            className={` rounded-lg p-6 ${
              theme === "dark"
                ? "border border-zinc-800"
                : "border border-yellow-500"
            }`}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">
                {translate("Historial de Pagos")}
              </h2>
              <p className="text-gray-400">
                {translate("Revisa tus pagos recientes")}
              </p>
            </div>

            <div className="space-y-4">
              {historialPagos.map((pago) => (
                <div
                  key={pago.id}
                  className={`rounded-lg p-4 ${
                    theme === "dark"
                      ? "bg-zinc-900 border border-zinc-800 "
                      : "bg-white border border-yellow-500"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={` p-2 rounded ${
                          theme === "dark" ? "bg-zinc-800" : "bg-white"
                        }`}
                      >
                        <Calendar
                          className={`w-5 h-5  ${
                            theme === "dark" ? "text-gray-400" : "text-gray-900"
                          }`}
                        />
                      </div>
                      <div>
                        <p className="font-medium">{pago.destino}</p>
                        <div className="flex items-center text-sm text-gray-400">
                          <span>{pago.fecha}</span>
                          <span className="mx-2">•</span>
                          <span>{pago.metodo}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{pago.monto}</span>
                      <button
                        className="text-gray-400 hover:text-yellow-500 transition-colors"
                        onClick={() => openPaymentDetails(pago)}
                      >
                        <ArrowRight className="w-5 h-5 cursor-pointer" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              className={`mt-4 w-full border font-semibold rounded-lg py-3 text-center transition-colors cursor-pointer ${
                theme === "dark"
                  ? "text-white border-zinc-700 hover:border-zinc-600"
                  : "bg-yellow-500 text-gray-900 border-yellow-500 hover:border-yellow-400"
              }`}
              onClick={() => setShowFullHistory(true)}
            >
              {translate("Ver historial completo")}
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Detalles de Pago */}
      {showPaymentDetails && selectedPayment && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className={` rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto ${
              theme === "dark"
                ? "bg-zinc-900 border border-zinc-800"
                : "bg-white border border-yellow-500 text-gray-900"
            }`}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-yellow-500 ">
                  {translate("Detalles de viaje")}
                </h2>
                <button
                  className={` cursor-pointer ${
                    theme === "dark"
                      ? "text-gray-900 hover:text-yellow-500 cursor-pointer "
                      : "text-yellow-400 hover:text-gray-900 cursor-pointer "
                  }`}
                  onClick={() => setShowPaymentDetails(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-yellow-500 text-black p-4 rounded-lg mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">
                    {translate("Total")}
                  </span>
                  <span className="font-bold text-lg">
                    {selectedPayment.monto}
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3
                    className={` text-sm mb-2 font-semibold ${
                      theme === "dark" ? "text-yellow-500" : "text-gray-900"
                    }`}
                  >
                    {translate("Fecha y Hora")}
                  </h3>
                  <div className="flex items-center gap-3">
                    <Calendar
                      className={
                        theme === "dark"
                          ? "w-5 h-5 text-yellow-500"
                          : "w-5 h-5 text-gray-900"
                      }
                    />
                    <span className="font-medium text-gray-400">
                      {selectedPayment.fecha} - {selectedPayment.hora}
                    </span>
                  </div>
                </div>

                <div>
                  <h3
                    className={`text-sm mb-2 font-semibold ${
                      theme === "dark" ? "text-yellow-500" : "text-gray-900"
                    }`}
                  >
                    {translate("Ubicaciones")}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <MapPin
                          className={
                            theme === "dark"
                              ? "w-4 h-4 text-yellow-500"
                              : "w-4 h-4 text-gray-900"
                          }
                        />
                      </div>
                      <div>
                        <p
                          className={` text-sm font-semibold ${
                            theme === "dark"
                              ? "text-yellow-500"
                              : "text-gray-900"
                          }`}
                        >
                          {translate("Origen")}
                        </p>
                        <p className="text-sm font-medium text-gray-400">
                          {selectedPayment.origen}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <MapPin className="w-4 h-4 text-red-500" />
                      </div>
                      <div>
                        <p
                          className={` text-sm font-semibold ${
                            theme === "dark"
                              ? "text-yellow-500"
                              : "text-gray-900"
                          }`}
                        >
                          {translate("Destino")}
                        </p>
                        <p className="text-sm  font-medium text-gray-400">
                          {selectedPayment.destinoCompleto}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3
                      className={`text-sm font-semibold ${
                        theme === "dark" ? "text-yellow-500" : "text-gray-900"
                      }`}
                    >
                      {translate("Distancia")}
                    </h3>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-400">
                        {selectedPayment.distancia}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3
                      className={`text-sm font-semibold ${
                        theme === "dark" ? "text-yellow-500" : "text-gray-900"
                      }`}
                    >
                      {translate("Tiempo")}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-400">
                        {selectedPayment.tiempo}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3
                    className={`text-sm font-semibold ${
                      theme === "dark" ? "text-yellow-500" : "text-gray-900"
                    }`}
                  >
                    {translate("Conductor")}
                  </h3>
                  <p className="font-medium text-gray-400">
                    {selectedPayment.conductor}
                  </p>
                </div>

                <div>
                  <h3
                    className={`text-sm font-semibold ${
                      theme === "dark" ? "text-yellow-500" : "text-gray-900"
                    }`}
                  >
                    {translate("Método de Pago")}
                  </h3>
                  <div className="flex items-center gap-2">
                    {selectedPayment.metodo.includes("Visa") ? (
                      <CreditCardIcon className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Wallet className="w-4 h-4 text-gray-400" />
                    )}
                    <span className="font-medium text-gray-400">
                      {selectedPayment.metodo}
                    </span>
                  </div>
                </div>

                <div>
                  <h3
                    className={`text-sm font-semibold ${
                      theme === "dark" ? "text-yellow-500" : "text-gray-900"
                    }`}
                  >
                    {translate("Estado")}
                  </h3>
                  <div
                    className={
                      theme === "dark"
                        ? "inline-block px-3 py-1 border border-yellow-500 font-medium text-gray-400 rounded-full text-sm"
                        : "inline-block px-3 py-1 border border-yellow-500 font-medium text-gray-400 rounded-full text-sm"
                    }
                  >
                    {selectedPayment.estado}
                  </div>
                </div>
              </div>

              <button
                className={
                  theme === "dark"
                    ? "mt-6 w-full bg-zinc-700 hover:bg-zinc-600 rounded-lg py-3 text-center transition-colors cursor-pointer"
                    : "mt-6 w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-3 rounded-lg transition-colors cursor-pointer"
                }
                onClick={() => setShowPaymentDetails(false)}
              >
                {translate("Cerrar")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Historial Completo */}
      {showFullHistory && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div
            className={
              theme === "dark"
                ? "bg-zinc-900 border border-zinc-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                : "bg-white border border-yellow-500 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            }
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl  text-yellow-500 font-bold">
                  {translate("Historial Completo de Viajes")}
                </h2>
                <button
                  className={
                    theme === "dark"
                      ? "text-yellow-500 hover:text-gray-900 cursor-pointer"
                      : "text-gray-900 hover:text-yellow-500 cursor-pointer"
                  }
                  onClick={() => setShowFullHistory(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {historialCompleto.map((pago) => (
                  <div
                    key={pago.id}
                    className={
                      theme === "dark"
                        ? "bg-zinc-800 border border-zinc-700 rounded-lg p-4"
                        : "bg-white border border-yellow-500 rounded-lg p-4"
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={
                            theme === "dark"
                              ? "bg-zinc-700 p-2 rounded"
                              : "bg-white p-2 rounded"
                          }
                        >
                          <Calendar
                            className={
                              theme === "dark"
                                ? "w-5 h-5 text-yellow-500"
                                : "w-5 h-5 text-gray-900"
                            }
                          />
                        </div>
                        <div>
                          <p
                            className={
                              theme === "dark"
                                ? "text-yellow-500 font-semibold"
                                : "text-gray-900 font-semibold"
                            }
                          >
                            {pago.destino}
                          </p>
                          <div className="flex items-center font-medium text-sm text-gray-400">
                            <span>{pago.fecha}</span>
                            <span className="mx-2">•</span>
                            <span>{pago.hora}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{pago.monto}</span>
                        <button
                          className="text-gray-400 hover:text-yellow-500 transition-colors cursor-pointer"
                          onClick={() => {
                            setShowFullHistory(false);
                            setTimeout(() => {
                              openPaymentDetails(pago);
                            }, 300);
                          }}
                        >
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                className={
                  theme === "dark"
                    ? "mt-6 w-full bg-zinc-700 hover:bg-zinc-600 rounded-lg py-3 text-center text-white transition-colors cursor-pointer"
                    : "mt-6 w-full bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold py-3 rounded-lg transition-colors cursor-pointer"
                }
                onClick={() => setShowFullHistory(false)}
              >
                {translate("Cerrar")}
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default PagosPassenger;
