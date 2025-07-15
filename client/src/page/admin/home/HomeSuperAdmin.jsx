import MainLayout from "../../../components/layout/MainLayout";
import Modal from "../../../components/ui/Modal";
import FormProfile from "../../../components/common/FormProfile";
import { ThemeContext } from "../../../context/ThemeContext";
import { useTranslate } from "../../../hooks/useTranslate";
import {
  generarResumenViaje,
  imprimirResumen,
} from "../../../components/ui/PrintUtils";
import { dataAdmin } from "../../../data/data";
import {
  Pencil,
  Plus,
  Search,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect, useContext } from "react";
import { getAll } from "../../../services/user";
import { getVehicles } from "../../../services/vehicle";
import Form from "../../../components/common/Form";

const HomeSuperAdmin = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [conductores, setConductores] = useState([]);
  const [pasajeros, setPasajeros] = useState([]);

  const [search, setSearch] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("usuarios");
  const [showModalConductor, setShowModalConductor] = useState(false);
  const [showModalVehiculo, setShowModalVehiculo] = useState(false);
  const [vehiculos, setVehiculos] = useState([]);

  const { theme } = useContext(ThemeContext);
  const translate = useTranslate();

  useEffect(() => {
    setSearch("");
  }, [activeTab]);

  let displayedData = [];
  let headers = [];
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await getAll(pageNumber, pageSize, search); // CAMBIO A 10 POR PÁGINA
        console.log("Full response:", response);

        if (response?.data) {
          console.log("USUARIOS TODOS", response.data);

          const uniqueRoles = [
            ...new Set(response.data.map((user) => user.role)),
          ];
          console.log("Unique roles found:", uniqueRoles);

          const formattedUsuarios = response.data.map((user) => ({
            id: user.id,
            nombre: user.name,
            email: user.email,
            dni: user.dni,
            rol: user.role,
            estado: user.accountStatus,
            fechaCreated: new Date(user.createdAt).toLocaleDateString("es-AR"),
          }));

          const conductoresData = formattedUsuarios.filter(
            (u) => u.rol === "Driver"
          );

          const pasajerosData = formattedUsuarios.filter(
            (u) => u.rol === "Client"
          );

          console.log("=== FINAL RESULTS ===");
          console.log("Conductores (Drivers):", conductoresData);
          console.log("Pasajeros (Clients):", pasajerosData);
          console.log("Total usuarios:", formattedUsuarios);

          setConductores(conductoresData);
          setPasajeros(pasajerosData);
          setUsuarios(formattedUsuarios);
          setTotalPages(response.totalPages); // ← actualiza la cantidad de páginas
        } else {
          console.log("No data in response");
        }
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    };

    fetchUsuarios();
  }, [search, pageNumber]);

  const handlePageChange = (newPage) => {
    console.log("Cambiando a página:", newPage); // DEBUG

    if (newPage >= 1 && newPage <= totalPages) {
      setPageNumber(newPage);
    }
  };

  useEffect(() => {
    const handleShowVehicle = async () => {
      try {
        const response = await getVehicles(search, pageNumber);
        console.log("Vehiculos obtenidos del backend:", response);

        const vehiculosMapeados = response.data.map((v) => ({
          id: v.id,
          patente: v.licensePlate,
          marca: v.brand,
          modelo: v.model,
          color: v.color,
          anio: v.year,
          estado: v.status,
          conductor: v.driver?.name || "Desconocido", // si lo tenés
        }));

        setVehiculos(vehiculosMapeados);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.log("Error al obtener vehículos:", error);
      }
    };

    handleShowVehicle();
  }, [search, pageNumber]);

  // Configurar datos y headers según la pestaña activa
  if (activeTab === "usuarios") {
    displayedData = usuarios;
    headers = [
      translate("id"),
      translate("Nombre"),
      translate("Email"),
      translate("Rol"),
      translate("DNI"),
      translate("Estado"),
      translate("Fecha registro"),
    ];
  } else if (activeTab === "conductores") {
    displayedData = conductores;
    headers = [
      translate("id"),
      translate("Nombre"),
      translate("DNI"),
      translate("Email"),
      translate("Estado"),
      translate("Acciones"),
    ];
  } else if (activeTab === "pasajeros") {
    displayedData = pasajeros;
    headers = [
      translate("id"),
      translate("Nombre"),
      translate("DNI"),
      translate("Email"),
      translate("Estado"),
      translate("Acciones"),
    ];
  } else if (activeTab === "vehiculos") {
    displayedData = vehiculos;
    headers = [
      translate("id"),
      translate("Patente"),
      translate("Marca"),
      translate("Modelo"),
      translate("Año"),
      translate("Color"),
      translate("Conductor"),
      translate("Estado"),
      translate("Acciones"),
    ];
  } else if (activeTab === "viajes") {
    displayedData = dataAdmin.viajes;
    headers = [
      translate("id"),
      translate("Fecha"),
      translate("Origen"),
      translate("Destino"),
      translate("Pasajero"),
      translate("Conductor"),
      translate("Estado"),
      translate("Importe"),
      translate("Resumen"),
    ];
  }

  const filteredData = displayedData.filter((item) => {
    const searchTerm = search.toLowerCase();
    if (["usuarios", "conductores", "pasajeros"].includes(activeTab)) {
      return (
        item.dni?.toLowerCase().includes(searchTerm) ||
        item.nombre?.toLowerCase().includes(searchTerm) ||
        item.email?.toLowerCase().includes(searchTerm)
      );
    } else if (activeTab === "vehiculos") {
      return (
        item.patente?.toLowerCase().includes(searchTerm) ||
        item.marca?.toLowerCase().includes(searchTerm) ||
        item.modelo?.toLowerCase().includes(searchTerm)
      );
    } else if (activeTab === "viajes") {
      return (
        item.fecha?.toLowerCase().includes(searchTerm) ||
        item.origen?.toLowerCase().includes(searchTerm) ||
        item.destino?.toLowerCase().includes(searchTerm)
      );
    }
    return false;
  });

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
      label: translate("Nombre"),
      type: "text",
      placeholder: translate("Ingrese su nombre"),
      required: true,
      autoComplete: "name",
      autoFocus: true,
    },
    {
      name: "dni",
      label: translate("DNI"),
      type: "text",
      placeholder: translate("Ingrese su DNI"),
      required: true,
      autoComplete: "dni",
    },
    {
      name: "email",
      label: translate("Correo electrónico"),
      type: "email",
      placeholder: translate("Ingrese su correo electrónico"),
      required: true,
      autoComplete: "email",
    },
    {
      name: "password",
      label: translate("Contraseña"),
      type: "password",
      placeholder: translate("Ingrese su contraseña"),
      required: true,
      autoComplete: "current-password",
    },
    {
      name: "genre",
      label: translate("Género"),
      type: "select",
      required: true,
      options: [
        { label: translate("Selecciona tu género"), value: "" },
        { label: translate("Masculino"), value: "Male" },
        { label: translate("Femenino"), value: "Female" },
        { label: translate("Otro"), value: "Other" },
      ],
    },
  ];

  const vehiculoFields = [
    {
      name: "marca",
      label: translate("Marca"),
      type: "text",
      placeholder: translate("Ingrese la marca"),
      required: true,
      autoComplete: "off",
    },
    {
      name: "modelo",
      label: translate("Modelo"),
      type: "text",
      placeholder: translate("Ingrese el modelo"),
      required: true,
      autoComplete: "off",
    },
    {
      name: "patente",
      label: translate("Patente"),
      type: "text",
      placeholder: translate("Ingrese la patente"),
      required: true,
      autoComplete: "off",
    },
    {
      name: "color",
      label: translate("Color"),
      type: "text",
      placeholder: translate("Ingrese el color"),
      required: true,
      autoComplete: "off",
    },
    {
      name: "anio",
      label: translate("Año"),
      type: "number",
      placeholder: translate("Ingrese el año"),
      required: true,
      autoComplete: "off",
    },
    {
      name: "conductor",
      label: translate("Conductor"),
      type: "text",
      placeholder: translate("Ingrese el conductor"),
      required: true,
      autoComplete: "off",
    },
  ];

  const handleSubmitConductor = (data, resetForm) => {
    const newConductor = {
      ...data,
      nombre: data.name,
      id: usuarios.length + 1,
      rol: "Driver",
      estado: "Activo",
      fechaCreated: new Date().toLocaleDateString("es-AR"),
    };

    setConductores((prev) => [...prev, newConductor]);
    setUsuarios((prev) => [...prev, newConductor]);

    resetForm();
    setShowModalConductor(false);
    setShowModal(false);
  };

  const handleSubmitVehiculo = (data, resetForm) => {
    const newVehiculo = {
      ...data,
      id: vehiculos.length + 1,
      estado: "Activo",
      patente: data.patente,
      marca: data.marca,
      modelo: data.modelo,
      color: data.color,
      anio: data.anio,
      conductor: data.conductor,
    };
    setVehiculos((prev) => [...prev, newVehiculo]);
    resetForm();
    setShowModalVehiculo(false);
    setShowModal(false);
  };

  return (
    <MainLayout>
      <div
        className={
          theme === "dark"
            ? "min-h-screen bg-zinc-900 p-6 text-white"
            : "min-h-screen bg-white p-6 text-gray-900 border rounded-lg border-yellow-500"
        }
      >
        <div
          className={
            theme === "dark"
              ? "flex flex-col items-center mb-8 text-center border border-zinc-700 p-8 rounded-md"
              : "flex flex-col items-center mb-8 text-center border border-yellow-500 p-8 rounded-md"
          }
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
              {translate("Platform Management")}
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
                    ? theme === "dark"
                      ? "bg-yellow-500 text-gray-900"
                      : "bg-yellow-500 text-gray-900"
                    : theme === "dark"
                    ? "bg-white/10 text-white hover:bg-white/20"
                    : " text-gray-900 border border-yellow-500"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {translate(tab).charAt(0).toUpperCase() +
                  translate(tab).slice(1)}
              </button>
            ))}
          </div>

          {/* Mostrar estadísticas por pestaña con debugging */}
          <div className="text-sm text-gray-500 mt-2">
            {activeTab === "usuarios" && `Total: ${usuarios.length} usuarios`}
            {activeTab === "conductores" &&
              `Total: ${conductores.length} conductores`}
            {activeTab === "pasajeros" &&
              `Total: ${pasajeros.length} pasajeros`}
            {activeTab === "vehiculos" &&
              `Total: ${vehiculos.length} vehículos`}
            {activeTab === "viajes" &&
              `Total: ${dataAdmin.viajes.length} viajes`}
          </div>
        </div>

        <div
          className={
            theme === "dark"
              ? "bg-zinc-900 border border-zinc-700 rounded-lg p-4"
              : "bg-white border border-yellow-500 rounded-lg p-4 "
          }
        >
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search
                  className={
                    theme === "dark"
                      ? "w-4 h-4 text-zinc-500"
                      : "w-4 h-4 text-gray-900"
                  }
                />
              </div>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="search"
                className={
                  theme === "dark"
                    ? "w-full p-2.5 pl-10 border border-zinc-700 rounded-lg placeholder-zinc-400 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    : "w-full p-2.5 pl-10 border border-yellow-500 rounded-lg placeholder-zinc-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                }
                placeholder={translate(
                  activeTab === "vehiculos"
                    ? "Buscar vehículo por patente o marca..."
                    : activeTab === "viajes"
                    ? "Buscar viaje por fecha u origen..."
                    : "Buscar usuario por N° documento o nombre..."
                )}
              />
            </div>
            <button
              onClick={handleClick}
              className="ml-4 flex items-center bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-2 px-4 rounded-md transition cursor-pointer"
            >
              <Plus className="mr-2 w-4 h-4" />
              {translate("Agregar")}
            </button>
          </div>
          {showModal && (
            <Modal onClose={() => setShowModal(false)}>
              <div className="flex flex-col gap-4">
                <h1
                  className={
                    theme === "dark"
                      ? "text-3xl font-extrabold text-center  mb-8 tracking-wide text-white"
                      : "text-3xl font-extrabold text-center  mb-8 tracking-wide text-gray-900"
                  }
                >
                  {translate("Agregar Usuario")}
                </h1>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleClickConductor}
                    className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition cursor-pointer"
                  >
                    {translate("Agregar Conductor")}
                  </button>
                  <button
                    onClick={handleClickVehiculo}
                    className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition cursor-pointer"
                  >
                    {translate("Agregar Vehiculo")}
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
                submitText={translate("Guardar")}
              />
            </Modal>
          )}

          {showModalVehiculo && (
            <Modal onClose={() => setShowModalVehiculo(false)}>
              <Form
                fields={vehiculoFields}
                onSubmit={handleSubmitVehiculo}
                submitText={translate("Guardar")}
              />
            </Modal>
          )}

          <div className="overflow-x-auto">
            <table
              className={
                theme === "dark"
                  ? "min-w-full text-sm text-left text-white"
                  : "min-w-full text-sm text-left text-gray-900"
              }
            >
              <thead>
                <tr>
                  {headers.map((header, i) => (
                    <th key={i} className="px-6 py-3 text-yellow-500 uppercase">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody
                className={
                  theme === "dark"
                    ? "bg-[#121212] divide-y divide-zinc-800"
                    : "bg-white divide-y divide-yellow-500"
                }
              >
                {filteredData.length === 0 ? (
                  <tr>
                    <td
                      colSpan={headers.length}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No hay datos para mostrar en la pestaña "{activeTab}"
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, index) => (
                    <tr
                      key={`${activeTab}-${item.id}-${index}`}
                      className={
                        theme === "dark"
                          ? "hover:bg-zinc-800 transition"
                          : "hover:bg-yellow-200 transition"
                      }
                    >
                      {/* Usuario */}
                      {activeTab === "usuarios" && (
                        <>
                          <td className="px-6 py-4 font-semibold text-yellow-500">
                            {item.id}
                          </td>
                          <td className="px-6 py-4 font-semibold">
                            {item.nombre}
                          </td>
                          <td className="px-6 py-4 font-semibold">
                            {item.email}
                          </td>
                          <td className="px-6 py-4 font-semibold">
                            {item.rol}
                          </td>
                          <td className="px-6 py-4 font-semibold">
                            {item.dni}
                          </td>
                          <td className="px-6 py-4 font-semibold">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                item?.estado === "Active"
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
                          <td className="px-6 py-4 font-semibold">
                            {item.fechaCreated}
                          </td>
                        </>
                      )}

                      {/* Conductores */}
                      {activeTab === "conductores" && (
                        <>
                          <td className="px-6 py-4 font-semibold text-yellow-500">
                            {item.id}
                          </td>
                          <td className="px-6 py-4 font-semibold">
                            {item.nombre}
                          </td>
                          <td className="px-6 py-4 font-semibold">
                            {item.dni}
                          </td>
                          <td className="px-6 py-4 font-semibold">
                            {item.email}
                          </td>
                          <td className="px-6 py-4 font-semibold">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                item?.estado === "Active"
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
                          <td className="px-6 py-4 font-semibold text-yellow-500">
                            {item.id}
                          </td>
                          <td className="px-6 py-4 font-semibold">
                            {item.nombre}
                          </td>
                          <td className="px-6 py-4 font-semibold">
                            {item.dni}
                          </td>
                          <td className="px-6 py-4 font-semibold">
                            {item.email}
                          </td>

                          <td className="px-6 py-4 font-semibold">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                item?.estado === "Active"
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
                          <td className="px-6 py-4 font-semibold text-yellow-500">
                            {item.id}
                          </td>
                          <td className="px-6 py-4 font-semibold">
                            {item?.patente ?? "N/A"}
                          </td>
                          <td className="px-6 py-4 font-semibold">
                            {item?.marca ?? "N/A"}
                          </td>
                          <td className="px-6 py-4 font-semibold">
                            {item?.modelo ?? "N/A"}
                          </td>
                          <td className="px-6 py-4 font-semibold">
                            {item?.anio ?? "N/A"}
                          </td>
                          <td className="px-6 py-4 font-semibold">
                            {item?.color ?? "N/A"}
                          </td>
                          <td className="px-6 py-4 font-semibold">
                            {item?.conductor ?? "N/A"}
                          </td>
                          <td className="px-6 py-4 font-semibold">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                item?.estado === "Active"
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
                          <td className="px-6 py-4 font-semibold text-yellow-500">
                            {item.id}
                          </td>
                          <td className="px-6 py-4 font-semibold">
                            {item.fecha}
                          </td>
                          <td className="px-6 py-4 font-semibold">
                            {item.origen}
                          </td>
                          <td className="px-6 py-4 font-semibold">
                            {item.destino}
                          </td>
                          <td className="px-6 py-4 font-semibold">
                            {item.pasajero}
                          </td>
                          <td className="px-6 py-4 font-semibold">
                            {item.conductor}
                          </td>
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
                          <td className="px-6 py-4 font-semibold">
                            {item.importe}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() =>
                                imprimirResumen(generarResumenViaje(item))
                              }
                              className="cursor-pointer text-yellow-500 hover:text-yellow-600"
                            >
                              <FileText className="w-5 h-5" />
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Paginación mejorada */}
        {totalPages > 0 && (
          <div className="flex justify-center mt-6 space-x-2">
            <button
              onClick={() => pageNumber > 1 && handlePageChange(pageNumber - 1)}
              disabled={pageNumber === 1}
              className={`px-3 py-1 rounded transition cursor-pointer ${
                pageNumber === 1
                  ? "opacity-50 cursor-not-allowed"
                  : theme === "dark"
                  ? "bg-zinc-800 hover:bg-zinc-700 text-white"
                  : "bg-yellow-500 hover:bg-yellow-600 text-gray-900"
              }`}
            >
              <ChevronLeft size={18} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 rounded cursor-pointer transition ${
                    pageNumber === page
                      ? theme === "dark"
                        ? "bg-yellow-500 text-gray-900 font-semibold"
                        : "bg-yellow-600 text-white font-semibold"
                      : theme === "dark"
                      ? "bg-zinc-800 hover:bg-zinc-700 text-white"
                      : "bg-yellow-500 hover:bg-yellow-600 text-gray-900"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() =>
                pageNumber < totalPages && handlePageChange(pageNumber + 1)
              }
              disabled={pageNumber === totalPages}
              className={`px-3 py-1 rounded transition cursor-pointer ${
                pageNumber === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : theme === "dark"
                  ? "bg-zinc-800 hover:bg-zinc-700 text-white"
                  : "bg-yellow-500 hover:bg-yellow-600 text-gray-900"
              }`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default HomeSuperAdmin;
