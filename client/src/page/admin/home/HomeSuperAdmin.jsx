import MainLayout from "../../../components/layout/MainLayout";
import Pagination from "../../../components/ui/Pagination";
import Modal from "../../../components/ui/Modal";
import { ThemeContext } from "../../../context/ThemeContext";
import { useTranslate } from "../../../hooks/useTranslate";
import {
  generarResumenViaje,
  imprimirResumen,
} from "../../../components/ui/PrintUtils";
import { Pencil, Plus, Search, FileText } from "lucide-react";
import { useState, useEffect, useContext } from "react";
import { getAll } from "../../../services/user";
import { registerUser } from "../../../services/auth";
import { getVehicles } from "../../../services/vehicle";
import { getRides } from "../../../services/ride";
import { createVehicles } from "../../../services/vehicle";
import Form from "../../../components/common/Form";

const HomeSuperAdmin = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [conductores, setConductores] = useState([]);
  const [pasajeros, setPasajeros] = useState([]);

  //Estados de mis usuarios
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;

  //Estado de mis vehiculos

  const [totalPagesVehiculo, setTotalPagesVehiculo] = useState(1);
  const [pageNumberVehiculo, setPageNumberVehiculo] = useState(1);
  const pageSizeVehiculo = 10;

  //Estado de mis viajes
  const [totalPagesViajes, setTotalPagesViajes] = useState(1);
  const [pageNumberViajes, setPageNumberViajes] = useState(1);
  const pageSizeViajes = 10;

  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("usuarios");
  const [showModalConductor, setShowModalConductor] = useState(false);
  const [showModalVehiculo, setShowModalVehiculo] = useState(false);
  const [vehiculos, setVehiculos] = useState([]);
  const [viajes, setViajes] = useState([]);

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
        console.log("Fetch usuarios página:", pageNumber, "tamaño:", pageSize);
        const response = await getAll(pageNumber, pageSize, search); // CAMBIO A 10 POR PÁGINA
        console.log("Full response:", response);
        console.log("Fetch usuarios página:", pageNumber, "tamaño:", pageSize);

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
  }, [pageNumber, search]);

  const handlePageChange = (newPage) => {
    console.log("Cambiando a página:", newPage); // DEBUG
    setPageNumber(newPage);
    console.log("Página cambiada a:", newPage);
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
          patente: v.licensePlate,
          marca: v.brand,
          modelo: v.model,
          color: v.color,
          anio: v.year,
          estado: v.status,
          conductor: v.driver?.name || "Desconocido", // si lo tenés
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

  //funcion para traer los viajes realizados
  useEffect(() => {
    const fetchViajes = async () => {
      try {
        const responseViajes = await getRides(
          pageNumberViajes,
          pageSizeViajes,
          search
        );
        console.log("Viajes obtenidos del backend:", responseViajes);
        const viajesMapeados = responseViajes.data.map((v) => ({
          id: v.id,
          origen: v.originAddress,
          destino: v.destinationAddress,
          fecha: new Date(v.startedAt).toLocaleDateString("es-AR"),
          passenger: v.passeger.name,
          conductor: v.driver?.name || "Desconocido",
          status: v.status,
          precio: v.payment.amount,
        }));

        console.log("Viajes obtenidos del backend:", viajesMapeados);
        setViajes(viajesMapeados);
        setTotalPagesViajes(responseViajes.totalPages);
      } catch (error) {
        console.log("Error al obtener viajes:", error);
      }
    };

    fetchViajes();
  }, [pageNumberViajes, search]);

  const handlePageChangeViajes = (newPage) => {
    console.log("Cambiando a página:", newPage); // DEBUG
    setPageNumberViajes(newPage);
    console.log("Página cambiada a:", newPage);
  };
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
    displayedData = viajes;
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
    switch (activeTab) {
      case "conductores":
        setShowModalConductor(true);
        break;
      case "pasajeros":
        setShowModalConductor(true);
        break;
      case "vehiculos":
        setShowModalVehiculo(true);
        break;
      default:
        break;
    }
  };

  const handleClickVehiculo = () => {
    setShowModalVehiculo(true);
  };

  const usuariosForm = [
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
      name: "tipoUsuario",
      label: translate("Tipo de usuario"),
      type: "select",
      required: true,
      options: [
        { label: translate("Selecciona el tipo de usuario"), value: "" },
        { label: translate("Pasajero"), value: "Client" },
        { label: translate("Conductor"), value: "Driver" },
      ],
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
  const handleSubmitUsuarios = async (data) => {
    const newUser = {
      ...data,
      nombre: data.name,
      id: usuarios.length + 1,
      role: data.tipoUsuario, // <- lo toma del select
      estado: "Active",
      fechaCreated: new Date().toLocaleDateString("es-AR"),
    };

    try {
      console.log("Nuevo usuario a registrar:", newUser);
      const responseUsuario = await registerUser(newUser);
      console.log("Usuario registrado exitosamente", responseUsuario);
      setShowModalConductor(false);
      setShowModal(false);
    } catch (error) {
      console.log(error);
    }
  };

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
      name: "conductorId",
      label: translate("Conductor"),
      type: "select",
      required: true,
      options: conductores.map((conductor) => ({
        label: conductor.nombre,
        value: conductor.id,
      })),
    },
  ];

  const handleSubmitVehiculo = (data) => {
    // Buscar el conductor según el conductorId recibido
    const conductorSeleccionado = conductores.find(
      (c) => c.id === Number(data.conductorId)
    );

    const newVehiculo = {
      id: vehiculos.length + 1,
      estado: "Activo",
      patente: data.patente,
      marca: data.marca,
      modelo: data.modelo,
      color: data.color,
      anio: Number(data.anio),
      conductorId: Number(data.conductorId), // guardar el id para referencia
      conductorNombre: conductorSeleccionado
        ? conductorSeleccionado.nombre
        : "Desconocido",
    };

    try {
      console.log("Nuevo vehiculo a registrar:", newVehiculo);
      const responseVehiculo = createVehicles(newVehiculo);
      console.log("Vehiculo registrado exitosamente", responseVehiculo);
      setShowModalVehiculo(false);
      setShowModal(false);
    } catch (error) {
      console.log(error);
    }
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
            {activeTab === "viajes" && `Total: ${viajes.length} viajes`}
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
            {activeTab !== "viajes" && activeTab !== "usuarios" && (
              <button
                onClick={handleClick}
                className="ml-4 flex items-center bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-2 px-4 rounded-md transition cursor-pointer"
              >
                <Plus className="mr-2 w-4 h-4" />
                {translate("Agregar")}
              </button>
            )}
          </div>

          {showModal && (
            <Modal onClose={() => setShowModal(false)}>
              <div className="flex flex-col gap-4">
                <div className="flex justify-center gap-4">
                  {activeTab === "conductores" && activeTab === "pasajeros" && (
                    <button
                      onClick={() => {
                        setShowModalConductor(true);
                      }}
                      className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition cursor-pointer"
                    >
                      {translate("Agregar Usuario")}
                    </button>
                  )}

                  {activeTab === "vehiculos" && (
                    <button
                      onClick={handleClickVehiculo}
                      className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition cursor-pointer"
                    >
                      {translate("Agregar Vehiculo")}
                    </button>
                  )}
                </div>
              </div>
            </Modal>
          )}

          {showModalConductor && (
            <Modal onClose={() => setShowModalConductor(false)}>
              <Form
                fields={usuariosForm}
                onSubmit={handleSubmitUsuarios}
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
                                  ? "bg-green-600 text-black"
                                  : item?.estado === "Revision"
                                  ? "bg-yellow-500 text-black"
                                  : item?.estado === "Inactive"
                                  ? "bg-red-600 text-black"
                                  : item?.estado === "Deleted"
                                  ? "bg-red-100 text-red-600 line-through italic border border-red-400"
                                  : "bg-gray-600 text-black"
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
                            {item.passenger}
                          </td>
                          <td className="px-6 py-4 font-semibold">
                            {item.conductor}
                          </td>
                          <td className="px-6 py-4 font-semibold">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                item.status === "Completed"
                                  ? "bg-green-600"
                                  : item.status === "InProgress"
                                  ? "bg-yellow-500"
                                  : item.status === "Cancelled"
                                  ? "bg-red-600"
                                  : "bg-gray-600"
                              }`}
                            >
                              {item?.status ?? "N/A"}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-semibold">
                            {item.precio}
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

        {/* Paginación mejorada usuarios*/}
        {activeTab !== "vehiculos" && activeTab !== "viajes" && (
          <Pagination
            currentPage={pageNumber}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}

        {/* Paginación mejorada vehiculo*/}
        {activeTab === "vehiculos" && (
          <Pagination
            currentPage={pageNumberVehiculo}
            totalPages={totalPagesVehiculo}
            onPageChange={handlePageChangeVehiculo}
          />
        )}

        {/* Paginación mejorada viajes*/}
        {activeTab === "viajes" && (
          <Pagination
            currentPage={pageNumberViajes}
            totalPages={totalPagesViajes}
            onPageChange={handlePageChangeViajes}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default HomeSuperAdmin;
