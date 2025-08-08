import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../services/auth";
import { loginUser } from "../services/auth";
import { logoutUser } from "../services/auth";
import Loader from "../components/common/Loader";
import { toast } from "sonner";

const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const simulateProgress = async () => {
    setProgress(0);
    for (let i = 1; i <= 10; i++) {
      await new Promise((r) => setTimeout(r, 50)); // simula avance
      setProgress(i * 10);
    }
  };
  const fetchUser = async () => {
    try {
      setLoading(true);
      await simulateProgress();
      const data = await getCurrentUser();
      setUser(data);
      setProgress(100);
    } catch (error) {
      console.log(error);
      setUser(null);
    } finally {
      setTimeout(() => {
        setLoading(false);
        setTimeout(() => setProgress(0), 300);
      }, 150);
    }
  };

  const login = async (formData) => {
    try {
      const response = await loginUser(formData);
      console.log("Response: capturando el error", response.error);
      await fetchUser();
    } catch (error) {
      console.log("Error completo:", error); // 👈 Esto es clave para ver la estructura

      if (error.message === "Banned Account") {
        toast(
          "❌ Cuenta eliminada o deshabilitada. Contacta al administrador."
        );
      } else if (error.message === "Password or email are invalid") {
        toast("❌ Credenciales incorrectas, ingrese nuevamente.");
      } else {
        toast("❌ Error inesperado");
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await logoutUser();
      localStorage.clear();
      setUser(null);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) return <Loader progress={progress} />;

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("Auth context must be within provider");
  return context;
};
