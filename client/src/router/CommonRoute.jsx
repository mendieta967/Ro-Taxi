import { useAuth } from "../context/auth";
import PerfilPassenger from "../page/passenger/perfil/PerfilPassenger";
import PerfilDriver from "../page/driver/perfil/PerfilDriver";
import HistorialPassenger from "../page/passenger/historial/HistorialPassenger";
import HistorialDriver from "../page/driver/historial/HistorialDriver";
import HomePassenger from "../page/passenger/home/HomePassenger";
import HomeDriver from "../page/driver/home/HomeDriver";

export const Home = () => {
  const {
    user: { role },
  } = useAuth();
  if (role === "Client") return <HomePassenger />;
  if (role === "Driver") return <HomeDriver />;
  if (role === "Admin") return <HomeDriver />;
};

export const Perfil = () => {
  const {
    user: { role },
  } = useAuth();
  if (role === "Client") return <PerfilPassenger />;
  if (role === "Driver") return <PerfilDriver />;
};

export const Historial = () => {
  const {
    user: { role },
  } = useAuth();
  if (role === "Client") return <HistorialPassenger />;
  if (role === "Driver") return <HistorialDriver />;
};
