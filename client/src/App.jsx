import AppRoute from "./router/AppRoute";
import { SearchProvider } from "./context/SearchContext";
import { ThemeProvider } from "./context/ThemeContext";
import { TranslateProvider } from "./context/TranslateLanguage";
import ConnectionProvider from "./context/ConnectionContext";
import VehicleProvider from "./context/VehicleContext";

const App = () => {
  return (
    <ConnectionProvider>
      <ThemeProvider>
        <TranslateProvider>
          <SearchProvider>
            <VehicleProvider>
              <AppRoute />
            </VehicleProvider>
          </SearchProvider>
        </TranslateProvider>
      </ThemeProvider>
    </ConnectionProvider>
  );
};

export default App;
