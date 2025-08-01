import { useState, useEffect, useContext, createContext } from "react";
import { useConnection } from "./ConnectionContext";
import { useAuth } from "./auth";
const ChatContext = createContext(); // creamos el context();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [lastMessageReceived, setLastMessageReceived] = useState(null);
  const { on, off } = useConnection();
  const {
    user: { userId },
  } = useAuth();

  useEffect(() => {
    const handleOnMessage = (msg) => {
      console.log("Nuevo mensaje recibido", msg, "Yo soy:", userId);

      const msgUserIdStr = msg.userId.toString();
      const userIdStr = userId.toString();

      console.log(
        "Comparando:",
        msgUserIdStr,
        "===",
        userIdStr,
        msgUserIdStr === userIdStr
      );

      if (msgUserIdStr === userIdStr) return; // Ignorar mensajes propios

      setMessages((prev) => prev.concat(msg));
      setLastMessageReceived(msg);
    };

    on("ReceiveRideMessage", handleOnMessage);

    return () => off("ReceiveRideMessage", handleOnMessage);
  }, [on, off, userId]);

  return (
    <ChatContext.Provider value={{ messages, lastMessageReceived }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
