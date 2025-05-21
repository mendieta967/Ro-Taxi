import { ArrowLeft, Search, Send, User } from "lucide-react";
import { useState } from "react";
import MainLayout from "../../../components/layout/MainLayout";
import { initialChats } from "../../../data/data";

const ChatDriver = () => {
  const [activeChat, setActiveChat] = useState(1);
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);
  const [chats, setChats] = useState(initialChats);
  const [newMessage, setNewMessage] = useState("");
  const [search, setSearch] = useState("");

  const activeChatData = chats.find((chat) => chat.id === activeChat);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const timeNow = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const updatedChats = chats.map((chat) => {
      if (chat.id === activeChat) {
        return {
          ...chat,
          messages: [
            ...chat.messages,
            { from: "me", text: newMessage.trim(), time: timeNow },
          ],
          unread: 0, // clear unread on sending message
        };
      }
      return chat;
    });

    setChats(updatedChats);
    setNewMessage("");
  };

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(search.toLowerCase())
  );

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
            <div
              className={`${
                showChatOnMobile ? "hidden" : "flex"
              } md:flex w-full md:w-80 border-r border-zinc-800 flex-col`}
            >
              <div className="p-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-zinc-700 rounded-lg bg-zinc-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200"
                    placeholder="Buscar conversaciones"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {filteredChats.map(({ id, name, messages, unread }) => {
                  const lastMessage = messages[messages.length - 1];
                  return (
                    <div
                      key={id}
                      onClick={() => {
                        setActiveChat(id);
                        setShowChatOnMobile(true);
                      }}
                      className={`p-4 flex gap-3 cursor-pointer hover:bg-zinc-800/50 transition-colors duration-200 ${
                        activeChat === id
                          ? "bg-zinc-800/70 border-l-2 border-yellow-500"
                          : ""
                      }`}
                    >
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center">
                          <User className="text-gray-300" size={24} />
                        </div>
                        {unread > 0 && (
                          <div className="absolute top-0 right-0 w-5 h-5 bg-yellow-500 rounded-full border-2 border-black flex items-center justify-center text-xs font-bold text-black">
                            {unread}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium truncate">{name}</h3>
                          <span className="text-xs text-gray-400">
                            {lastMessage?.time}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 truncate">
                          {lastMessage?.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Área de chat */}
            <div
              className={`${
                showChatOnMobile ? "flex" : "hidden"
              } md:flex flex-1 flex-col`}
            >
              {/* Cabecera del chat */}
              <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowChatOnMobile(false)}
                    className="md:hidden p-2 rounded-full hover:bg-zinc-700 transition-colors"
                  >
                    <ArrowLeft className="h-5 w-5 text-gray-300" />
                  </button>
                  <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center">
                    <User className="text-gray-300" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium">{activeChatData?.name}</h3>
                    <p
                      className={`text-xs ${
                        activeChatData?.online
                          ? "text-green-500"
                          : "text-gray-400"
                      }`}
                    >
                      {activeChatData?.online ? "En línea" : "Desconectado"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Mensajes */}
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  {activeChatData?.messages.map(({ from, text, time }, idx) => {
                    if (from === "me") {
                      return (
                        <div
                          key={idx}
                          className="flex items-end justify-end gap-2"
                        >
                          <div className="max-w-[70%] bg-yellow-500 text-black rounded-t-lg rounded-l-lg p-3">
                            <p className="text-sm">{text}</p>
                            <p className="text-xs text-yellow-900 mt-1">
                              {time}
                            </p>
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div key={idx} className="flex items-end gap-2">
                          <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                            <User className="text-gray-300" size={16} />
                          </div>
                          <div className="max-w-[70%] bg-zinc-800 rounded-t-lg rounded-r-lg p-3">
                            <p className="text-sm">{text}</p>
                            <p className="text-xs text-gray-400 mt-1">{time}</p>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              </div>

              {/* Entrada de mensaje */}
              <div className="p-4 border-t border-zinc-800">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSendMessage();
                    }}
                    className="flex-1 py-2 px-3 border border-zinc-700 rounded-lg bg-zinc-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200"
                    placeholder="Escribe un mensaje..."
                  />
                  <button
                    onClick={handleSendMessage}
                    className="p-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black rounded-full transition-all duration-300 shadow-lg hover:shadow-yellow-500/20"
                  >
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
