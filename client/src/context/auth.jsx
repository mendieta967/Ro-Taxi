import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../services/auth";
import { loginUser } from "../services/auth";
import { logoutUser } from "../services/auth";
import Loader from "../components/common/Loader";

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
      setLoading(false);
      setTimeout(() => setProgress(0), 500);
    }
  };

  const login = async (formData) => {
    try {
      setLoading(true);
      await loginUser(formData);
      fetchUser();
    } catch (error) {
      alert(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await logoutUser();
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
    <AuthContext.Provider value={{ user, login, logout, progress }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("Auth context must be within provider");
  return context;
};
