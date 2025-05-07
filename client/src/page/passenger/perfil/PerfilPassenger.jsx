import MainLayout from "../../../components/layout/MainLayout";
import { Mail, IdCard, User, Venus } from "lucide-react";

const PerfilPassenger = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* INFORMACIÓN PERSONAL */}
        <div className="bg-zinc-900 p-6 rounded-md flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div className="flex flex-col items-center text-center border border-zinc-700 p-8 rounded-md">
            <div className="w-32 h-32 bg-zinc-800 rounded-full flex items-center justify-center relative">
              <User className="w-20 h-20 text-yellow-500" />
            </div>
            <h2 className="mt-4 font-semibold text-white text-lg">
              Carlos Rodríguez
            </h2>
          </div>

          {/* Información */}
          <div className="flex-1 space-y-4">
            <h2 className="text-xl font-bold text-white">
              Información Personal
            </h2>
            <p className="text-zinc-400 text-sm">
              Actualiza tu información de perfil
            </p>
            {/* formulario */}
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="relative">
                <label className="text-lg font-semibold text-white">
                  Nombre
                </label>
                <input
                  type="text"
                  placeholder="Carlos Rodríguez"
                  value=""
                  className="w-full mt-1 p-2 pr-10 bg-zinc-800 rounded-md outline-none text-zinc-500"
                />
                <User
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 mt-5 text-zinc-500"
                  size={16}
                />
              </div>

              <div className="relative">
                <label className="text-lg font-semibold text-white">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value="carlos@ejemplo.com"
                  className="w-full mt-1 p-2 pr-10 bg-zinc-800 rounded-md outline-none text-zinc-500"
                />
                <Mail
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 mt-5 text-zinc-500"
                  size={16}
                />
              </div>

              <div className="relative">
                <label className="text-lg text-white font-semibold">Dni</label>
                <input
                  type="text"
                  value="123456789"
                  className="w-full mt-1 p-2 pr-10 bg-zinc-800 rounded-md outline-none text-zinc-500"
                />
                <IdCard
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 mt-5 text-zinc-500"
                  size={16}
                />
              </div>

              <div className="relative">
                <label className="text-lg text-white font-semibold">
                  Género
                </label>
                <select
                  value="Masculino"
                  className="w-full mt-1 p-2 pr-10 bg-zinc-800 rounded-md outline-none text-zinc-500 appearance-none"
                >
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Otro">Otro</option>
                </select>
                <Venus
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 mt-5 text-zinc-500"
                  size={16}
                />
              </div>
            </div>

            <button className="mt-4 bg-yellow-500 text-black px-4 py-2 rounded-md font-semibold hover:bg-yellow-400 transition cursor-pointer">
              Guardar Cambios
            </button>
          </div>
        </div>

        {/* SEGURIDAD */}
        <div className="bg-zinc-900 p-6 rounded-md space-y-4">
          <h2 className="text-xl font-bold">Seguridad</h2>
          <p className="text-zinc-400 text-sm">
            Gestiona la seguridad de tu cuenta
          </p>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold">Contraseña Actual</label>
              <input
                type="password"
                className="w-full mt-1 p-2 bg-zinc-800 rounded-md outline-none text-white"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold">
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  className="w-full mt-1 p-2 bg-zinc-800 rounded-md outline-none text-white"
                />
              </div>

              <div>
                <label className="text-sm font-semibold">
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  className="w-full mt-1 p-2 bg-zinc-800 rounded-md outline-none text-white"
                />
              </div>
            </div>

            <button className="mt-4 bg-yellow-500 text-black px-4 py-2 rounded-md font-semibold hover:bg-yellow-400 transition">
              Actualizar Contraseña
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PerfilPassenger;
