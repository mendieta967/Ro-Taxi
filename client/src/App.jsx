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
import PagosPassenger from "./page/passenger/pagos/PagosPassenger";
import AppRoute from "./router/AppRoute";
import HomeDriver from "./page/driver/home/HomeDriver";
import { SearchProvider } from "./context/SearchContext";

const App = () => {
  return (
    <div>
      <SearchProvider>
        <AppRoute />
      </SearchProvider>
    </div>
  );
};

export default App;
