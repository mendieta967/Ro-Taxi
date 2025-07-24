import AppRoute from "./router/AppRoute";
import { SearchProvider } from "./context/SearchContext";
import { ThemeProvider } from "./context/ThemeContext";
import { TranslateProvider } from "./context/TranslateLanguage";
import ConnectionProvider from "./context/ConnectionContext";

const App = () => {
  return (
    <ThemeProvider>
      <TranslateProvider>
        <SearchProvider>
          <ConnectionProvider>
            <AppRoute />
          </ConnectionProvider>
        </SearchProvider>
      </TranslateProvider>
    </ThemeProvider>
  );
};

export default App;
