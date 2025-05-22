import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../services/auth";
import { loginUser } from "../services/auth";
import { logoutUser } from "../services/auth";
import Loader from "../components/common/Loader";
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
      setLoading(true);
      await loginUser(formData);
      fetchUser();
    } catch (error) {
      console.log(error);
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

  if (loading) return <Loader />;

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
