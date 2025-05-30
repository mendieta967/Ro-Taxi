import Button from "../../components/common/Button";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div>
      {/* <LandingNavBar /> /> */}
      <section className="pt-45 min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-center px-4">
        <div className="flex flex-col items-center">
          <img
            src="/logo.png"
            alt=""
            className="w-28 h-28 md:w-32 md:h-32 object-contain border-2 border-yellow-600 rounded-full transform hover:scale-105 transition duration-300 shadow-lg"
          />
          <h1 className="text-4xl md:text-6xl font-bold text-yellow-500 mb-6">
            Bienvenido a RO-TAXI
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mb-8">
            Tu servicio de taxi de confianza. Rápido, seguro y al mejor precio.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button
            variant="primary"
            className="px-8 py-3 text-base cursor-pointer"
          >
            Pedir un taxi
          </Button>
          <Button
            variant="outline"
            className="px-8 py-3 text-base cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Soy conductor
          </Button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
