import React, { useRef, useState } from "react";
import { Mail, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { passwordReset } from "../../../services/user";

const RecoverPassword = () => {
  const emailRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRecover = async (e) => {
    e.preventDefault(); // evitar reload
    const email = emailRef.current.value;

    if (!email || !email.includes("@")) {
      setErrors({ email: "Correo inválido" });
      setMessage("");
      return;
    }

    try {
      setErrors({});
      setIsLoading(true);

      await passwordReset(email); // llamar al servicio

      setIsLoading(false);
      setIsSuccess(true);
      setMessage(
        "✅ Si el correo existe, recibirás un mensaje con instrucciones."
      );
      emailRef.current.value = "";
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setErrors({ email: "Error al enviar, intenta nuevamente." });
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-800/95 flex items-center justify-center px-4">
      <div className="w-full max-w-md p-6 sm:p-8 bg-gray-900 rounded-3xl shadow-2xl shadow-yellow-600">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
              <Mail className="w-8 h-8 text-gray-900" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-yellow-500 mb-2 tracking-tight">
            Recuperar contraseña
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Ingresa tu correo electrónico y te enviaremos las instrucciones para
            restablecer tu contraseña
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {!isSuccess ? (
            <form onSubmit={handleRecover} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300"
                >
                  Correo electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    ref={emailRef}
                    id="email"
                    type="email"
                    placeholder="ejemplo@correo.com"
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 bg-gray-800 text-gray-300 placeholder-gray-500 ${
                      errors.email
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                        : "border-gray-600 focus:border-yellow-500 focus:ring-yellow-500/20"
                    }`}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-400 flex items-center gap-2 mt-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.email}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full cursor-pointer py-3 px-4 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar instrucciones"
                )}
              </button>
            </form>
          ) : (
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-yellow-400 leading-relaxed">
                  {message}
                </p>
              </div>
            </div>
          )}

          <hr className="my-6 border-gray-600" />
          <Link to="/login">
            <div className="text-center">
              <button className="text-zinc-600 hover:underline hover:text-yellow-500 transition-colors duration-200 flex items-center justify-center gap-2 mx-auto cursor-pointer">
                <ArrowLeft className="w-4 h-4" />
                Volver al inicio de sesión
              </button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecoverPassword;
