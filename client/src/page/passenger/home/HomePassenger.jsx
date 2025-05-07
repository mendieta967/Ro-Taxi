import MainLayout from "../../../components/layout/MainLayout";
import { historailViajes, cardViajes } from "../../../data/data";
import { MapPin, Clock, Star } from "lucide-react";

const HomePassenger = () => {
  return (
    <MainLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-white">
        {/* Columna izquierda (Formulario + Mapa) */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-yellow-500">
              ¡Hola, Carlos!
            </h1>
            <p className="text-white">¿A dónde quieres ir hoy?</p>
          </div>

          {/* Formulario */}
          <div className="border border-zinc-800 p-6 rounded-xl space-y-6 bg-zinc-900">
            {/* Inputs */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-zinc-800 px-4 py-3 rounded-lg">
                <MapPin className="text-yellow-500" size={20} />
                <input
                  type="text"
                  placeholder="Mi ubicación actual"
                  className="bg-transparent outline-none w-full text-white placeholder:text-zinc-400"
                />
              </div>
              <div className="flex items-center gap-3 bg-zinc-800 px-4 py-3 rounded-lg">
                <MapPin className="text-yellow-500" size={20} />
                <input
                  type="text"
                  placeholder="¿A dónde vas?"
                  className="bg-transparent outline-none w-full text-white placeholder:text-zinc-400"
                />
              </div>
            </div>

            {/* Mapa simulado */}
            <div className="bg-zinc-700 h-64 rounded-lg grid place-items-center">
              <div className="w-5 h-5 bg-yellow-500 rounded-full shadow-md" />
            </div>

            {/* Botón */}
            <div className="flex items-center justify-center ">
              <button className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-3 rounded-lg transition-colors cursor-pointer">
                Solicitar Taxi
              </button>
            </div>
          </div>
        </div>

        {/* Columna derecha (Viajes recientes) */}
        <div className="bg-zinc-900 p-4 rounded-xl space-y-6">
          {/* Título */}
          <h2 className="text-2xl font-bold text-white text-center">
            Viajes Recientes
          </h2>

          {/* Lista de viajes */}
          <div className="space-y-4">
            {historailViajes.map((viajes, id) => (
              <div
                key={id}
                className="bg-zinc-800 p-4 rounded-lg flex justify-between items-start shadow-sm hover:bg-zinc-700 transition"
              >
                <div className="space-y-1">
                  <p className="text-white font-medium">{viajes.title}</p>
                  <p className="text-sm text-zinc-400 flex items-center gap-1">
                    <Clock size={14} /> {viajes.date}
                  </p>
                  <p className="text-yellow-400 font-semibold">
                    {viajes.price}
                  </p>
                </div>
                <div className="flex items-center text-yellow-500 text-sm">
                  <Star size={16} className="mr-1" />
                  5.0
                </div>
              </div>
            ))}
          </div>

          {/* Ver todos */}
          <button className="text-yellow-500 hover:underline w-full text-sm font-medium text-center">
            Ver todos los viajes
          </button>
        </div>

        {/* Tarjetas informativas */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {/* Tarjeta común */}
          {cardViajes.map((item, id) => (
            <div
              key={id}
              className="bg-zinc-900 hover:bg-zinc-800 transition p-5 rounded-lg space-y-1 shadow-sm"
            >
              <h3 className="text-white font-semibold text-lg">{item.title}</h3>
              <p className="text-sm text-zinc-400">{item.description}</p>
            </div>
          ))}

          {/* Tarjeta especial para agregar */}
          <div className="bg-zinc-900 hover:bg-zinc-800 transition p-5 rounded-lg flex flex-col items-center justify-center text-center space-y-2 shadow-sm">
            <div className="w-10 h-10 flex items-center justify-center bg-yellow-500 text-black text-xl font-bold rounded-full">
              +
            </div>
            <h3 className="text-white font-semibold">Agregar</h3>
            <p className="text-sm text-zinc-400">
              Añadir nuevo destino o preferencia
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePassenger;
