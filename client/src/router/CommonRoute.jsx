import { useAuth } from "../context/auth";
import PerfilApp from "../page/perfil/PerfilApp";
import HistorialPassenger from "../page/passenger/historial/HistorialPassenger";
import HistorialDriver from "../page/driver/historial/HistorialDriver";
import HomePassenger from "../page/passenger/home/HomePassenger";
import HomeDriver from "../page/driver/home/HomeDriver";
import HomeSuperAdmin from "../page/admin/home/HomeSuperAdmin";
import ChatDriver from "../page/driver/chat/ChatDriver";

export const Home = () => {
  const {
    user: { role },
  } = useAuth();
  if (role === "Client") return <HomePassenger />;
  if (role === "Driver") return <HomeDriver />;
  if (role === "Admin") return <HomeSuperAdmin />;
};

export const Perfil = () => {
  const {
    user: { role },
  } = useAuth();
  if (role === "Client") return <PerfilApp />;
  if (role === "Driver") return <PerfilApp />;
  if (role === "Admin") return <PerfilApp />;
};

export const Historial = () => {
  const {
    user: { role },
  } = useAuth();
  if (role === "Client") return <HistorialPassenger />;
  if (role === "Driver") return <HistorialDriver />;
};
