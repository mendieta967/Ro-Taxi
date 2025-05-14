// context/AuthContext.jsx
import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    token: null,
    role: null,
  });

  const login = async (credentials) => {
    // Simulando login con fetch
    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify(credentials),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (data.token) {
      setAuth({ isAuthenticated: true, token: data.token, role: data.role });
    }
  };

  const logout = () =>
    setAuth({ isAuthenticated: false, token: null, role: null });

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

{
  /* import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../services/auth";
import { useNavigate } from "react-router-dom"; 
const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
  const [user, setUser] = useState({
    accountStatus: "Active",
    email: "pedro@gmail.com",
    userId: "3",
    userName: "Pedro",
  });
  const [loading, setLoading] = useState(false);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const data = await getCurrentUser();
      setUser(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) return <h1>Cargando...</h1>;
  console.log(user);
  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("Auth context must be within provider");
  return context;
};
*/
}
