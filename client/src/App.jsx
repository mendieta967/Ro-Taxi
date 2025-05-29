import AppRoute from "./router/AppRoute";
import { SearchProvider } from "./context/SearchContext";
import { ThemeProvider } from "./context/ThemeContext";
import { TranslateProvider } from "./context/TranslateLanguage";

const App = () => {
  return (
    <ThemeProvider>
      <TranslateProvider>
        <SearchProvider>
          <AppRoute />
        </SearchProvider>
      </TranslateProvider>
    </ThemeProvider>
  );
};

export default App;
