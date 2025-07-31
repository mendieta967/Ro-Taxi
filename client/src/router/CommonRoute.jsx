import { useAuth } from "../context/auth";
import PerfilApp from "../page/perfil/PerfilApp";
import HistorialPassenger from "../page/passenger/historial/HistorialPassenger";
import HistorialDriver from "../page/driver/historial/HistorialDriver";
import HomePassenger from "../page/passenger/home/HomePassenger";
import HomeDriver from "../page/driver/home/HomeDriver";
import HomeSuperAdmin from "../page/admin/home/HomeSuperAdmin";
import { UseRole } from "../utils/enuns";

export const Home = () => {
  const {
    user: { role },
  } = useAuth();

  if (role === UseRole.CLIENT) return <HomePassenger />;
  if (role === UseRole.DRIVER) return <HomeDriver />;
  if (role === UseRole.ADMIN) return <HomeSuperAdmin />;
};

export const Perfil = () => {
  const {
    user: { role },
  } = useAuth();
  if (role === UseRole.CLIENT) return <PerfilApp />;
  if (role === UseRole.DRIVER) return <PerfilApp />;
  if (role === UseRole.ADMIN) return <PerfilApp />;
};

export const Historial = () => {
  const {
    user: { role },
  } = useAuth();
  if (role === UseRole.CLIENT) return <HistorialPassenger />;
  if (role === UseRole.DRIVER) return <HistorialDriver />;
};
