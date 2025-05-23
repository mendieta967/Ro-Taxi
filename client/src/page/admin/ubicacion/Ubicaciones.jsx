import MainLayout from "../../../components/layout/MainLayout";
import { Search } from "lucide-react";
import { useState } from "react";
import { vehiclesUbications } from "../../../data/data";

const Ubicaciones = () => {
  const [search, setSearch] = useState("");
  const [selectedPlate, setSelectedPlate] = useState(
    vehiclesUbications.find((v) => v.selected)?.plate || ""
  );

  // Filtrar vehículos según búsqueda (placa o conductor)
  const filteredVehicles = vehiclesUbications.filter(({ plate, driver }) =>
    `${plate} ${driver}`.toLowerCase().includes(search.toLowerCase())
  );

  const selectedVehicle = vehiclesUbications.find(
    (v) => v.plate === selectedPlate
  );

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row gap-6 p-6 bg-zinc-900 min-h-screen text-white">
        {/* Sidebar: Lista de vehículos + búsqueda */}
        <aside className="w-full md:w-1/3 bg-zinc-900 border border-zinc-700 rounded-2xl p-5 shadow-md">
          <h2 className="text-2xl font-bold mb-4">Vehículos</h2>
          <div className="relative max-w-md mb-5 gap-2">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-zinc-500" />
            </div>
            <input
              type="text"
              placeholder="Buscar por placa o conductor"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-zinc-900 border border-yellow-500 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Lista de vehículos */}
          <div className="flex flex-col gap-3">
            {filteredVehicles.map(({ plate, driver, status, updated }) => {
              const isSelected = plate === selectedPlate;
              const statusColors =
                status === "Activo"
                  ? "bg-green-600 text-white"
                  : status === "Inactivo"
                  ? "bg-yellow-500 text-white"
                  : "bg-red-600 text-white";

              return (
                <div
                  key={plate}
                  onClick={() => setSelectedPlate(plate)}
                  className={`p-4 rounded-xl cursor-pointer transition-colors duration-200 ${
                    isSelected
                      ? "bg-yellow-600/20 border border-yellow-400"
                      : "bg-zinc-700"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-300 text-lg">🚘</span>
                      <span className="font-semibold text-base">{plate}</span>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColors}`}
                    >
                      {status}
                    </span>
                  </div>
                  <p className="text-sm">Conductor: {driver}</p>
                  <p className="text-xs text-gray-400">
                    Actualizado: {updated}
                  </p>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Panel principal */}
        <main className="flex-1 bg-zinc-900 border border-zinc-700 rounded-2xl overflow-hidden shadow-lg">
          {/* Placeholder Mapa */}
          <section className="flex flex-col items-center justify-center text-center p-8 border-b border-zinc-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-60 w-60 text-gray-500 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 20l-5.447-2.724A2 2 0 013 15.382V5.618a2 2 0 011.105-1.789L9 2m0 0l6 2.618M9 2v18m6-15.382l5.447 2.724A2 2 0 0121 8.618v9.764a2 2 0 01-1.105 1.789L15 22V5.618z"
              />
            </svg>
            <p className="text-base">
              En una implementación real, aquí se mostraría un mapa interactivo
              con la ubicación de los vehículos.
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Se necesitaría integrar una API de mapas como Google Maps o
              Mapbox.
            </p>
          </section>

          {/* Detalles del vehículo seleccionado */}
          {selectedVehicle && (
            <section className="p-6">
              <header className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold">
                  Vehículo {selectedVehicle.plate}
                </h2>
                <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {selectedVehicle.status}
                </span>
              </header>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 text-sm text-white mb-6">
                <div>
                  <p className="text-gray-400 mb-1">Conductor</p>
                  <p className="font-semibold">{selectedVehicle.driver}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Última actualización</p>
                  <p className="font-semibold">{selectedVehicle.updated}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-gray-400 mb-1">Ubicación actual</p>
                  <p className="font-semibold">{selectedVehicle.location}</p>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button className="bg-yellow-600 hover:bg-yellow-500 text-white font-semibold px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200">
                  Ver ruta
                </button>
              </div>
            </section>
          )}
        </main>
      </div>
    </MainLayout>
  );
};

export default Ubicaciones;
