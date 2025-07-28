import Button from "../../components/common/Button";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div>
      {/* <LandingNavBar /> /> */}
      <section className="relative min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-center px-4 overflow-hidden">
        {/* 🎥 Video de fondo */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover brightness-[0.4] z-0"
        >
          <source src="videoFondo1.mp4" type="video/mp4" />
          Tu navegador no soporta video HTML5.
        </video>

        {/* ✅ Contenido delante del video */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-44 lg:h-44 object-contain border-2 border-yellow-600 rounded-full transform hover:scale-105 transition duration-300 shadow-lg mb-6"
          />

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-yellow-500 mb-4">
            Bienvenido a RO-TAXI
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-200 max-w-2xl mb-8 px-2">
            Tu servicio de taxi de confianza. Rápido, seguro y al mejor precio.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button
              variant="outline"
              className="px-6 py-2 sm:px-8 sm:py-3 text-base sm:text-lg cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Pedir un taxi
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
