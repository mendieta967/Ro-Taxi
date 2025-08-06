import MainLayout from "../../../components/layout/MainLayout";
import { Search } from "lucide-react";
import { useState, useContext, useEffect } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import { useTranslate } from "../../../hooks/useTranslate";
import { getVehicles } from "@/services/vehicle";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import Ubicacion from "./Ubicacion";

const Ubicaciones = () => {
  const translate = useTranslate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const { theme } = useContext(ThemeContext);

  const get = async (page, search) => {
    try {
      const list = await getVehicles(page, 10, search);
      setVehicles(list.data);
      setSelectedVehicle(list.data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    get(page, search);
  }, [page, search]);

  const updatedAt = (date) => {
    if (!date) return;
    var formatedDate = new Date(date);
    const humanReadable = formatDistanceToNow(formatedDate, {
      addSuffix: true,
      locale: es,
    });
    return humanReadable;
  };

  console.log({ selectedVehicle });

  return (
    <MainLayout>
      <div
        className={
          theme === "dark"
            ? "flex flex-col md:flex-row gap-6 p-6 bg-zinc-900 min-h-screen text-white"
            : "flex flex-col md:flex-row gap-6 p-6 bg-white min-h-screen text-gray-900 border border-yellow-500 rounded-lg"
        }
      >
        {/* Sidebar: Lista de vehículos + búsqueda */}
        <aside
          className={
            theme === "dark"
              ? "w-full md:w-1/3 bg-zinc-900 border border-zinc-700 rounded-2xl p-5 shadow-md"
              : "w-full md:w-1/3 bg-white border border-yellow-500 rounded-2xl p-5 shadow-md"
          }
        >
          <h2 className="text-2xl font-bold mb-4">{translate("vehiculos")}</h2>
          <div className="relative max-w-md mb-5 gap-2">
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
              type="text"
              placeholder={translate("Buscar por patente o conductor")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={
                theme === "dark"
                  ? "w-full pl-10 pr-4 py-2 rounded-lg bg-zinc-900 border border-yellow-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  : "w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-yellow-500 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              }
            />
          </div>

          {/* Lista de vehículos */}
          <div className="flex flex-col gap-3">
            {vehicles?.map((vehicle) => {
              const isSelected = vehicle.id === selectedVehicle?.id;
              const statusColors =
                vehicle.status === "Active"
                  ? "bg-green-600 text-white"
                  : vehicle.status === "Inactive"
                  ? "bg-yellow-500 text-white"
                  : "bg-red-600 text-white";

              return (
                <div
                  key={vehicle.id}
                  onClick={() => setSelectedVehicle(vehicle)}
                  className={`p-4 rounded-xl cursor-pointer transition-colors duration-200 ${
                    isSelected
                      ? "bg-yellow-600/20 border border-yellow-400"
                      : theme === "dark"
                      ? "bg-zinc-700"
                      : "bg-zinc-200"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-300 text-lg">🚘</span>
                      <span className="font-semibold text-base">
                        {vehicle.licensePlate}
                      </span>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColors}`}
                    >
                      {vehicle.status}
                    </span>
                  </div>
                  <p className="text-sm font-semibold">
                    {translate("Conductor")}: {vehicle.driver.name}
                  </p>
                  {vehicle.lastLocationAt && (
                    <p
                      className={
                        theme === "dark"
                          ? "text-xs text-gray-400"
                          : "text-xs text-gray-900"
                      }
                    >
                      {translate("Actualizado")}:{" "}
                      {updatedAt(vehicle.lastLocationAt)}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {/* Panel principal */}
        {selectedVehicle && <Ubicacion selectedVehicle={selectedVehicle} />}
      </div>
    </MainLayout>
  );
};

export default Ubicaciones;
