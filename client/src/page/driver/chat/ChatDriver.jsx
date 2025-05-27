import { ArrowLeft, Search, Send, User } from "lucide-react";
import { useState, useContext } from "react";
import MainLayout from "../../../components/layout/MainLayout";
import { ThemeContext } from "../../../context/ThemeContext";
import { initialChats } from "../../../data/data";

const ChatDriver = () => {
  const [activeChat, setActiveChat] = useState(1);
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);
  const [chats, setChats] = useState(initialChats);
  const [newMessage, setNewMessage] = useState("");
  const [search, setSearch] = useState("");
  const { theme } = useContext(ThemeContext);

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
      <div className={`min-h-screen  ${theme === 'dark' ? 'bg-gradient-to-br from-zinc-800 via-black to-zinc-800 text-white' : 'bg-gradient-to-br from-yellow-500 via-white to-yellow-500 border-yellow-500 text-gray-900'}`}>
        <div className="h-screen flex flex-col">
          <div className={`p-6 ${theme === 'dark' ? 'border border-zinc-800' : 'border border-yellow-500'}`}>
            <h1 className={`text-3xl font-bold bg-clip-text text-transparent  ${theme === 'dark' ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' : 'bg-gradient-to-r from-gray-900 to-yellow-600'}`}>
              Mensajes
            </h1>
          </div>

          <div className={`flex-1 flex overflow-hidden ${theme === 'dark' ? 'border border-zinc-800' : 'border border-yellow-500'}`}>
            {/* Lista de chats */}
            <div
              className={`${
                showChatOnMobile ? "hidden" : "flex"
              } ${theme === 'dark' ? 'border-r border-zinc-800' : 'border-r border-yellow-500'} md:flex w-full md:w-80 flex-col`}
            >
              <div className="p-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className={theme === 'dark' ? 'h-5 w-5 text-gray-500' : 'h-5 w-5 text-gray-900'} />
                  </div>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={`block w-full pl-10 pr-3 py-2  transition-all duration-200 ${theme === 'dark' ? 'border border-zinc-700 rounded-lg bg-zinc-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500' : 'border border-gray-900 rounded-lg  text-gray-900 placeholder-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800/50 focus:border-gray-800'}`}
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
                          ? theme === 'dark' ? "bg-zinc-800/70 border-l-2 border-yellow-500" : "bg-yellow-50/70 border-l-2 border-gray-900"
                          : ""
                      }`}
                    >
                      <div className="relative">
                        <div className={theme === 'dark' ? "w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center" : "w-12 h-12 rounded-full bg-white flex items-center justify-center"}>
                          <User className={theme === 'dark' ? "text-gray-300" : "text-gray-900"} size={24} />
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
              <div className={`p-4 flex items-center justify-between ${theme === 'dark' ? ' border-b border-zinc-800 ' : 'border-b border-yellow-500'}`}>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowChatOnMobile(false)}
                    className="md:hidden p-2 rounded-full hover:bg-zinc-700 transition-colors"
                  >
                    <ArrowLeft className={theme === 'dark' ? "h-5 w-5 text-gray-300" : "h-5 w-5 text-gray-900"} />
                  </button>
                  <div className={theme === 'dark' ? "w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center" : "w-10 h-10 rounded-full bg-white flex items-center justify-center"}>
                    <User className={theme === 'dark' ? "text-gray-300" : "text-gray-900"} size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium">{activeChatData?.name}</h3>
                    <p
                      className={`text-xs font-semibold ${
                        activeChatData?.online
                          ? "text-green-500"
                          : "text-gray-700"
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
                          <div className={theme === 'dark' ? "max-w-[70%] bg-yellow-500 text-black rounded-t-lg rounded-l-lg p-3" : "max-w-[70%] bg-yellow-500 border border-white text-gray-900 rounded-t-lg rounded-l-lg p-3"}>
                            <p className="text-sm font-semibold">{text}</p>
                            <p className="text-xs text-gray-900 mt-1">
                              {time}
                            </p>
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div key={idx} className="flex items-end gap-2">
                          <div className={theme === 'dark' ? "w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center" : "w-8 h-8 rounded-full bg-white flex items-center justify-center"}>
                            <User className={theme === 'dark' ? "text-gray-300" : "text-gray-900"} size={16} />
                          </div>
                          <div className={theme === 'dark' ? "max-w-[70%] bg-zinc-800 rounded-t-lg rounded-r-lg p-3" : "max-w-[70%] bg-white border border-yellow-500 text-gray-900 rounded-t-lg rounded-r-lg p-3"}>
                            <p className={theme === 'dark' ? "text-sm" : "text-sm"}>{text}</p>
                            <p className={theme === 'dark' ? "text-xs text-gray-400 mt-1" : "text-xs text-gray-900 mt-1"}>{time}</p>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              </div>

              {/* Entrada de mensaje */}
              <div className={theme === 'dark' ? "p-4 border-t border-zinc-800" : "p-4 border-t border-yellow-500"}>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSendMessage();
                    }}
                    className={theme === 'dark' ? "flex-1 py-2 px-3 border border-zinc-700 rounded-lg bg-zinc-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all duration-200" : "flex-1 py-2 px-3 border border-gray-900 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:border-gray-500 transition-all duration-200"}
                    placeholder="Escribe un mensaje..."
                  />
                  <button
                    onClick={handleSendMessage}
                    className={theme === 'dark' ? "p-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black rounded-full transition-all duration-300 shadow-lg hover:shadow-yellow-500/20 cursor-pointer" : "p-3 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-yellow-500 rounded-full transition-all duration-300 shadow-lg hover:shadow-gray-500/20 cursor-pointer"}
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
