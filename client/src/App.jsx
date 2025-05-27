import AppRoute from "./router/AppRoute";
import { SearchProvider } from "./context/SearchContext";
import { ThemeProvider } from "./context/ThemeContext";

const App = () => {
  return (
    <ThemeProvider>
      <SearchProvider>
        <AppRoute />
      </SearchProvider>
    </ThemeProvider>
  );
};

export default App;
