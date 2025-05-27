import MainLayout from "../../../components/layout/MainLayout";
import { ThemeContext } from "../../../context/ThemeContext";
import { Car, Plus, Edit, Trash2, Check, AlertCircle } from "lucide-react";
import { useContext, useState } from "react";
const VehiculosDriver = () => {
  const { theme } = useContext(ThemeContext);
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
      <div className={`min-h-screen rounded-lg  p-6 md:p-8 ${theme === 'dark' ? 'bg-zinc-900 border border-zinc-800/50 text-white' : 'bg-white border border-yellow-500 text-gray-900'}`}>
        <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4 sm:gap-0">
              <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
                Mis Vehículos
              </h1>
              <button
                onClick={() => setShowAddVehicle(true)}
                className="flex cursor-pointer items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-medium py-2 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-yellow-500/20 w-[50%] sm:w-auto"
              >
                <Plus size={20} />
                Agregar Vehículo
              </button>
            </div>

          <div className="space-y-6">
            {vehiculos.map((vehiculo, index) => (
              <div
                key={index}
                className={`backdrop-blur-md  rounded-2xl p-6 border shadow-xl hover:shadow-yellow-500/10 transition-all duration-300 ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800/50' : 'bg-white border border-yellow-500'}`}

              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className={`w-16 h-16  rounded-xl flex items-center justify-center ${theme === 'dark' ? 'bg-zinc-800 border border-zinc-800' : 'bg-white border border-yellow-500'}`}>
                      <Car size={32} className="text-yellow-500" />
                    </div>

                    <div>
                      <h3 className="text-xl font-bold">{vehiculo.marca}</h3>
                      <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-sm text-gray-500">
                        <p>
                          <span className={`${theme === 'dark' ? 'text-yellow-500 font-semibold ' : 'text-gray-900 font-semibold'}`}>Modelo: </span>
                          {vehiculo.modelo}
                        </p>
                        <p>
                          <span className={`${theme === 'dark' ? 'text-yellow-500 font-semibold ' : 'text-gray-900 font-semibold'}`}>Patente: </span>
                          {vehiculo.patente}
                        </p>
                        <p>
                          <span className={`${theme === 'dark' ? 'text-yellow-500 font-semibold ' : 'text-gray-900 font-semibold'}`}>Año: </span>{" "}
                          {vehiculo.año}
                        </p>
                        <p>
                          <span className={`${theme === 'dark' ? 'text-yellow-500 font-semibold ' : 'text-gray-900 font-semibold'}`}>Color: </span>{" "}
                          {vehiculo.color}
                        </p>
                      </div>
                      <div className="mt-3 flex items-center">
                        {vehiculo.estado === "activo" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-600/30 text-green-500 border border-green-500">
                            <Check size={12} className="mr-1" />
                            Activo
                          </span>
                        )}
                        {vehiculo.estado === "revision" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-600/30 text-yellow-500 border border-yellow-500">
                            <AlertCircle size={12} className="mr-1" />
                            Revisión
                          </span>
                        )}
                        {vehiculo.estado === "inactivo" && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-600/30 text-red-500 border border-red-500">
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
                      className={`p-2 ${theme === 'dark' ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-white border border-yellow-500 hover:bg-zinc-700'} rounded-lg transition-all duration-200 cursor-pointer`}
                    >
                      <Edit size={18} className="text-yellow-500" />
                    </button>
                    <button
                      onClick={() => handleDelite(vehiculo.patente)}
                      className={`p-2 ${theme === 'dark' ? 'bg-zinc-800 hover:bg-red-900/50' : 'bg-white border border-red-500 hover:bg-zinc-700'} rounded-lg transition-all duration-200 cursor-pointer`}
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
              <div className={`rounded-2xl p-6 w-full max-w-lg shadow-lg  relative ${theme === 'dark' ? 'bg-zinc-900 border border-zinc-800/50 text-white' : 'bg-white border border-yellow-500 text-gray-900'}`}>
                <h2 className="text-xl text-center font-semibold mb-4">Editar vehículo</h2>

                <div className="space-y-3">
                  <label className={`${theme === 'dark' ? 'text-yellow-500' : 'text-gray-900'} font-semibold text-sm`}>Marca:</label>
                  <input
                    className={`block w-full px-3 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200 ${theme === 'dark' ? 'border border-zinc-700 rounded-lg bg-zinc-800/50 text-white placeholder-gray-500 ' : 'bg-white border border-yellow-500 '}`}
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
                  <label className={`${theme === 'dark' ? 'text-yellow-500' : 'text-gray-900'} font-semibold text-sm`}>Modelo</label>
                  <input
                    className={`block w-full px-3 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200 ${theme === 'dark' ? 'border border-zinc-700 rounded-lg bg-zinc-800/50 text-white placeholder-gray-500 ' : 'bg-white border border-yellow-500 '}`}
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
                  <label className={`${theme === 'dark' ? 'text-yellow-500' : 'text-gray-900'} font-semibold text-sm`}>Patente</label>
                  <input
                    className={`block w-full px-3 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200 ${theme === 'dark' ? 'border border-zinc-700 rounded-lg bg-zinc-800/50 text-white placeholder-gray-500 ' : 'bg-white border border-yellow-500 '}`}
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
                  <label className={`${theme === 'dark' ? 'text-yellow-500' : 'text-gray-900'} font-semibold text-sm`}>Año</label>
                  <input
                    className={`block w-full px-3 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200 ${theme === 'dark' ? 'border border-zinc-700 rounded-lg bg-zinc-800/50 text-white placeholder-gray-500 ' : 'bg-white border border-yellow-500 '}`}
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
                  <label className={`${theme === 'dark' ? 'text-yellow-500' : 'text-gray-900'} font-semibold text-sm`}>Color</label>
                  <input
                    className={`block w-full px-3 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200 ${theme === 'dark' ? 'border border-zinc-700 rounded-lg bg-zinc-800/50 text-white placeholder-gray-500 ' : 'bg-white border border-yellow-500 '}`}
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
                  <label className={`${theme === 'dark' ? 'text-yellow-500' : 'text-gray-900'} font-semibold text-sm`}>Estado</label>
                  <select
                    value={vehiculoEditando.estado}
                    onChange={(e) =>
                      setVehiculoEditando({
                        ...vehiculoEditando,
                        estado: e.target.value,
                      })
                    }
                    className={`block w-full cursor-pointer px-3 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200 ${theme === 'dark' ? 'border border-zinc-700 rounded-lg bg-zinc-800/50 text-white placeholder-gray-500 ' : 'bg-white border border-yellow-500 '}`}
                  >
                    <option value="activo">Activo</option>
                    <option value="revision">Revisión</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
                <div className="flex justify-center space-x-3 mt-5">
                  <button
                    className="flex cursor-pointer items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-yellow-500/20"
                    onClick={guardarCambios}
                  >
                    Guardar
                  </button>
                  <button
                    className="py-3 px-4 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-all text-white duration-200 font-medium cursor-pointer"
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
              className=  {`mt-8 backdrop-blur-md rounded-2xl p-6 shadow-xl animate-fadeIn ${theme === 'dark' ? 'bg-zinc-900/70   border border-zinc-800/50 ' : 'bg-white border border-yellow-500'}`}
            >
              <div className="flex justify-center items-center">
                <h2 className=" text-xl  font-bold mb-6 flex items-center gap-4">
                  Agregar Nuevo Vehículo
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className={`block text-sm font-semibold  mb-1  transition-colors duration-200 ${theme === 'dark' ? 'text-yellow-500' : 'text-gray-900'}`}>
                    Marca
                  </label>
                  <input
                    type="text"
                    value={marca}
                    onChange={(e) => setMarca(e.target.value)}
                    className={`block w-full px-3 py-3 focus:outline-none rounded-lg focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200 ${theme === 'dark' ? ' border border-zinc-700 rounded-lg bg-zinc-800/50 text-white placeholder-gray-500 ' : 'border border-yellow-500 '}`}
                    placeholder="Ej: Toyota"
                  />
                </div>

                <div className="group">
                  <label className={`block text-sm font-semibold  mb-1 transition-colors duration-200 ${theme === 'dark' ? 'text-yellow-500' : 'text-gray-900'}`}>
                    Modelo
                  </label>
                  <input
                    type="text"
                    value={modelo}
                    onChange={(e) => setModelo(e.target.value)}
                    className={`block w-full px-3 py-3 focus:outline-none rounded-lg focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200 ${theme === 'dark' ? ' border border-zinc-700 rounded-lg bg-zinc-800/50 text-white placeholder-gray-500 ' : 'border border-yellow-500 '}`}
                    placeholder="Ej: Corolla"
                  />
                </div>

                <div className="group">
                  <label className={`block text-sm font-semibold  mb-1 transition-colors duration-200 ${theme === 'dark' ? 'text-yellow-500' : 'text-gray-900'}`}>
                    Patente
                  </label>
                  <input
                    type="text"
                    value={patente}
                    onChange={(e) => setPatente(e.target.value)}
                    className={`block w-full px-3 py-3 focus:outline-none rounded-lg focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200 ${theme === 'dark' ? ' border border-zinc-700 rounded-lg bg-zinc-800/50 text-white placeholder-gray-500 ' : 'border border-yellow-500 '}`}
                    placeholder="Ej: ABC-123"
                  />
                </div>

                <div className="group">
                  <label className={`block text-sm font-semibold  mb-1 transition-colors duration-200 ${theme === 'dark' ? 'text-yellow-500' : 'text-gray-900'}`}>
                    Año
                  </label>
                  <input
                    type="number"
                    value={año}
                    onChange={(e) => setAño(e.target.value)}
                    className={`block w-full px-3 py-3 focus:outline-none rounded-lg focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200 ${theme === 'dark' ? ' border border-zinc-700 rounded-lg bg-zinc-800/50 text-white placeholder-gray-500 ' : 'border border-yellow-500 '}`}
                    placeholder="Ej: 2020"
                  />
                </div>

                <div className="group">
                  <label className={`block text-sm font-semibold  mb-1 transition-colors duration-200 ${theme === 'dark' ? 'text-yellow-500' : 'text-gray-900'}`}>
                    Color
                  </label>
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className=  {`block w-full px-3 py-3 focus:outline-none rounded-lg focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200 ${theme === 'dark' ? ' border border-zinc-700 rounded-lg bg-zinc-800/50 text-white placeholder-gray-500 ' : 'border border-yellow-500 '}`}
                    placeholder="Ej: Blanco"
                  />
                </div>
                <div className="group">
                  <label className={`block text-sm font-semibold  mb-1 transition-colors duration-200 ${theme === 'dark' ? 'text-yellow-500' : 'text-gray-900'}`}>
                    Estado
                  </label>
                  <select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    className={`block w-full px-3 py-3 focus:outline-none rounded-lg focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200 ${theme === 'dark' ? ' border border-zinc-700 rounded-lg bg-zinc-800/50 text-white placeholder-gray-500 ' : 'border border-yellow-500 '}`}
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
                  className="flex-1 py-3 px-4 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-all text-white duration-200 font-medium cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-yellow-500/20 cursor-pointer"
                >
                  Agregar
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
