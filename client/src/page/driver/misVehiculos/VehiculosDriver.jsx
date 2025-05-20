import MainLayout from "../../../components/layout/MainLayout";
import { Car, Plus, Edit, Trash2, Check, AlertCircle } from "lucide-react";
import { useState } from "react";
const VehiculosDriver = () => {
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [vehiculoEditando, setVehiculoEditando] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [patente, setPatente] = useState("");
  const [año, setAño] = useState("");
  const [color, setColor] = useState("");
  const [estado, setEstado] = useState("activo");
  const [vehiculos, setVehiculos] = useState([
    {
      marca: "Toyota",
      modelo: "Corolla",
      patente: "ABC-123",
      año: 2020,
      color: "Blanco",
      estado: "activo",
    },
    {
      marca: "Honda",
      modelo: "Civic",
      patente: "XYZ-789",
      año: 2019,
      color: "Negro",
      estado: "revision",
    },
  ]);
  const handleSumbit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!marca || !modelo || !patente || !año || !color || !estado) {
      alert("Por favor completá todos los campos.");
      return;
    }

    if (isNaN(año) || año < 1900 || año > new Date().getFullYear()) {
      alert("Ingresá un año válido.");
      return;
    }

    const patenteExiste = vehiculos.some(
      (v) => v.patente.toLowerCase() === patente.toLowerCase()
    );
    if (patenteExiste) {
      alert("Ya existe un vehículo con esa patente.");
      return;
    }

    const nuevoVehiculo = {
      marca,
      modelo,
      patente,
      año: parseInt(año),
      color,
      estado,
    };

    setVehiculos([...vehiculos, nuevoVehiculo]);
    setShowAddVehicle(false);

    // Limpiar campos
    setMarca("");
    setModelo("");
    setPatente("");
    setAño("");
    setColor("");
    setEstado("activo");
  };
  const handleEditar = (vehiculo) => {
    setVehiculoEditando(vehiculo);
    setMostrarModal(true);
  };
  const guardarCambios = () => {
    const nuevosVehiculos = vehiculos.map((v) =>
      v.patente === vehiculoEditando.patente ? vehiculoEditando : v
    );
    setVehiculos(nuevosVehiculos);
    setMostrarModal(false);
  };

  const handleDelite = (patente) => {
    setVehiculos(vehiculos.filter((v) => v.patente !== patente));
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-zinc-900 border-zinc-800 text-white p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
              Mis Vehículos
            </h1>
            <button
              onClick={() => setShowAddVehicle(true)}
              className="flex cursor-pointer items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-medium py-2 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-yellow-500/20"
            >
              <Plus size={20} />
              Agregar Vehículo
            </button>
          </div>

          <div className="space-y-6">
            {vehiculos.map((vehiculo, index) => (
              <div
                key={index}
                className="backdrop-blur-md bg-zinc-900/70 rounded-2xl p-6 border border-yellow-500 shadow-xl hover:shadow-yellow-500/10 transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-zinc-800 rounded-xl flex items-center justify-center">
                      <Car size={32} className="text-yellow-500" />
                    </div>

                    <div>
                      <h3 className="text-xl font-bold">{vehiculo.marca}</h3>
                      <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-sm text-gray-300">
                        <p>
                          <span className="text-yellow-500">Modelo: </span>
                          {vehiculo.modelo}
                        </p>
                        <p>
                          <span className="text-yellow-500">Patente: </span>
                          {vehiculo.patente}
                        </p>
                        <p>
                          <span className="text-yellow-500">Año: </span>{" "}
                          {vehiculo.año}
                        </p>
                        <p>
                          <span className="text-yellow-500">Color: </span>{" "}
                          {vehiculo.color}
                        </p>
                      </div>
                      <div className="mt-3 flex items-center">
                        {vehiculo.estado === "activo" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-500/30">
                            <Check size={12} className="mr-1" />
                            Activo
                          </span>
                        )}
                        {vehiculo.estado === "revision" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900/30 text-yellow-400 border border-yellow-500/30">
                            <AlertCircle size={12} className="mr-1" />
                            Revisión
                          </span>
                        )}
                        {vehiculo.estado === "inactivo" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/30 text-red-400 border border-red-500/30">
                            <AlertCircle size={12} className="mr-1" />
                            Inactivo
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditar(vehiculo)}
                      className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-all duration-200 cursor-pointer"
                    >
                      <Edit size={18} className="text-yellow-500" />
                    </button>
                    <button
                      onClick={() => handleDelite(vehiculo.patente)}
                      className="p-2 bg-zinc-800 hover:bg-red-900/50 rounded-lg transition-all duration-200 cursor-pointer"
                    >
                      <Trash2 size={18} className="text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {mostrarModal && (
            <div className="fixed inset-0 bg-transparent bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
              <div className="bg-zinc-900 border border-yellow-500/50 rounded-2xl p-6 w-full max-w-lg shadow-lg text-white relative">
                <h2 className="text-xl font-semibold mb-4">Editar vehículo</h2>

                <div className="space-y-3">
                  <label className="text-sm text-yellow-500">Marca:</label>
                  <input
                    className="block w-full px-3 py-3 border border-zinc-700 rounded-lg bg-zinc-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200"
                    value={vehiculoEditando.marca}
                    onChange={(e) =>
                      setVehiculoEditando({
                        ...vehiculoEditando,
                        marca: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm text-yellow-500">Modelo</label>
                  <input
                    className="block w-full px-3 py-3 border border-zinc-700 rounded-lg bg-zinc-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200"
                    value={vehiculoEditando.modelo}
                    onChange={(e) =>
                      setVehiculoEditando({
                        ...vehiculoEditando,
                        modelo: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm text-yellow-500">Patente</label>
                  <input
                    className="block w-full px-3 py-3 border border-zinc-700 rounded-lg bg-zinc-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200"
                    value={vehiculoEditando.patente}
                    onChange={(e) =>
                      setVehiculoEditando({
                        ...vehiculoEditando,
                        patente: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm text-yellow-500">Año</label>
                  <input
                    className="block w-full px-3 py-3 border border-zinc-700 rounded-lg bg-zinc-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200"
                    value={vehiculoEditando.año}
                    onChange={(e) =>
                      setVehiculoEditando({
                        ...vehiculoEditando,
                        año: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm text-yellow-500">Color</label>
                  <input
                    className="block w-full px-3 py-3 border border-zinc-700 rounded-lg bg-zinc-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200"
                    value={vehiculoEditando.color}
                    onChange={(e) =>
                      setVehiculoEditando({
                        ...vehiculoEditando,
                        color: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm text-yellow-500">Estado</label>
                  <select
                    value={vehiculoEditando.estado}
                    onChange={(e) =>
                      setVehiculoEditando({
                        ...vehiculoEditando,
                        estado: e.target.value,
                      })
                    }
                    className="block w-full cursor-pointer px-3 py-3 border border-zinc-700 rounded-lg bg-zinc-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200"
                  >
                    <option value="activo">Activo</option>
                    <option value="revision">Revisión</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
                <div className="flex justify-center space-x-3 mt-5">
                  <button
                    className="flex cursor-pointer items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-medium py-2 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-yellow-500/20"
                    onClick={guardarCambios}
                  >
                    Guardar
                  </button>
                  <button
                    className="py-3 px-4 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-all duration-200 font-medium cursor-pointer"
                    onClick={() => setMostrarModal(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Formulario para agregar vehículo (condicional) */}
          {showAddVehicle && (
            <form
              onSubmit={handleSumbit}
              className="mt-8 backdrop-blur-md bg-zinc-900/70 rounded-2xl p-6 border border-zinc-800/50 shadow-xl animate-fadeIn"
            >
              <div className="flex justify-center items-center">
                <h2 className=" text-xl  font-bold mb-6 flex items-center gap-4">
                  <Car size={25} className="text-yellow-500" />
                  Agregar Nuevo Vehículo
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-medium text-yellow-500 mb-1 group-focus-within:text-yellow-500 transition-colors duration-200">
                    Marca
                  </label>
                  <input
                    type="text"
                    value={marca}
                    onChange={(e) => setMarca(e.target.value)}
                    className="block w-full px-3 py-3 border border-zinc-700 rounded-lg bg-zinc-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200"
                    placeholder="Ej: Toyota"
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-yellow-500 mb-1 group-focus-within:text-yellow-500 transition-colors duration-200">
                    Modelo
                  </label>
                  <input
                    type="text"
                    value={modelo}
                    onChange={(e) => setModelo(e.target.value)}
                    className="block w-full px-3 py-3 border border-zinc-700 rounded-lg bg-zinc-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200"
                    placeholder="Ej: Corolla"
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-yellow-500 mb-1 group-focus-within:text-yellow-500 transition-colors duration-200">
                    Patente
                  </label>
                  <input
                    type="text"
                    value={patente}
                    onChange={(e) => setPatente(e.target.value)}
                    className="block w-full px-3 py-3 border border-zinc-700 rounded-lg bg-zinc-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200"
                    placeholder="Ej: ABC-123"
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-yellow-500 mb-1 group-focus-within:text-yellow-500 transition-colors duration-200">
                    Año
                  </label>
                  <input
                    type="number"
                    value={año}
                    onChange={(e) => setAño(e.target.value)}
                    className="block w-full px-3 py-3 border border-zinc-700 rounded-lg bg-zinc-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200"
                    placeholder="Ej: 2020"
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-yellow-500 mb-1 group-focus-within:text-yellow-500 transition-colors duration-200">
                    Color
                  </label>
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="block w-full px-3 py-3 border border-zinc-700 rounded-lg bg-zinc-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200"
                    placeholder="Ej: Blanco"
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-medium text-yellow-500 mb-1">
                    Estado
                  </label>
                  <select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    className="block w-full px-3 py-3 border border-zinc-700 rounded-lg bg-zinc-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200"
                  >
                    <option value="activo">Activo</option>
                    <option value="revision">Revisión</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setShowAddVehicle(false)}
                  className="flex-1 py-3 px-4 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-all duration-200 font-medium cursor-pointer"
                >
                  Cancelar
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-medium py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-yellow-500/20 cursor-pointer">
                  <Check size={20} />
                  Guardar Vehículo
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </MainLayout>
  );
};
export default VehiculosDriver;
