import AppRoute from "./router/AppRoute";
import { SearchProvider } from "./context/SearchContext";
import { ThemeProvider } from "./context/ThemeContext";
import { TranslateProvider } from "./context/TranslateLanguage";
import ConnectionProvider from "./context/ConnectionContext";
import VehicleProvider from "./context/VehicleContext";
import { RideProvider } from "./context/rideContext";

const App = () => {
  return (
    <ConnectionProvider>
      <ThemeProvider>
        <TranslateProvider>
          <SearchProvider>
            <VehicleProvider>
              <RideProvider>
                <AppRoute />
              </RideProvider>
            </VehicleProvider>
          </SearchProvider>
        </TranslateProvider>
      </ThemeProvider>
    </ConnectionProvider>
  );
};

export default App;
