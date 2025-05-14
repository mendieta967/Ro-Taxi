import MainLayout from "../../../components/layout/MainLayout";
import {
  Search,
  Send,
  Phone,
  ImageIcon,
  Paperclip,
  MoreVertical,
  User,
} from "lucide-react";
import { useState } from "react";
const ChatDriver = () => {
  const [activeChat, setActiveChat] = useState(1);
  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-zinc-800 via-black to-zinc-800 text-white">
        <div className="h-screen flex flex-col">
          <div className="p-6 border-b border-zinc-800">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
              Mensajes
            </h1>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Lista de chats */}
            <div className="w-full md:w-80 border-r border-zinc-800 flex flex-col">
              <div className="p-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-zinc-700 rounded-lg bg-zinc-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200"
                    placeholder="Buscar conversaciones"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {/* Chat 1 */}
                <div
                  onClick={() => setActiveChat(1)}
                  className={`p-4 flex gap-3 cursor-pointer hover:bg-zinc-800/50 transition-colors duration-200 ${
                    activeChat === 1
                      ? "bg-zinc-800/70 border-l-2 border-yellow-500"
                      : ""
                  }`}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center">
                      <User className="text-gray-300" size={24} />
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium truncate">María González</h3>
                      <span className="text-xs text-gray-400">12:30</span>
                    </div>
                    <p className="text-sm text-gray-400 truncate">
                      ¿A qué hora llegas? Estoy esperando en la entrada
                      principal.
                    </p>
                  </div>
                </div>

                {/* Chat 2 */}
                <div
                  onClick={() => setActiveChat(2)}
                  className={`p-4 flex gap-3 cursor-pointer hover:bg-zinc-800/50 transition-colors duration-200 ${
                    activeChat === 2
                      ? "bg-zinc-800/70 border-l-2 border-yellow-500"
                      : ""
                  }`}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center">
                      <User className="text-gray-300" size={24} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium truncate">Juan Pérez</h3>
                      <span className="text-xs text-gray-400">Ayer</span>
                    </div>
                    <p className="text-sm text-gray-400 truncate">
                      Gracias por el viaje, excelente servicio.
                    </p>
                  </div>
                </div>

                {/* Chat 3 */}
                <div
                  onClick={() => setActiveChat(3)}
                  className={`p-4 flex gap-3 cursor-pointer hover:bg-zinc-800/50 transition-colors duration-200 ${
                    activeChat === 3
                      ? "bg-zinc-800/70 border-l-2 border-yellow-500"
                      : ""
                  }`}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center">
                      <User className="text-gray-300" size={24} />
                    </div>
                    <div className="absolute top-0 right-0 w-5 h-5 bg-yellow-500 rounded-full border-2 border-black flex items-center justify-center text-xs font-bold text-black">
                      2
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium truncate">Carlos Rodríguez</h3>
                      <span className="text-xs text-gray-400">10:15</span>
                    </div>
                    <p className="text-sm text-gray-400 truncate">
                      Hola, ¿puedes recogerme en otra dirección?
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Área de chat */}
            <div className="hidden md:flex flex-1 flex-col">
              {/* Cabecera del chat */}
              <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center">
                    <User className="text-gray-300" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium">María González</h3>
                    <p className="text-xs text-green-500">En línea</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-full transition-all duration-200">
                    <MoreVertical size={18} className="text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Mensajes */}
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {/* Mensaje recibido */}
                  <div className="flex items-end gap-2">
                    <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                      <User className="text-gray-300" size={16} />
                    </div>
                    <div className="max-w-[70%] bg-zinc-800 rounded-t-lg rounded-r-lg p-3">
                      <p className="text-sm">
                        Hola, ¿a qué hora llegas? Estoy esperando en la entrada
                        principal.
                      </p>
                      <p className="text-xs text-gray-400 mt-1">12:30</p>
                    </div>
                  </div>

                  {/* Mensaje enviado */}
                  <div className="flex items-end justify-end gap-2">
                    <div className="max-w-[70%] bg-yellow-500 text-black rounded-t-lg rounded-l-lg p-3">
                      <p className="text-sm">
                        Estoy a 5 minutos de distancia. Llego enseguida.
                      </p>
                      <p className="text-xs text-yellow-900 mt-1">12:32</p>
                    </div>
                  </div>

                  {/* Mensaje recibido */}
                  <div className="flex items-end gap-2">
                    <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                      <User className="text-gray-300" size={16} />
                    </div>
                    <div className="max-w-[70%] bg-zinc-800 rounded-t-lg rounded-r-lg p-3">
                      <p className="text-sm">
                        Perfecto, te espero. Estoy usando una chaqueta roja.
                      </p>
                      <p className="text-xs text-gray-400 mt-1">12:33</p>
                    </div>
                  </div>

                  {/* Mensaje enviado */}
                  <div className="flex items-end justify-end gap-2">
                    <div className="max-w-[70%] bg-yellow-500 text-black rounded-t-lg rounded-l-lg p-3">
                      <p className="text-sm">
                        Ya te veo. Estoy estacionando el auto.
                      </p>
                      <p className="text-xs text-yellow-900 mt-1">12:35</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Entrada de mensaje */}
              <div className="p-4 border-t border-zinc-800">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    className="flex-1 py-2 px-3 border border-zinc-700 rounded-lg bg-zinc-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200"
                    placeholder="Escribe un mensaje..."
                  />
                  <button className="p-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black rounded-full transition-all duration-300 shadow-lg hover:shadow-yellow-500/20">
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ChatDriver;
