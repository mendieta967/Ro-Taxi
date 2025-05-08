import LandingNavBar from "./components/landingNavBar/LandingNavBar";
import LandingPage from "./page/landing/LandingPage";
import AuthPage from "./page/auth/AuthPage";
import NavBar from "./components/layout/navBar/NavBar";
import RegisterVehicle from "./page/auth/registerVehicle/RegisterVehicle";
import Sidebar from "./components/layout/sidebar/Sidebar";
import MainLayout from "./components/layout/MainLayout";
import HomePassenger from "./page/passenger/home/HomePassenger";
import PerfilPassenger from "./page/passenger/perfil/PerfilPassenger";
import FormProfile from "./components/common/FormProfile";
import HistorialPassenger from "./page/passenger/historial/HistorialPassenger";

const App = () => {
  return (
    <div>
      <HistorialPassenger />
    </div>
  );
};

export default App;
