import MainLayout from "../../../components/layout/MainLayout";
import { ThemeContext } from "../../../context/ThemeContext";
import {
  Car,
  Plus,
  Edit,
  Trash2,
  Check,
  AlertCircle,
  VenetianMaskIcon,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import Pagination from "../../../components/ui/Pagination";
import { useTranslate } from "../../../hooks/useTranslate";
import {
  createVehicles,
  getVehicles,
  updateVehicles,
  deleteVehicles,
} from "../../../services/vehicle";

const VehiculosDriver = () => {
  const { theme } = useContext(ThemeContext);
  const translate = useTranslate();

  const [showAddVehicle, setShowAddVehicle] = useState(false);

  const [mostrarModal, setMostrarModal] = useState(false);

  const [search, setSearch] = useState("");
  const [totalPagesVehiculo, setTotalPagesVehiculo] = useState(1);
  const [pageNumberVehiculo, setPageNumberVehiculo] = useState(1);
  const pageSizeVehiculo = 10;

  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [patente, setPatente] = useState("");
  const [año, setAño] = useState("");
  const [color, setColor] = useState("");
  const [estado, setEstado] = useState("Active");
  const [vehiculos, setVehiculos] = useState([]);

  const [vehiculoEditando, setVehiculoEditando] = useState({
    brand: "",
    model: "",
    licensePlate: "",
    color: "",
    year: "",
    status: "Active",
  });

  const handleSumbit = async (e) => {
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
      (v) => v.licensePlate.toLowerCase() === patente.toLowerCase()
    );
    if (patenteExiste) {
      alert("Ya existe un vehículo con esa patente.");
      return;
    }

    const estadoFinal = estado.trim() === "" ? "Active" : estado.trim();

    const nuevoVehiculo = {
      licensePlate: patente.trim(),
      model: modelo.trim(),
      brand: marca.trim(),
      color: color.trim(),
      year: año.toString().trim(),
      status: estadoFinal,
    };

    try {
      console.log("Vehículo a crear:", nuevoVehiculo);
      const vehiculoCreado = await createVehicles(nuevoVehiculo);

      console.log("Vehículo creado:", vehiculoCreado);

      // Actualizar estado local con los datos retornados, adaptando la estructura
      setVehiculos([...vehiculos, vehiculoCreado]);

      setShowAddVehicle(false);

      // Limpiar campos
      setMarca("");
      setModelo("");
      setPatente("");
      setAño("");
      setColor("");
      setEstado("");
    } catch (error) {
      console.error("Error al crear vehículo:", error);
      alert("Hubo un problema al guardar el vehículo.");
    }
  };

  useEffect(() => {
    const handleShowVehicle = async () => {
      try {
        const response = await getVehicles(
          pageNumberVehiculo,
          pageSizeVehiculo,
          search
        );
        console.log("Vehiculos obtenidos del backend:", response);

        const vehiculosMapeados = response.data.map((v) => ({
          id: v.id,
          brand: v.brand,
          model: v.model,
          licensePlate: v.licensePlate,
          color: v.color,
          year: v.year,
          status: v.status, // asegurate de que el backend devuelva esto
        }));

        console.log(vehiculosMapeados);
        setVehiculos(vehiculosMapeados);
        setTotalPagesVehiculo(response.totalPages);
      } catch (error) {
        console.log("Error al obtener vehículos:", error);
      }
    };

    handleShowVehicle();
  }, [pageNumberVehiculo, search]);

  const handlePageChangeVehiculo = (newPage) => {
    console.log("Cambiando a página:", newPage); // DEBUG
    setPageNumberVehiculo(newPage);
    console.log("Página cambiada a:", newPage);
  };

  const handleEditar = (vehiculo) => {
    console.log("Vehículo a editar:", vehiculo);
    if (!vehiculo) {
      console.warn("Vehículo no válido para editar");
      return;
    }

    setVehiculoEditando({
      id: vehiculo.id,
      brand: vehiculo.brand,
      model: vehiculo.model,
      licensePlate: vehiculo.licensePlate,
      color: vehiculo.color,
      year: vehiculo.year.toString(),
      status: vehiculo.status,
    });

    setMostrarModal(true);
  };

  const guardarCambios = async () => {
    try {
      const vehicleGuardado = {
        id: vehiculoEditando.id,
        brand: vehiculoEditando.brand,
        model: vehiculoEditando.model,
        licensePlate: vehiculoEditando.licensePlate,
        color: vehiculoEditando.color,
        year: vehiculoEditando.year,
        status: vehiculoEditando.status,
      };
      console.log("Vehiculo guardado:", vehicleGuardado);
      const response = await updateVehicles(
        vehiculoEditando.id,
        vehicleGuardado
      );
      console.log("Vehiculo editado con éxito", response);
      setVehiculos(
        vehiculos.map((v) =>
          v.id === vehiculoEditando.id ? vehicleGuardado : v
        )
      );
      console.log("Vehiculo guardado:", vehicleGuardado);
      setMostrarModal(false);
    } catch (error) {
      console.log("Error al guardar cambios", error);
    }
  };

  const handleDelite = async (id) => {
    console.log("Vehículo a eliminar:", id);
    try {
      const response = await deleteVehicles(id);
      console.log("Vehiculo eliminado con éxito", response);
      setVehiculos(vehiculos.filter((v) => v.id !== id));
    } catch (error) {
      console.log("Error al eliminar vehiculo", error);
    }
  };

  return (
    <MainLayout>
      <div
        className={`min-h-screen rounded-lg  p-6 md:p-8 ${
          theme === "dark"
            ? "bg-zinc-900 border border-zinc-800/50 text-white"
            : "bg-white border border-yellow-500 text-gray-900"
        }`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4 sm:gap-0">
            <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
              {translate("Mis vehiculos")}
            </h1>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por patente..."
              className="w-full sm:w-auto border-yellow-500 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500/20"
            />
            <button
              onClick={() => setShowAddVehicle(true)}
              className="flex cursor-pointer items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-medium py-2 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-yellow-500/20 w-[50%] sm:w-auto"
            >
              <Plus size={20} />
              {translate("Agregar Vehículo")}
            </button>
          </div>

          <div className="space-y-6">
            {vehiculos
              .filter((vehiculo) => vehiculo.status !== "Deleted")
              .map((vehiculo) => (
                <div
                  key={vehiculo.id}
                  className={`backdrop-blur-md  rounded-2xl p-6 border shadow-xl hover:shadow-yellow-500/10 transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-zinc-900 border-zinc-800/50"
                      : "bg-white border border-yellow-500"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div
                        className={`w-16 h-16  rounded-xl flex items-center justify-center ${
                          theme === "dark"
                            ? "bg-zinc-800 border border-zinc-800"
                            : "bg-white border border-yellow-500"
                        }`}
                      >
                        <Car size={32} className="text-yellow-500" />
                      </div>

                      <div>
                        <h3 className="text-xl font-bold">{vehiculo.brand}</h3>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-sm text-gray-500">
                          <p>
                            <span
                              className={`${
                                theme === "dark"
                                  ? "text-yellow-500 font-semibold "
                                  : "text-gray-900 font-semibold"
                              }`}
                            >
                              {translate("Modelo")}:{" "}
                            </span>
                            {vehiculo.model}
                          </p>
                          <p>
                            <span
                              className={`${
                                theme === "dark"
                                  ? "text-yellow-500 font-semibold "
                                  : "text-gray-900 font-semibold"
                              }`}
                            >
                              {translate("Patente")}:{" "}
                            </span>
                            {vehiculo.licensePlate}
                          </p>
                          <p>
                            <span
                              className={`${
                                theme === "dark"
                                  ? "text-yellow-500 font-semibold "
                                  : "text-gray-900 font-semibold"
                              }`}
                            >
                              {translate("Año")}:{" "}
                            </span>{" "}
                            {vehiculo.year}
                          </p>
                          <p>
                            <span
                              className={`${
                                theme === "dark"
                                  ? "text-yellow-500 font-semibold "
                                  : "text-gray-900 font-semibold"
                              }`}
                            >
                              {translate("Color")}:{" "}
                            </span>{" "}
                            {vehiculo.color}
                          </p>
                        </div>
                        <div className="mt-3 flex items-center">
                          {vehiculo.status === "Active" && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-600/30 text-green-500 border border-green-500">
                              <Check size={12} className="mr-1" />
                              Activo
                            </span>
                          )}
                          {vehiculo.status === "Revision" && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-600/30 text-yellow-500 border border-yellow-500">
                              <AlertCircle size={12} className="mr-1" />
                              Revisión
                            </span>
                          )}
                          {vehiculo.status === "Inactive" && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-600/30 text-red-500 border border-red-500">
                              <AlertCircle size={12} className="mr-1" />
                              Inactivo
                            </span>
                          )}
                          {vehiculo.status === "Deleted" && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-300 shadow-sm">
                              <AlertCircle size={14} className="text-red-700" />
                              Eliminado
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditar(vehiculo)}
                        className={`p-2 ${
                          theme === "dark"
                            ? "bg-zinc-800 hover:bg-zinc-700"
                            : "bg-white border border-yellow-500 hover:bg-zinc-700"
                        } rounded-lg transition-all duration-200 cursor-pointer`}
                      >
                        <Edit size={18} className="text-yellow-500" />
                      </button>
                      <button
                        onClick={() => handleDelite(vehiculo.id)}
                        className={`p-2 ${
                          theme === "dark"
                            ? "bg-zinc-800 hover:bg-red-900/50"
                            : "bg-white border border-red-500 hover:bg-zinc-700"
                        } rounded-lg transition-all duration-200 cursor-pointer`}
                      >
                        <Trash2 size={18} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          {/* Formulario para editar vehículo (condicional) */}
          {mostrarModal && (
            <div className="fixed inset-0 bg-transparent bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  guardarCambios();
                }}
                className={`rounded-2xl p-6 w-full max-w-lg shadow-lg  relative ${
                  theme === "dark"
                    ? "bg-zinc-900 border border-zinc-800/50 text-white"
                    : "bg-white border border-yellow-500 text-gray-900"
                }`}
              >
                <h2 className="text-xl text-center font-semibold mb-4">
                  {translate("Editar vehículo")}
                </h2>

                <div className="space-y-3">
                  <label
                    className={`${
                      theme === "dark" ? "text-yellow-500" : "text-gray-900"
                    } font-semibold text-sm`}
                  >
                    {translate("Marca")}:
                  </label>
                  <input
                    className={`block w-full px-3 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200 ${
                      theme === "dark"
                        ? "border border-zinc-700 rounded-lg bg-zinc-800/50 text-white placeholder-gray-500 "
                        : "bg-white border border-yellow-500 "
                    }`}
                    value={vehiculoEditando.brand}
                    onChange={(e) =>
                      setVehiculoEditando({
                        ...vehiculoEditando,
                        brand: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-3">
                  <label
                    className={`${
                      theme === "dark" ? "text-yellow-500" : "text-gray-900"
                    } font-semibold text-sm`}
                  >
                    {translate("Modelo")}
                  </label>
                  <input
                    className={`block w-full px-3 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200 ${
                      theme === "dark"
                        ? "border border-zinc-700 rounded-lg bg-zinc-800/50 text-white placeholder-gray-500 "
                        : "bg-white border border-yellow-500 "
                    }`}
                    value={vehiculoEditando.model}
                    onChange={(e) =>
                      setVehiculoEditando({
                        ...vehiculoEditando,
                        model: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-3">
                  <label
                    className={`${
                      theme === "dark" ? "text-yellow-500" : "text-gray-900"
                    } font-semibold text-sm`}
                  >
                    {translate("Patente")}
                  </label>
                  <input
                    className={`block w-full px-3 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200 ${
                      theme === "dark"
                        ? "border border-zinc-700 rounded-lg bg-zinc-800/50 text-white placeholder-gray-500 "
                        : "bg-white border border-yellow-500 "
                    }`}
                    value={vehiculoEditando.licensePlate}
                    onChange={(e) =>
                      setVehiculoEditando({
                        ...vehiculoEditando,
                        licensePlate: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-3">
                  <label
                    className={`${
                      theme === "dark" ? "text-yellow-500" : "text-gray-900"
                    } font-semibold text-sm`}
                  >
                    {translate("Año")}
                  </label>
                  <input
                    className={`block w-full px-3 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200 ${
                      theme === "dark"
                        ? "border border-zinc-700 rounded-lg bg-zinc-800/50 text-white placeholder-gray-500 "
                        : "bg-white border border-yellow-500 "
                    }`}
                    value={vehiculoEditando.year}
                    onChange={(e) =>
                      setVehiculoEditando({
                        ...vehiculoEditando,
                        year: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-3">
                  <label
                    className={`${
                      theme === "dark" ? "text-yellow-500" : "text-gray-900"
                    } font-semibold text-sm`}
                  >
                    {translate("Color")}
                  </label>
                  <input
                    className={`block w-full px-3 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200 ${
                      theme === "dark"
                        ? "border border-zinc-700 rounded-lg bg-zinc-800/50 text-white placeholder-gray-500 "
                        : "bg-white border border-yellow-500 "
                    }`}
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
                  <label
                    className={`${
                      theme === "dark" ? "text-yellow-500" : "text-gray-900"
                    } font-semibold text-sm`}
                  >
                    {translate("Estado")}
                  </label>
                  <select
                    value={vehiculoEditando.status}
                    onChange={(e) =>
                      setVehiculoEditando({
                        ...vehiculoEditando,
                        status: e.target.value,
                      })
                    }
                    className={`block w-full cursor-pointer px-3 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200 ${
                      theme === "dark"
                        ? "border border-zinc-700 rounded-lg bg-zinc-800/50 text-white placeholder-gray-500 "
                        : "bg-white border border-yellow-500 "
                    }`}
                  >
                    <option value="Active">{translate("Activo")}</option>
                    <option value="Revision">{translate("Revisión")}</option>
                    <option value="Inactive">{translate("Inactivo")}</option>
                  </select>
                </div>
                <div className="flex justify-center space-x-3 mt-5">
                  <button
                    className="flex cursor-pointer items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-yellow-500/20"
                    type="submit"
                  >
                    {translate("Guardar")}
                  </button>
                  <button
                    className="py-3 px-4 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-all text-white duration-200 font-medium cursor-pointer"
                    onClick={() => setMostrarModal(false)}
                  >
                    {translate("Cancelar")}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Formulario para agregar vehículo (condicional) */}
          {showAddVehicle && (
            <form
              onSubmit={handleSumbit}
              className={`mt-8 backdrop-blur-md rounded-2xl p-6 shadow-xl animate-fadeIn ${
                theme === "dark"
                  ? "bg-zinc-900/70   border border-zinc-800/50 "
                  : "bg-white border border-yellow-500"
              }`}
            >
              <div className="flex justify-center items-center">
                <h2 className=" text-xl  font-bold mb-6 flex items-center gap-4">
                  {translate("Agregar Nuevo Vehículo")}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label
                    className={`block text-sm font-semibold  mb-1  transition-colors duration-200 ${
                      theme === "dark" ? "text-yellow-500" : "text-gray-900"
                    }`}
                  >
                    {translate("Marca")}
                  </label>
                  <input
                    type="text"
                    value={marca}
                    onChange={(e) => setMarca(e.target.value)}
                    className={`block w-full px-3 py-3 focus:outline-none rounded-lg focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200 ${
                      theme === "dark"
                        ? " border border-zinc-700 rounded-lg bg-zinc-800/50 text-white placeholder-gray-500 "
                        : "border border-yellow-500 "
                    }`}
                    placeholder="Ej: Toyota"
                  />
                </div>

                <div className="group">
                  <label
                    className={`block text-sm font-semibold  mb-1 transition-colors duration-200 ${
                      theme === "dark" ? "text-yellow-500" : "text-gray-900"
                    }`}
                  >
                    {translate("Modelo")}
                  </label>
                  <input
                    type="text"
                    value={modelo}
                    onChange={(e) => setModelo(e.target.value)}
                    className={`block w-full px-3 py-3 focus:outline-none rounded-lg focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200 ${
                      theme === "dark"
                        ? " border border-zinc-700 rounded-lg bg-zinc-800/50 text-white placeholder-gray-500 "
                        : "border border-yellow-500 "
                    }`}
                    placeholder="Ej: Corolla"
                  />
                </div>

                <div className="group">
                  <label
                    className={`block text-sm font-semibold  mb-1 transition-colors duration-200 ${
                      theme === "dark" ? "text-yellow-500" : "text-gray-900"
                    }`}
                  >
                    {translate("Patente")}
                  </label>
                  <input
                    type="text"
                    value={patente}
                    onChange={(e) => setPatente(e.target.value)}
                    className={`block w-full px-3 py-3 focus:outline-none rounded-lg focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200 ${
                      theme === "dark"
                        ? " border border-zinc-700 rounded-lg bg-zinc-800/50 text-white placeholder-gray-500 "
                        : "border border-yellow-500 "
                    }`}
                    placeholder="Ej: ABC-123"
                  />
                </div>

                <div className="group">
                  <label
                    className={`block text-sm font-semibold  mb-1 transition-colors duration-200 ${
                      theme === "dark" ? "text-yellow-500" : "text-gray-900"
                    }`}
                  >
                    {translate("Año")}
                  </label>
                  <input
                    type="number"
                    value={año}
                    onChange={(e) => setAño(e.target.value)}
                    className={`block w-full px-3 py-3 focus:outline-none rounded-lg focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200 ${
                      theme === "dark"
                        ? " border border-zinc-700 rounded-lg bg-zinc-800/50 text-white placeholder-gray-500 "
                        : "border border-yellow-500 "
                    }`}
                    placeholder="Ej: 2020"
                  />
                </div>

                <div className="group">
                  <label
                    className={`block text-sm font-semibold  mb-1 transition-colors duration-200 ${
                      theme === "dark" ? "text-yellow-500" : "text-gray-900"
                    }`}
                  >
                    {translate("Color")}
                  </label>
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className={`block w-full px-3 py-3 focus:outline-none rounded-lg focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200 ${
                      theme === "dark"
                        ? " border border-zinc-700 rounded-lg bg-zinc-800/50 text-white placeholder-gray-500 "
                        : "border border-yellow-500 "
                    }`}
                    placeholder="Ej: Blanco"
                  />
                </div>
                <div className="group">
                  <label
                    className={`block text-sm font-semibold  mb-1 transition-colors duration-200 ${
                      theme === "dark" ? "text-yellow-500" : "text-gray-900"
                    }`}
                  >
                    {translate("Estado")}
                  </label>
                  <select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    className={`block w-full px-3 py-3 focus:outline-none rounded-lg focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200 ${
                      theme === "dark"
                        ? " border border-zinc-700 rounded-lg bg-zinc-800/50 text-white placeholder-gray-500 "
                        : "border border-yellow-500 "
                    }`}
                  >
                    <option value="Active">{translate("Activo")}</option>
                    <option value="Revision">{translate("Revisión")}</option>
                    <option value="Inactivo">{translate("Inactivo")}</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setShowAddVehicle(false)}
                  className="flex-1 py-3 px-4 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-all text-white duration-200 font-medium cursor-pointer"
                >
                  {translate("Cancelar")}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-yellow-500/20 cursor-pointer"
                >
                  {translate("Agregar")}
                </button>
              </div>
            </form>
          )}

          {/* Paginación mejorada */}
          <Pagination
            currentPage={pageNumberVehiculo}
            totalPages={totalPagesVehiculo}
            onPageChange={handlePageChangeVehiculo}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default VehiculosDriver;
