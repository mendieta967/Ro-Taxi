const Loader = ({ progress = 0 }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 z-[2000] flex items-center justify-center">
      {/* Fondo con efectos de luz */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Círculos concéntricos animados */}
        <div className="relative flex items-center justify-center w-40 h-40">
          {/* Ondas expansivas */}
          <div className="absolute w-full h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-20 animate-ping animation-delay-0"></div>
          <div className="absolute w-32 h-32 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-30 animate-ping animation-delay-500"></div>
          <div className="absolute w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-40 animate-ping animation-delay-1000"></div>

          {/* Anillo orbital externo */}
          <div className="absolute w-36 h-36 border-4 border-dashed border-yellow-400/40 rounded-full animate-spin-slow"></div>

          {/* Anillo orbital medio */}
          <div className="absolute w-28 h-28 border-2 border-dotted border-orange-400/50 rounded-full animate-spin-reverse"></div>

          {/* Círculo central con gradiente */}
          <div className="relative z-20 flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 rounded-full shadow-2xl shadow-yellow-500/50">
            <div className="absolute inset-1 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full"></div>
            <div className="relative z-10 text-3xl animate-bounce">🚕</div>
          </div>

          {/* Partículas flotantes */}
          <div className="absolute w-2 h-2 bg-yellow-400 rounded-full top-4 left-8 animate-ping animation-delay-200"></div>
          <div className="absolute w-1 h-1 bg-orange-400 rounded-full bottom-6 right-6 animate-ping animation-delay-700"></div>
          <div className="absolute w-1.5 h-1.5 bg-yellow-500 rounded-full top-8 right-4 animate-ping animation-delay-1200"></div>
        </div>

        {/* Texto de carga con efecto de escritura */}
        <div className="mt-8 flex flex-col items-center space-y-2">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent animate-pulse">
            Cargando:{progress}%
          </h2>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce animation-delay-0"></div>
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce animation-delay-200"></div>
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce animation-delay-400"></div>
          </div>
        </div>

        {/* Barra de progreso animada */}
        <div className="mt-6 w-64 h-1 bg-yellow-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
