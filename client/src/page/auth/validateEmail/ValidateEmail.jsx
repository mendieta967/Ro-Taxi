import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyEmail } from "../../../services/auth";
import { toast } from "sonner";

const ValidateEmail = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token || token.trim() === "") {
      toast.error("Token no válido");
      setLoading(false);
      return;
    }

    const verify = async () => {
      try {
        await verifyEmail(token);
        toast.success("✅ Correo verificado con éxito", { duration: 3000 });
      } catch (error) {
        toast.error("❌ No se pudo verificar el correo");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [searchParams]);

  return (
    <main className="h-screen bg-gray-900 flex flex-col items-center justify-center text-yellow-400 px-4">
      {loading ? (
        <div className="flex flex-col items-center gap-4">
          <svg
            className="animate-spin h-12 w-12 text-yellow-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          <h2 className="text-2xl font-semibold">Verificando correo...</h2>
        </div>
      ) : (
        <div className="max-w-md text-center space-y-6">
          <h2 className="text-3xl font-bold mb-2">
            ¡Gracias por verificar tu correo!
          </h2>
          <p className="text-yellow-300">
            Ahora puedes iniciar sesión para continuar.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 px-6 py-3 cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-lg shadow-lg transition duration-300"
          >
            Ir a Login
          </button>
        </div>
      )}
    </main>
  );
};

export default ValidateEmail;
