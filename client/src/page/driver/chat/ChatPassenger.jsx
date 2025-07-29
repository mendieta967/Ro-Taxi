import { useState, useContext, useEffect } from "react";
import { ThemeContext } from "../../../context/ThemeContext";
import { useTranslate } from "../../../hooks/useTranslate";
import { Send } from "lucide-react";
import { getChat } from "@/services/chat";
import { useConnection } from "@/context/ConnectionContext";

const ChatPassenger = ({ rideId }) => {
  const { theme } = useContext(ThemeContext);
  const translate = useTranslate();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { on, invoke } = useConnection();

  const getMessages = async (id) => {
    try {
      const messages = await getChat(id);
      setMessages(messages);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMessages(rideId);
  }, [rideId]);

  useEffect(() => {
    on("receiveRideMessage", (message) => {
      console.log(message);
    });
  });

  if (!rideId) return;

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    invoke("SendMessageToRideGroup", rideId, newMessage);
    // setMessages((prev) => [
    //   ...prev,
    //   { id: Date.now(), text: newMessage, sender: "user" },
    // ]);
    setNewMessage("");
  };

  return (
    <div
      className={`rounded-2xl overflow-hidden flex flex-col h-113 w-[100%] max-w-md mx-auto shadow-lg transition-colors ${
        theme === "dark"
          ? "bg-zinc-900 border border-zinc-800"
          : "bg-white border border-yellow-500"
      }`}
    >
      {/* Header */}
      <div
        className={`p-4 text-lg font-bold border-b ${
          theme === "dark"
            ? "border-zinc-800 text-yellow-500"
            : "border-yellow-400 text-gray-900"
        }`}
      >
        {translate("Chat")}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scroll-smooth">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`rounded-xl px-4 py-2 text-sm max-w-[70%] shadow-md transition-all ${
                msg.sender === "user"
                  ? "bg-yellow-500 text-black"
                  : "bg-zinc-700 text-white"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div
        className={`p-4 border-t ${
          theme === "dark" ? "border-zinc-800" : "border-yellow-400"
        }`}
      >
        <form className="flex gap-2" onSubmit={handleSend}>
          <input
            type="text"
            placeholder={translate("Escribe un mensaje...")}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className={`flex-1 px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
              theme === "dark"
                ? "bg-zinc-800 text-white focus:ring-yellow-500"
                : "bg-gray-100 text-black focus:ring-yellow-500"
            }`}
          />
          <button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold transition-all"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPassenger;
