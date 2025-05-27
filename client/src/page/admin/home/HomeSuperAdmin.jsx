import MainLayout from "../../../components/layout/MainLayout";
import Modal from "../../../components/ui/Modal";
import FormProfile from "../../../components/common/FormProfile";
import {ThemeContext} from "../../../context/ThemeContext";
import {
  generarResumenViaje,
  imprimirResumen,
} from "../../../components/ui/printUtils";
import { dataAdmin } from "../../../data/data";
import { Pencil, Plus, Search, FileText } from "lucide-react";
import { useState, useEffect, useContext } from "react";
import Form from "../../../components/common/Form";

const HomeSuperAdmin = () => {
  const [activeTab, setActiveTab] = useState("usuarios");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showModalConductor, setShowModalConductor] = useState(false);
  const [showModalVehiculo, setShowModalVehiculo] = useState(false);
  const [conductores, setConductores] = useState(dataAdmin.conductores);
  const [vehiculos, setVehiculos] = useState(dataAdmin.vehiculos);
  const {theme} = useContext(ThemeContext);

  const usersPerPage = 10;

  useEffect(() => {
    setSearch("");
    setCurrentPage(1);
  }, [activeTab]);

  let displayedData = [];
  let headers = [];

  if (activeTab === "usuarios") {
    displayedData = [...conductores, ...dataAdmin.pasajeros];

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
    displayedData = conductores.filter((u) => u.rol === "Conductor");
    headers = ["id", "Nombre", "DNI", "Email", "Estado", "Acciones"];
  } else if (activeTab === "pasajeros") {
    displayedData = dataAdmin.pasajeros.filter((u) => u.rol === "Pasajero");
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
    displayedData = vehiculos;
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
    displayedData = dataAdmin.viajes;
    headers = [
      "id",
      "Fecha",
      "Origen",
      "Destino",
      "Pasajero",
      "Conductor",
      "Estado",
      "Importe",
      "Resumen",
    ];
  }

  const filteredData = displayedData.filter((item) => {
    const searchTerm = search.toLowerCase();
    if (["usuarios", "conductores", "pasajeros"].includes(activeTab)) {
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

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const totalPages = Math.ceil(filteredData.length / usersPerPage);
  const currentData = filteredData.slice(indexOfFirstUser, indexOfLastUser);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleClick = () => {
    setShowModal(true);
  };

  const handleClickConductor = () => {
    setShowModalConductor(true);
  };

  const handleClickVehiculo = () => {
    setShowModalVehiculo(true);
  };
  const conductorFields = [
    {
      name: "name",
      label: "Nombre",
      type: "text",
      placeholder: "Ingrese su nombre",
      required: true,
      autoComplete: "name",
      autoFocus: true,
    },
    {
      name: "dni",
      label: "DNI",
      type: "text",
      placeholder: "Ingrese su DNI",
      required: true,
      autoComplete: "dni",
    },
    {
      name: "email",
      label: "Correo electrónico",
      type: "email",
      placeholder: "Correo electrónico",
      required: true,
      autoComplete: "email",
    },
    {
      name: "password",
      label: "Contraseña",
      type: "password",
      placeholder: "Contraseña",
      required: true,
      autoComplete: "current-password",
    },
    {
      name: "genre",
      label: "Género",
      type: "select",
      required: true,
      options: [
        { label: "Selecciona tu género", value: "" },
        { label: "Masculino", value: "Male" },
        { label: "Femenino", value: "Female" },
        { label: "Otro", value: "Other" },
      ],
    },
  ];
  const vehiculoFields = [
    {
      name: "marca",
      label: "Marca",
      type: "text",
      placeholder: "Ingrese la marca",
      required: true,
      autoComplete: "off",
    },
    {
      name: "modelo",
      label: "Modelo",
      type: "text",
      placeholder: "Ingrese el modelo",
      required: true,
      autoComplete: "off",
    },
    {
      name: "patente",
      label: "Patente",
      type: "text",
      placeholder: "Ingrese la patente",
      required: true,
      autoComplete: "off",
    },
    {
      name: "color",
      label: "Color",
      type: "text",
      placeholder: "Ingrese el color",
      required: true,
      autoComplete: "off",
    },
    {
      name: "anio",
      label: "Año",
      type: "number",
      placeholder: "Ingrese el año",
      required: true,
      autoComplete: "off",
    },
    {
      name: "conductor",
      label: "Conductor",
      type: "text",
      placeholder: "Ingrese el conductor",
      required: true,
      autoComplete: "off",
    },
  ];

  const handleSubmitConductor = (data, resetForm) => {
    const newConductor = {
      ...data,
      nombre: data.name,
      id: conductores.length + 1, // or better: use uuid
      rol: "Conductor",
      estado: "Activo",
      fecha: new Date().toLocaleDateString("es-AR"), // format example: "21/5/2025"
    };

    setConductores((prev) => [...prev, newConductor]);

    resetForm(); // Clear the form
    setShowModalConductor(false); // Close modal
    setShowModal(false);
  };
  const handleSubmitVehiculo = (data, resetForm) => {
    const newVehiculo = {
      ...data,
      id: vehiculos.length + 1, // or better: use uuid
      estado: "Activo",
      patente: data.patente,
      marca: data.marca,
      modelo: data.modelo,
      color: data.color,
      anio: data.anio,
      conductor: data.conductor,
    };
    setVehiculos((prev) => [...prev, newVehiculo]);
    resetForm(); // Clear the form
    setShowModalVehiculo(false); // Close modal
    setShowModal(false);
  };

  return (
    <MainLayout>
      <div className={theme === 'dark' ? "min-h-screen bg-zinc-900 p-6 text-white" : "min-h-screen bg-white p-6 text-gray-900 border rounded-lg border-yellow-500"}>
        <div className={theme === 'dark' ? "flex flex-col items-center mb-8 text-center border border-zinc-700 p-8 rounded-md" : "flex flex-col items-center mb-8 text-center border border-yellow-500 p-8 rounded-md"}>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
              Gestión de la Plataforma
            </h1>
          </div>
          <div className="flex justify-center space-x-4 mb-6">
            {[
              "usuarios",
              "conductores",
              "pasajeros",
              "vehiculos",
              "viajes",
            ].map((tab) => (
              <button
                key={tab}
                className={`px-6 py-2 rounded-md font-semibold cursor-pointer ${
                  activeTab === tab
                    ? theme === 'dark' ? "bg-yellow-500 text-gray-900" : "bg-yellow-500 text-gray-900"
                    : theme === 'dark' ? "bg-white/10 text-white hover:bg-white/20" : " text-gray-900 border border-yellow-500"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className={theme === 'dark' ? "bg-zinc-900 border border-zinc-700 rounded-lg p-4" : "bg-white border border-yellow-500 rounded-lg p-4 "}>
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className={theme === 'dark' ? "w-4 h-4 text-zinc-500" : "w-4 h-4 text-gray-900"} />
              </div>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="search"
                className={theme === 'dark' ? "w-full p-2.5 pl-10 border border-zinc-700 rounded-lg placeholder-zinc-400 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400" : "w-full p-2.5 pl-10 border border-yellow-500 rounded-lg placeholder-zinc-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"}
                placeholder={
                  activeTab === "vehiculos"
                    ? "Buscar vehículo por patente o marca..."
                    : activeTab === "viajes"
                    ? "Buscar viaje por fecha u origen..."
                    : "Buscar usuario por N° documento o nombre..."
                }
              />
            </div>
            <button
              onClick={handleClick}
              className="ml-4 flex items-center bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-2 px-4 rounded-md transition cursor-pointer"
            >
              <Plus className="mr-2 w-4 h-4" />
              Agregar
            </button>
          </div>
          {showModal && (
            <Modal onClose={() => setShowModal(false)}>
              <div className="flex flex-col gap-4">
                <h1 className={theme === 'dark' ? "text-3xl font-extrabold text-center  mb-8 tracking-wide text-white" : "text-3xl font-extrabold text-center  mb-8 tracking-wide text-gray-900"}>
                  Agregar Usuario
                </h1>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleClickConductor}
                    className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition cursor-pointer"
                  >
                    Agregar Conductor
                  </button>
                  <button
                    onClick={handleClickVehiculo}
                    className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition cursor-pointer"
                  >
                    Agregar Vehiculo
                  </button>
                </div>
              </div>
            </Modal>
          )}
          {showModalConductor && (
            <Modal onClose={() => setShowModalConductor(false)}>
              <FormProfile
                fields={conductorFields}
                onSubmit={handleSubmitConductor}
                submitText="Guardar"
              />
            </Modal>
          )}

          {showModalVehiculo && (
            <Modal onClose={() => setShowModalVehiculo(false)}>
              <Form
                fields={vehiculoFields}
                onSubmit={handleSubmitVehiculo}
                submitText="Guardar"
              />
            </Modal>
          )}
          <div className="overflow-x-auto">
            <table className={theme === 'dark' ? "min-w-full text-sm text-left text-white" : "min-w-full text-sm text-left text-gray-900"}>
              <thead>
                <tr>
                  {headers.map((header, i) => (
                    <th key={i} className="px-6 py-3 text-yellow-500 uppercase">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className={theme === 'dark' ? "bg-[#121212] divide-y divide-zinc-800" : "bg-white divide-y divide-yellow-500"}>
                {currentData.map((item, index) => (
                  <tr
                    key={`${activeTab}-${item.id}-${index}`}
                    className={theme === 'dark' ? "hover:bg-zinc-800 transition" : "hover:bg-yellow-200 transition"}
                  >
                    {/* Usuario */}
                    {activeTab === "usuarios" && (
                      <>
                        <td className= "px-6 py-4 font-semibold text-yellow-500">{item.id}</td>
                        <td className="px-6 py-4 font-semibold">{item.nombre}</td>
                        <td className="px-6 py-4 font-semibold">{item.email}</td>
                        <td className="px-6 py-4 font-semibold">{item.rol}</td>
                        <td className="px-6 py-4 font-semibold">{item.dni}</td>
                        <td className="px-6 py-4 font-semibold">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              item?.estado === "Activo"
                                ? "bg-green-600"
                                : item?.estado === "Inactivo"
                                ? "bg-yellow-500"
                                : item?.estado === "Cancelado"
                                ? "bg-red-600"
                                : "bg-gray-600"
                            }`}
                          >
                            {item?.estado ?? "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold">{item.fecha}</td>
                      </>
                    )}

                    {/* Conductores */}
                    {activeTab === "conductores" && (
                      <>
                        <td className="px-6 py-4 font-semibold text-yellow-500">{item.id}</td>
                        <td className="px-6 py-4 font-semibold">{item.nombre}</td>
                        <td className="px-6 py-4 font-semibold">{item.dni}</td>
                        <td className="px-6 py-4 font-semibold">{item.email}</td>
                        <td className="px-6 py-4 font-semibold">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              item?.estado === "Activo"
                                ? "bg-green-600"
                                : item?.estado === "Inactivo"
                                ? "bg-yellow-600"
                                : item?.estado === "Cancelado"
                                ? "bg-red-600"
                                : "bg-gray-600"
                            }`}
                          >
                            {item?.estado ?? "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4 flex items-center gap-2">
                          <button className="p-2 bg-yellow-500 rounded-md cursor-pointer">
                            <Pencil size={16} />
                          </button>
                        </td>
                      </>
                    )}

                    {/* Pasajeros */}
                    {activeTab === "pasajeros" && (
                      <>
                        <td className="px-6 py-4 font-semibold text-yellow-500">{item.id}</td>
                        <td className="px-6 py-4 font-semibold">{item.nombre}</td>
                        <td className="px-6 py-4 font-semibold">{item.dni}</td>
                        <td className="px-6 py-4 font-semibold">{item.email}</td>
                        <td className="px-6 py-4 font-semibold">{item.direccion}</td>
                        <td className="px-6 py-4 font-semibold">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              item?.estado === "Activo"
                                ? "bg-green-600"
                                : item?.estado === "Inactivo"
                                ? "bg-yellow-600"
                                : item?.estado === "Cancelado"
                                ? "bg-red-600"
                                : "bg-gray-600"
                            }`}
                          >
                            {item?.estado ?? "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4 flex items-center gap-2">
                          <button className="p-2 bg-yellow-500 rounded-md cursor-pointer">
                            <Pencil size={16} />
                          </button>
                        </td>
                      </>
                    )}

                    {/* Vehículos */}
                    {activeTab === "vehiculos" && (
                      <>
                        <td className="px-6 py-4 font-semibold text-yellow-500">{item.id}</td>
                        <td className="px-6 py-4 font-semibold">{item?.patente ?? "N/A"}</td>
                        <td className="px-6 py-4 font-semibold">{item?.marca ?? "N/A"}</td>
                        <td className="px-6 py-4 font-semibold">{item?.modelo ?? "N/A"}</td>
                        <td className="px-6 py-4 font-semibold">{item?.anio ?? "N/A"}</td>
                        <td className="px-6 py-4 font-semibold">{item?.color ?? "N/A"}</td>
                        <td className="px-6 py-4 font-semibold">
                          {item?.conductor ?? "N/A"}
                        </td>
                        <td className="px-6 py-4 font-semibold">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              item?.estado === "Activo"
                                ? "bg-green-600"
                                : item?.estado === "Inactivo"
                                ? "bg-yellow-600"
                                : item?.estado === "Cancelado"
                                ? "bg-red-600"
                                : "bg-gray-600"
                            }`}
                          >
                            {item?.estado ?? "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4 flex items-center gap-2">
                          <button className="p-2 bg-yellow-500 rounded-md cursor-pointer">
                            <Pencil size={16} />
                          </button>
                        </td>
                      </>
                    )}

                    {/* Viajes */}
                    {activeTab === "viajes" && (
                      <>
                        <td className="px-6 py-4 font-semibold text-yellow-500">{item.id}</td>
                        <td className="px-6 py-4 font-semibold">{item.fecha}</td>
                        <td className="px-6 py-4 font-semibold">{item.origen}</td>
                        <td className="px-6 py-4 font-semibold">{item.destino}</td>
                        <td className="px-6 py-4 font-semibold">{item.pasajero}</td>
                        <td className="px-6 py-4 font-semibold">{item.conductor}</td>
                        <td className="px-6 py-4 font-semibold">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              item.estado === "Completado"
                                ? "bg-green-600"
                                : item.estado === "En curso"
                                ? "bg-yellow-500"
                                : item.estado === "Cancelado"
                                ? "bg-red-600"
                                : "bg-gray-600"
                            }`}
                          >
                            {item?.estado ?? "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold">{item.importe}</td>
                        <button
                          onClick={() =>
                            imprimirResumen(generarResumenViaje(item))
                          }
                          className="px-6 py-4 cursor-pointer text-yellow-500"
                        >
                          <FileText className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={theme === 'dark' ? "bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1 rounded disabled:opacity-30 cursor-pointer" : "bg-yellow-500 hover:bg-yellow-800 text-gray-900 px-3 py-1 rounded  cursor-pointer"}
          >
            «
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-3 py-1 rounded cursor-pointer ${
                currentPage === i + 1
                  ? theme === 'dark' ? "bg-zinc-800 text-white font-semibold" : "bg-yellow-500 text-black font-semibold"
                  : theme === 'dark' ? "bg-zinc-800/10 hover:bg-zinc-800/20 text-white" : "bg-yellow-500 hover:bg-yellow-800 text-gray-900"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={theme === 'dark' ? "bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1 rounded disabled:opacity-30 cursor-pointer" : "bg-yellow-500 hover:bg-yellow-800 text-gray-900 px-3 py-1 rounded  cursor-pointer"}
          >
            »
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default HomeSuperAdmin;
