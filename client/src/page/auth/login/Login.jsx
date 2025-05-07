import { useState, useRef } from "react";
import Form from "../../../components/common/Form";
import { FaGoogle, FaFacebookF, FaGithub } from "react-icons/fa";

const Login = ({ onSwitch }) => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const [userType, setUserType] = useState("");
  const [errors, setErrors] = useState({
    email: false,
    password: false,
  });

  const loginFields = [
    {
      name: "email",
      label: "Correo electrónico",
      type: "email",
      placeholder: "Correo electrónico",
      required: true,
      autoComplete: "email",
      autoFocus: true,
    },
    {
      name: "password",
      label: "Contraseña",
      type: "password",
      placeholder: "Contraseña",
      required: true,
      autoComplete: "current-password",
    },
    {
      name: "userType",
      type: "hidden",
      required: true,
    },
  ];

  const handleLogin = (formData) => {
    setErrors({ email: false, password: false });

    const isValidEmail = (email) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

    if (!isValidEmail(formData.email)) {
      emailRef.current.focus();
      setErrors((prev) => ({ ...prev, email: true }));
      return;
    }

    if (!formData.password.trim() || formData.password.length < 6) {
      passwordRef.current.focus();
      setErrors((prev) => ({ ...prev, password: true }));
      return;
    }

    if (!formData.userType) {
      alert("Debes seleccionar si eres Pasajero o Taxista.");
      return;
    }

    console.log("Login del usuario:", formData);
    // Autenticación con API aquí
  };

  const handleUserTypeSelect = (type) => {
    setUserType(type);
  };

  return (
    <div className="min-h-screen w-full bg-gray-800/95 flex items-center justify-center px-4">
      <div className="w-full max-w-md p-6 sm:p-8 bg-gray-900 rounded-3xl shadow-2xl shadow-yellow-600">
        <h1 className="text-center text-4xl font-bold text-yellow-500 mb-6 tracking-tight">
          Iniciar sesión
        </h1>
        <Form
          fields={loginFields}
          onSubmit={handleLogin}
          errors={errors}
          refs={{ email: emailRef, password: passwordRef }}
          submitText="Iniciar sesión"
          extraValues={{ userType }}
          extraContent={
            <div className="flex justify-center gap-4 mb-6 flex-wrap">
              {["pasajero", "taxista"].map((type) => (
                <label
                  key={type}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm cursor-pointer transition-all shadow-sm
                    ${
                      userType === type
                        ? "bg-cyan-50 border-yellow-600 text-yellow-700 font-semibold"
                        : "bg-yellow-50 border-gray-300 hover:border-yellow-400 hover:bg-cyan-50"
                    }`}
                >
                  <input
                    type="radio"
                    name="userType"
                    value={type}
                    checked={userType === type}
                    onChange={(e) => handleUserTypeSelect(e.target.value)}
                    className="accent-yellow-600"
                  />
                  <span className="capitalize">{type}</span>
                </label>
              ))}
            </div>
          }
        />

        <div className="text-center my-6">
          <p className="text-gray-300 mb-2">Continuar con:</p>
          <div className="flex justify-center gap-3">
            <button className="bg-red-500 hover:bg-red-600 text-white font-semibold p-2 rounded-full cursor-pointer">
              <FaGoogle />
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold p-2 rounded-full cursor-pointer">
              <FaFacebookF />
            </button>
            <button className="bg-gray-800 hover:bg-gray-900 text-white font-semibold p-2 rounded-full cursor-pointer">
              <FaGithub />
            </button>
          </div>
        </div>

        <hr className="my-6 border-gray-600" />

        <div className="text-center text-sm">
          <p className="text-gray-400">¿No tienes una cuenta?</p>
          <button
            onClick={onSwitch}
            className=" text-yellow-500 font-semibold hover:underline hover:text-yellow-700 transition-colors"
          >
            Crear una cuenta
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
