import MainLayout from "../../../components/layout/MainLayout";
import { dataAdmin } from "../../../data/data";
import { Pencil, Trash2, Plus, Search } from "lucide-react";
import { useState, useEffect } from "react";

const HomeSuperAdmin = () => {
  const [activeTab, setActiveTab] = useState("usuarios");
  const [search, setSearch] = useState("");
  const [deleteConductores, setDeleteConductores] = useState(
    dataAdmin.conductores
  );
  const [deletePasajeros, setDeletePasajeros] = useState(dataAdmin.pasajeros);
  const [deleteVehiculos, setDeleteVehiculos] = useState(dataAdmin.vehiculos);
  const [deleteViajes, setDeleteViajes] = useState(dataAdmin.viajes);

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const totalUsuarios = deleteConductores.length + deletePasajeros.length;
  const totalPages = Math.ceil(totalUsuarios / usersPerPage);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  useEffect(() => {
    setSearch("");
  }, [activeTab]);

  let displayedData = [];
  let headers = [];

  if (activeTab === "usuarios") {
    displayedData = [...deleteConductores, ...deletePasajeros];
    headers = [
      "id",
      "Nombre",
      "Email",
      "Rol",
      "DNI",
      "Estado",
      "Fecha registro",
    ];
  } else if (activeTab === "conductores") {
    displayedData = deleteConductores.filter((u) => u.rol === "Conductor");
    headers = ["id", "Nombre", "DNI", "Email", "Estado", "Acciones"];
  } else if (activeTab === "pasajeros") {
    displayedData = deletePasajeros.filter((u) => u.rol === "Pasajero");
    headers = [
      "id",
      "Nombre",
      "DNI",
      "Email",
      "Dirección",
      "Estado",
      "Acciones",
    ];
  } else if (activeTab === "vehiculos") {
    displayedData = deleteVehiculos; // Usar data real de vehículos
    headers = [
      "id",
      "Patente",
      "Marca",
      "Modelo",
      "Año",
      "Color",
      "Conductor",
      "Estado",
      "Acciones",
    ];
  } else if (activeTab === "viajes") {
    displayedData = deleteViajes; // Usar data real de viajes
    headers = [
      "id",
      "Fecha",
      "Origen",
      "Destino",
      "Pasajero",
      "Conductor",
      "Estado",
      "Importe",
      "Acciones",
    ];
  }
  const filteredData = displayedData.filter((item) => {
    const searchTerm = search.toLowerCase();

    if (
      activeTab === "usuarios" ||
      activeTab === "conductores" ||
      activeTab === "pasajeros"
    ) {
      return (
        item.dni?.toLowerCase().includes(searchTerm) ||
        item.nombre?.toLowerCase().includes(searchTerm)
      );
    } else if (activeTab === "vehiculos") {
      return (
        item.patente?.toLowerCase().includes(searchTerm) ||
        item.marca?.toLowerCase().includes(searchTerm)
      );
    } else if (activeTab === "viajes") {
      return (
        item.fecha?.toLowerCase().includes(searchTerm) ||
        item.origen?.toLowerCase().includes(searchTerm)
      );
    }

    return false;
  });

  const currentData = filteredData.slice(indexOfFirstUser, indexOfLastUser);
  const handleDeleteConductores = (id) => {
    const updatedConductores = deleteConductores.filter((u) => u.id !== id);
    setDeleteConductores(updatedConductores);
    console.log(`Conductor con ID ${id} eliminado exitosamente`);
  };

  const handleDeletePasajeros = (id) => {
    const updatedPasajeros = deletePasajeros.filter((u) => u.id !== id);
    setDeletePasajeros(updatedPasajeros);
    console.log(`Pasajero con ID ${id} eliminado exitosamente`);
  };

  const handleDeleteVehiculos = (id) => {
    const updatedVehiculos = deleteVehiculos.filter((u) => u.id !== id);
    setDeleteVehiculos(updatedVehiculos);
    console.log(`Vehículo con ID ${id} eliminado exitosamente`);
  };

  const handleDeleteViajes = (id) => {
    const updatedViajes = deleteViajes.filter((u) => u.id !== id);
    setDeleteViajes(updatedViajes);
    console.log(`Viaje con ID ${id} eliminado exitosamente`);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-zinc-900  p-6 text-white">
        <div className="flex flex-col items-center mb-8 text-center border border-zinc-700 p-8 rounded-md">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
              Gestión de la Plataforma
            </h1>
          </div>
          {/* Tabs */}
          <div className="flex justify-center space-x-4 mb-6">
            <button
              className={`px-6 py-2 rounded-md font-semibold cursor-pointer ${
                activeTab === "usuarios"
                  ? "bg-yellow-500 text-black"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
              onClick={() => setActiveTab("usuarios")}
            >
              Usuarios
            </button>
            <button
              className={`px-6 py-2 rounded-md font-semibold cursor-pointer ${
                activeTab === "conductores"
                  ? "bg-yellow-500 text-black"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
              onClick={() => setActiveTab("conductores")}
            >
              Conductores
            </button>
            <button
              className={`px-6 py-2 rounded-md font-semibold cursor-pointer ${
                activeTab === "pasajeros"
                  ? "bg-yellow-500 text-black"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
              onClick={() => setActiveTab("pasajeros")}
            >
              Pasajeros
            </button>
            <button
              className={`px-6 py-2 rounded-md font-semibold cursor-pointer ${
                activeTab === "vehiculos"
                  ? "bg-yellow-500 text-black"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
              onClick={() => setActiveTab("vehiculos")}
            >
              Vehículos
            </button>
            <button
              className={`px-6 py-2 rounded-md font-semibold cursor-pointer ${
                activeTab === "viajes"
                  ? "bg-yellow-500 text-black"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
              onClick={() => setActiveTab("viajes")}
            >
              Viajes
            </button>
          </div>
        </div>
        {/* Panel */}

        <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            {/* Input con ícono de búsqueda */}
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-zinc-500" />
              </div>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="search"
                className="w-full p-2.5 pl-10 bg-zinc-700/50 border border-zinc-600 rounded-lg placeholder-zinc-400 text-white focus:ring-yellow-500 focus:border-yellow-500"
                placeholder={
                  activeTab === "vehiculos"
                    ? "Buscar vehiculo por patente o marca..."
                    : activeTab === "viajes"
                    ? "Buscar viaje por fecha u origen..."
                    : "Buscar usuario por N°documento o nombre..."
                }
              />
            </div>

            {/* Botón a la derecha */}

            <button className="ml-4 flex items-center bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-2 px-4 rounded-md transition cursor-pointer">
              <Plus className="mr-2 w-4 h-4" />
              Agregar
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-white">
              <thead>
                <tr>
                  {headers.map((header, id) => (
                    <th
                      key={id}
                      className="px-6 py-3 text-yellow-500 uppercase"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-[#121212] divide-y divide-zinc-800">
                {currentData.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-800 transition">
                    {activeTab === "usuarios" && (
                      <>
                        <td className="px-6 py-4">{item.id}</td>
                        <td className="px-6 py-4">{item.nombre}</td>
                        <td className="px-6 py-4">{item.email}</td>
                        <td className="px-6 py-4">{item.rol}</td>
                        <td className="px-6 py-4">{item.dni}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              item.estado === "Activo"
                                ? "bg-green-600"
                                : "bg-red-600"
                            }`}
                          >
                            {item.estado}
                          </span>
                        </td>
                        <td className="px-6 py-4">{item.fecha}</td>
                      </>
                    )}

                    {activeTab === "conductores" && (
                      <>
                        <td className="px-6 py-4">{item.id}</td>
                        <td className="px-6 py-4">{item.nombre}</td>
                        <td className="px-6 py-4">{item.dni}</td>
                        <td className="px-6 py-4">{item.email}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              item.estado === "Activo"
                                ? "bg-green-600"
                                : "bg-red-600"
                            }`}
                          >
                            {item.estado}
                          </span>
                        </td>
                        <td className="px-6 py-4 flex items-center gap-2">
                          <button className="p-2 bg-yellow-500 rounded-md">
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteConductores(item.id)}
                            className="p-2 bg-red-600 rounded-md"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </>
                    )}

                    {activeTab === "pasajeros" && (
                      <>
                        <td className="px-6 py-4">{item.id}</td>
                        <td className="px-6 py-4">{item.nombre}</td>
                        <td className="px-6 py-4">{item.dni}</td>
                        <td className="px-6 py-4">{item.email}</td>
                        <td className="px-6 py-4">{item.direccion}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              item.estado === "Activo"
                                ? "bg-green-600"
                                : "bg-red-600"
                            }`}
                          >
                            {item.estado}
                          </span>
                        </td>
                        <td className="px-6 py-4 flex items-center gap-2">
                          <button className="p-2 bg-yellow-500 rounded-md">
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDeletePasajeros(item.id)}
                            className="p-2 bg-red-600 rounded-md"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </>
                    )}
                    {activeTab === "vehiculos" && (
                      <>
                        <td className="px-6 py-4">{item.id}</td>
                        <td className="px-6 py-4">{item?.patente ?? "N/A"}</td>
                        <td className="px-6 py-4">{item?.marca ?? "N/A"}</td>
                        <td className="px-6 py-4">{item?.modelo ?? "N/A"}</td>
                        <td className="px-6 py-4">{item?.anio ?? "N/A"}</td>
                        <td className="px-6 py-4">{item?.color ?? "N/A"}</td>
                        <td className="px-6 py-4">
                          {item?.conductor ?? "N/A"}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              item?.estado === "Activo"
                                ? "bg-green-600"
                                : "bg-red-600"
                            }`}
                          >
                            {item?.estado ?? "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4 flex items-center gap-2">
                          <button className="p-2 bg-yellow-500 rounded-md">
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteVehiculos(item.id)}
                            className="p-2 bg-red-600 rounded-md"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </>
                    )}

                    {activeTab === "viajes" && (
                      <>
                        <td className="px-6 py-4">{item.id}</td>
                        <td className="px-6 py-4">{item.fecha}</td>
                        <td className="px-6 py-4">{item.origen}</td>
                        <td className="px-6 py-4">{item.destino}</td>
                        <td className="px-6 py-4">{item.pasajero}</td>
                        <td className="px-6 py-4">{item.conductor}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              item.estado === "Completado"
                                ? "bg-green-600"
                                : item.estado === "En curso"
                                ? "bg-yellow-500"
                                : "bg-red-600"
                            }`}
                          >
                            {item.estado}
                          </span>
                        </td>
                        <td className="px-6 py-4">{item.importe}</td>
                        <td className="px-6 py-4 flex items-center gap-2">
                          <button className="p-2 bg-yellow-500 rounded-md">
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteViajes(item.id)}
                            className="p-2 bg-red-600 rounded-md"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Pagination */}
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded disabled:opacity-30 cursor-pointer"
          >
            «
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 rounded cursor-pointer ${
                currentPage === i + 1
                  ? "bg-yellow-500 text-black font-semibold"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded disabled:opacity-30 cursor-pointer"
          >
            »
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default HomeSuperAdmin;
