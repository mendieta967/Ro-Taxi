import { useState } from "react";
import Login from "./login/Login";
import Register from "./register/Register";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/auth";

const AuthPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  const backgroundImage = isRegistering
    ? "url('/rosario.jpg')"
    : "url('/rosario2.jpg')";

  const { user } = useAuth();

  if (user) return <Navigate to="/" replace />;

  return (
    <div
      className={`w-full h-screen flex transition-all duration-500 ease-in-out relative ${
        isRegistering ? "flex-row-reverse" : "flex-row"
      }`}
    >
      {/* Formulario */}
      <div className="w-full sm:w-1/2 h-full flex items-center justify-center bg-white ease-in-out">
        {isRegistering ? (
          <Register onSwitch={() => setIsRegistering(false)} />
        ) : (
          <Login onSwitch={() => setIsRegistering(true)} />
        )}
      </div>

      {/* Imagen dinámica (oculta en móviles) */}
      <div
        className="hidden sm:flex w-1/2 h-full bg-cover bg-center ease-in-out"
        style={{
          backgroundImage,
        }}
      ></div>
    </div>
  );
};

export default AuthPage;
