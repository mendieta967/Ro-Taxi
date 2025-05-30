import { useState, useRef } from "react";
import Form from "../../../components/common/Form";
import { FaGoogle, FaFacebookF, FaGithub } from "react-icons/fa";
import { linkGithubProvider } from "../../../services/auth";
import { useAuth } from "../../../context/auth";

const Login = ({ onSwitch }) => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const { login } = useAuth();

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
  ];

  const handleLogin = async (formData) => {
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

    console.log("Login del usuario:", formData);
    try {
      await login(formData);
    } catch (error) {
      alert("Correo o contraseña incorrectos");
      console.error("Error al intentar iniciar sesión:", error);
    }
  };

  const githubLink = linkGithubProvider();

  return (
    <div className="min-h-screen w-full bg-gray-800/95 flex items-center justify-center px-4">
      <div className="w-full max-w-md p-6 sm:p-8 bg-gray-900 rounded-3xl shadow-2xl shadow-yellow-600">
        <h1
          onClick={handleLogin}
          className="text-center text-4xl font-bold text-yellow-500 mb-6 tracking-tight"
        >
          Iniciar sesión
        </h1>
        <Form
          fields={loginFields}
          onSubmit={handleLogin}
          errors={errors}
          refs={{ email: emailRef, password: passwordRef }}
          submitText="Iniciar sesión"
        />
        <div className="text-center mt-2">
          <button className="cursor-pointer text-zinc-600 hover:underline">
            ¿Has olvidado la contraseña?
          </button>
        </div>

        <div className="text-center my-6">
          <p className="text-gray-300 mb-2">Continuar con:</p>
          <div className="flex justify-center gap-3">
            <button className="bg-red-500 hover:bg-red-600 text-white font-semibold p-2 rounded-full cursor-pointer">
              <FaGoogle />
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold p-2 rounded-full cursor-pointer">
              <FaFacebookF />
            </button>
            <a
              href={githubLink}
              className="bg-gray-800 hover:bg-gray-900 text-white font-semibold p-2 rounded-full cursor-pointer"
            >
              <FaGithub />
            </a>
          </div>
        </div>

        <hr className="my-6 border-gray-600" />

        <div className="text-center text-sm">
          <p className="text-gray-400">¿No tienes una cuenta?</p>
          <button
            onClick={onSwitch}
            className=" text-yellow-500 font-semibold hover:underline hover:text-yellow-700 transition-colors cursor-pointer"
          >
            Crear una cuenta
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
