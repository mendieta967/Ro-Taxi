import MainLayout from "../../../components/layout/MainLayout";
import { Search } from "lucide-react";
import { useState, useContext, useEffect, useRef, useCallback } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import { useTranslate } from "../../../hooks/useTranslate";
import { getVehicles } from "@/services/vehicle";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import Ubicacion from "./Ubicacion";
import MiniLoader from "@/components/common/MiniLoader";

const Ubicaciones = () => {
  const translate = useTranslate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  const listRef = useRef(null);
  const lastElement = useRef(null);

  const { theme } = useContext(ThemeContext);

  const get = async (pageNumber = 1, searchTerm = "") => {
    try {
      setLoading(true);
      const list = await getVehicles(pageNumber, 10, searchTerm);
      setTotalPages(list.totalPages);

      if (list.pageNumber > 1) {
        setVehicles((prev) => prev.concat(list.data));
      } else {
        setVehicles(list.data);
      }

      setSelectedVehicle((prev) => prev ?? list.data[0]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    get(page, search);
  }, [page, search]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    setPage(1);
  };

  const loadMore = useCallback(() => {
    if (loading) return;
    if (totalPages !== null && page >= totalPages) return;
    setPage((prev) => prev + 1);
  }, [loading, page, totalPages]);

  const updatedAt = (date) => {
    if (!date) return;
    const formatedDate = new Date(date);
    return formatDistanceToNow(formatedDate, {
      addSuffix: true,
      locale: es,
    });
  };

  useEffect(() => {
    if (!lastElement.current || !listRef.current) return;
    if (loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !loading) {
          observer.disconnect();
          loadMore();
        }
      },
      {
        root: listRef.current,
        rootMargin: "100px",
        threshold: 0.1,
      }
    );

    observer.observe(lastElement.current);

    return () => {
      observer.disconnect();
    };
  }, [vehicles, loadMore, loading]);

  return (
    <MainLayout>
      <div
        className={
          theme === "dark"
            ? "flex flex-col md:flex-row gap-6 p-6 bg-zinc-900 min-h-screen text-white"
            : "flex flex-col md:flex-row gap-6 p-6 bg-white min-h-screen text-gray-900 border border-yellow-500 rounded-lg"
        }
      >
        {/* Sidebar */}
        <aside
          className={
            theme === "dark"
              ? "w-full md:w-1/3 flex flex-col bg-zinc-900 border border-zinc-700 rounded-2xl p-5 shadow-md"
              : "w-full md:w-1/3 flex flex-col bg-white border border-yellow-500 rounded-2xl p-5 shadow-md"
          }
          style={{ maxHeight: "calc(100vh - 3rem)" }}
        >
          <h2 className="text-2xl font-bold mb-4">{translate("vehiculos")}</h2>

          {/* Search */}
          <div className="relative max-w-md mb-5">
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
              onChange={handleSearch}
              className={
                theme === "dark"
                  ? "w-full pl-10 pr-4 py-2 rounded-lg bg-zinc-900 border border-yellow-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  : "w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-yellow-500 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              }
            />
          </div>

          <div
            ref={listRef}
            className="flex-1 overflow-y-auto px-2 pb-4 space-y-3"
          >
            {vehicles.length === 0 && !loading && (
              <div className="text-center text-gray-500 py-6">
                No hay vehículos
              </div>
            )}

            {vehicles.map((vehicle) => {
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

            {/* Sentinel al final */}
            <div ref={lastElement} className="h-2" />

            {/* Loader */}
            {loading && (
              <div className="py-4 flex justify-center">
                <MiniLoader />
              </div>
            )}
          </div>
        </aside>

        {/* Panel principal */}
        {selectedVehicle && <Ubicacion selectedVehicle={selectedVehicle} />}
      </div>
    </MainLayout>
  );
};

export default Ubicaciones;
