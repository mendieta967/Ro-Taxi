import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { recoverPassword } from "../../../services/user";
import { toast } from "sonner";

const PasswordRecover = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const t = searchParams.get("token");
    if (!t) {
      toast.error("❌ Token inválido");
    } else {
      setToken(t);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      console.log("datos enviados", token, password);
      const response = await recoverPassword(token, password);
      console.log("Respuesta del backend:", response);
      toast.success("✅ Contraseña cambiada exitosamente");
      setSubmitted(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      console.error(err);
      toast.error("❌ Error al cambiar la contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-yellow-400 px-4 py-12">
      {!token ? (
        <p className="text-center text-lg font-semibold bg-red-700/30 p-6 rounded-xl shadow-md">
          Token inválido o expirado.
        </p>
      ) : submitted ? (
        <p className="text-center text-lg font-semibold bg-green-700/30 p-6 rounded-xl shadow-md">
          Contraseña cambiada correctamente. Redirigiendo...
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6 border border-yellow-500/20"
        >
          <h1 className="text-3xl font-extrabold text-center tracking-wide">
            Nueva contraseña
          </h1>

          <input
            type="password"
            placeholder="Ingresa tu nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-700 text-yellow-300 placeholder-yellow-500 border border-yellow-500/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200"
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Repite tu contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-gray-700 text-yellow-300 placeholder-yellow-500 border border-yellow-500/30 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200"
            disabled={loading}
          />

          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 rounded-lg transition-all duration-200 disabled:opacity-50 shadow-lg"
            disabled={loading}
          >
            {loading ? "Cambiando..." : "Cambiar contraseña"}
          </button>
        </form>
      )}
    </div>
  );
};

export default PasswordRecover;
