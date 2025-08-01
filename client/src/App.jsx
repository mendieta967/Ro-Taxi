import AppRoute from "./router/AppRoute";
import { SearchProvider } from "./context/SearchContext";
import { ThemeProvider } from "./context/ThemeContext";
import { TranslateProvider } from "./context/TranslateLanguage";
import ConnectionProvider from "./context/ConnectionContext";
import VehicleProvider from "./context/VehicleContext";
import { RideProvider } from "./context/rideContext";
import { ChatProvider } from "./context/ChatContext";
import { Toaster } from "sonner";

const App = () => {
  return (
    <ConnectionProvider>
      <ThemeProvider>
        <TranslateProvider>
          <SearchProvider>
            <VehicleProvider>
              <RideProvider>
                <ChatProvider>
                  <AppRoute />
                </ChatProvider>
              </RideProvider>
            </VehicleProvider>
          </SearchProvider>
        </TranslateProvider>
      </ThemeProvider>
      <Toaster />
    </ConnectionProvider>
  );
};

export default App;
