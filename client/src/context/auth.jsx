import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../services/auth";
import { loginUser } from "../services/auth";
import { logoutUser } from "../services/auth";
const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const data = await getCurrentUser();
      setUser(data);
    } catch (error) {
      console.log(error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (formData) => {
    try {
      await loginUser(formData);
      fetchUser();
    } catch (error) {
      console.log(error);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) return <h1>Cargando...</h1>;

  console.log(user);
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("Auth context must be within provider");
  return context;
};
