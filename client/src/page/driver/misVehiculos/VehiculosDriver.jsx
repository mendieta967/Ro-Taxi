import MainLayout from "../../../components/layout/MainLayout";
import { Car, Plus, Edit, Trash2, Check, AlertCircle } from "lucide-react";
import { useState } from "react";
const VehiculosDriver = () => {
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  return (
    <MainLayout>
      <div className="min-h-screen  text-white p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
              Mis Vehículos
            </h1>
            <button
              onClick={() => setShowAddVehicle(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-medium py-2 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-yellow-500/20"
            >
              <Plus size={20} />
              Agregar Vehículo
            </button>
          </div>

          {/* Lista de vehículos */}
          <div className="space-y-6">
            {/* Vehículo 1 */}
            <div className="backdrop-blur-md bg-zinc-900/70 rounded-2xl p-6 border border-zinc-800/50 shadow-xl hover:shadow-yellow-500/10 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-zinc-800 rounded-xl flex items-center justify-center">
                    <Car size={32} className="text-yellow-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Toyota Corolla</h3>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-sm text-gray-300">
                      <p>
                        <span className="text-gray-500">Placa:</span> ABC-123
                      </p>
                      <p>
                        <span className="text-gray-500">Año:</span> 2020
                      </p>
                      <p>
                        <span className="text-gray-500">Color:</span> Blanco
                      </p>
                      <p>
                        <span className="text-gray-500">Capacidad:</span> 4
                        pasajeros
                      </p>
                    </div>
                    <div className="mt-3 flex items-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-500/30">
                        <Check size={12} className="mr-1" />
                        Activo
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-all duration-200">
                    <Edit size={18} className="text-yellow-500" />
                  </button>
                  <button className="p-2 bg-zinc-800 hover:bg-red-900/50 rounded-lg transition-all duration-200">
                    <Trash2 size={18} className="text-red-500" />
                  </button>
                </div>
              </div>
            </div>

            {/* Vehículo 2 */}
            <div className="backdrop-blur-md bg-zinc-900/70 rounded-2xl p-6 border border-zinc-800/50 shadow-xl hover:shadow-yellow-500/10 transition-all duration-300">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-zinc-800 rounded-xl flex items-center justify-center">
                    <Car size={32} className="text-yellow-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Honda Civic</h3>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-sm text-gray-300">
                      <p>
                        <span className="text-gray-500">Placa:</span> XYZ-789
                      </p>
                      <p>
                        <span className="text-gray-500">Año:</span> 2019
                      </p>
                      <p>
                        <span className="text-gray-500">Color:</span> Negro
                      </p>
                      <p>
                        <span className="text-gray-500">Capacidad:</span> 4
                        pasajeros
                      </p>
                    </div>
                    <div className="mt-3 flex items-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900/30 text-yellow-400 border border-yellow-500/30">
                        <AlertCircle size={12} className="mr-1" />
                        En revisión
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-all duration-200">
                    <Edit size={18} className="text-yellow-500" />
                  </button>
                  <button className="p-2 bg-zinc-800 hover:bg-red-900/50 rounded-lg transition-all duration-200">
                    <Trash2 size={18} className="text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario para agregar vehículo (condicional) */}
          {showAddVehicle && (
            <div className="mt-8 backdrop-blur-md bg-zinc-900/70 rounded-2xl p-6 border border-zinc-800/50 shadow-xl animate-fadeIn">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Car size={20} className="text-yellow-500" />
                Agregar Nuevo Vehículo
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-medium text-gray-400 mb-1 group-focus-within:text-yellow-500 transition-colors duration-200">
                    Marca
                  </label>
                  <input
                    type="text"
                    className="block w-full px-3 py-3 border border-zinc-700 rounded-lg bg-zinc-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200"
                    placeholder="Ej: Toyota"
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-gray-400 mb-1 group-focus-within:text-yellow-500 transition-colors duration-200">
                    Modelo
                  </label>
                  <input
                    type="text"
                    className="block w-full px-3 py-3 border border-zinc-700 rounded-lg bg-zinc-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200"
                    placeholder="Ej: Corolla"
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-gray-400 mb-1 group-focus-within:text-yellow-500 transition-colors duration-200">
                    Placa
                  </label>
                  <input
                    type="text"
                    className="block w-full px-3 py-3 border border-zinc-700 rounded-lg bg-zinc-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200"
                    placeholder="Ej: ABC-123"
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-gray-400 mb-1 group-focus-within:text-yellow-500 transition-colors duration-200">
                    Año
                  </label>
                  <input
                    type="number"
                    className="block w-full px-3 py-3 border border-zinc-700 rounded-lg bg-zinc-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200"
                    placeholder="Ej: 2020"
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-gray-400 mb-1 group-focus-within:text-yellow-500 transition-colors duration-200">
                    Color
                  </label>
                  <input
                    type="text"
                    className="block w-full px-3 py-3 border border-zinc-700 rounded-lg bg-zinc-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200"
                    placeholder="Ej: Blanco"
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-gray-400 mb-1 group-focus-within:text-yellow-500 transition-colors duration-200">
                    Capacidad
                  </label>
                  <select className="block w-full px-3 py-3 border border-zinc-700 rounded-lg bg-zinc-800/50 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200">
                    <option value="4">4 pasajeros</option>
                    <option value="6">6 pasajeros</option>
                    <option value="8">8 pasajeros</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setShowAddVehicle(false)}
                  className="flex-1 py-3 px-4 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-all duration-200 font-medium"
                >
                  Cancelar
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-medium py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-yellow-500/20">
                  <Check size={20} />
                  Guardar Vehículo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};
export default VehiculosDriver;
