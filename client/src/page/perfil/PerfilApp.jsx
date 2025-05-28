import { useContext, useEffect, useState } from "react";
import FormProfile from "../../components/common/FormProfile";
import MainLayout from "../../components/layout/MainLayout";
import { Mail, IdCard, User, Venus, Lock } from "lucide-react";
import { useAuth } from "../../context/auth";
import { getUser } from "../../services/user";
import { ThemeContext } from "../../context/ThemeContext";
import {useTranslate} from '../../hooks/useTranslate'

const PerfilApp = () => {
  const {
    user: { userId },
  } = useAuth();
  const [user, setUser] = useState();
  const { theme } = useContext(ThemeContext);
  const translate = useTranslate();

  const fetchUser = async () => {
    try {
      const data = await getUser(userId);
      console.log({ data });
      setUser(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const personalFields = [
    {
      name: "nombre",
      label: translate("Nombre"),
      type: "text",
      value: user?.name,
      placeholder: translate("Nombre"),
      required: true,
      icon: <User className="text-zinc-500" size={16} />,
    },
    {
      name: "correo",
      label: translate("Correo Electrónico"),
      type: "email",
      value: user?.email,
      placeholder: translate("Ingrese su correo electrónico"),
      required: true,
      icon: <Mail className="text-zinc-500" size={16} />,
    },
    {
      name: "dni",
      label: translate("DNI"),
      type: "text",
      value: user?.dni,
      placeholder: translate("N° de DNI"),
      required: true,
      icon: <IdCard className="text-zinc-500" size={16} />,
    },
    {
      name: "genero",
      label: translate("Selecciona tu género"),
      type: "select",
      value: user?.genre,
      options: [
        { value: "Female", label: translate("Femenino") },
        { value: "Male", label: translate("Masculino") },
        { value: "Other", label: translate("Otro") },
      ],
      required: true,
      icon: <Venus className="text-zinc-500" size={16} />,
    },
  ];

  const securityFields = [
    {
      name: "currentPassword",
      label: translate("Contraseña Actual"),
      type: "password",
      value: user?.password,
      placeholder: "********",
      required: true,
      icon: <Lock className="text-zinc-500" size={16} />,
    },
    {
      name: "newPassword",
      label: translate("Nueva Contraseña"),
      type: "password",
      placeholder: "********",
      required: true,
      icon: <Lock className="text-zinc-500" size={16} />,
    },
    {
      name: "confirmPassword",
      label: translate("Confirmar Contraseña"),
      type: "password",
      placeholder: "********",
      required: true,
      icon: <Lock className="text-zinc-500" size={16} />,
    },
  ];

  const handlePasswordSubmit = (data, resetForm) => {
    if (data.newPassword !== data.confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }
    console.log("Datos de seguridad:", data);
    resetForm();
  };

  const handleFormSubmit = (data, resetForm) => {
    console.log("Datos del formulario:", data);
    resetForm();
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* INFORMACIÓN PERSONAL */}
        <div className={`p-6 rounded-md flex flex-col md:flex-row gap-6 ${theme === 'dark' ? 'bg-zinc-900' : 'bg-white border border-yellow-500'}`}>
          {/* Avatar */}
          <div className={`flex flex-col items-center text-center  ${theme === 'dark' ? 'border border-zinc-700' : 'border border-yellow-500'} p-8 rounded-md`}>
            <div className={`w-32 h-32  rounded-full flex items-center justify-center relative ${theme === 'dark' ? 'bg-zinc-800' : 'bg-yellow-500'} `}>
              <User className={`w-20 h-20 ${theme === 'dark' ? 'text-yellow-500' : 'text-white'}`} />
            </div>
            <h2 className={`mt-4 font-semibold ${theme === 'dark' ? 'text-yellow-500' : 'text-gray-900'} text-2xl`}>
              {user?.name}
            </h2>
          </div>

          {/* Información */}
          <div className="flex-1 space-y-4">
            <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-yellow-500' : 'text-gray-900'}`}>
              {translate("Información Personal")}
            </h2>
            <p className={`text-zinc-400 text-sm ${theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'}`}>
              {translate("Actualiza tu información de perfil")}
            </p>

            <FormProfile
              fields={personalFields}
              submitText={translate("Guardar Cambios")}
              onSubmit={handleFormSubmit}
            />
          </div>
        </div>
        {/* SEGURIDAD */}
        <div className={`p-6 rounded-md space-y-4 ${theme === 'dark' ? 'bg-zinc-900' : 'bg-white border border-yellow-500'}`}>
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-yellow-500' : 'text-gray-900'}`}>{translate("Seguridad")}</h2>
          <p className={`text-zinc-400 text-sm ${theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'}`}>
            {translate("Gestiona la seguridad de tu cuenta")}
          </p>

          <FormProfile
            fields={securityFields}
            submitText={translate("Actualizar Contraseña")}
            onSubmit={handlePasswordSubmit}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default PerfilApp;
