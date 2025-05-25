const NotFound = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-zinc-900 to-zinc-900 flex items-center justify-center z-50">
      <div className="relative bg-gray-900 w-[90%] max-w-sm rounded-3xl p-8 text-white text-center shadow-2xl border border-yellow-500/20">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 transform">
          <div className="h-20 w-20 rounded-full bg-yellow-500/20 border-4 border-yellow-500 flex items-center justify-center animate-pulse">
            <span className="text-4xl animate-bounce">🚕</span>
          </div>
        </div>
        <div className="mt-12">
          <h2 className="text-2xl font-extrabold text-yellow-500 mb-2">
            No encontramos la página
          </h2>
          <p className="text-zinc-400 text-sm mb-6">
            Puede que el enlace esté roto o la página haya sido movida.
          </p>
          <a
            href="/"
            className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-6 rounded-full transition-all duration-300 shadow-lg"
          >
            Volver al Inicio
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
