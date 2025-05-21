import AppRoute from "./router/AppRoute";
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
