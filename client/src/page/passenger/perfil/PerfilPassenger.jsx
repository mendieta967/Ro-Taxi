import FormProfile from "../../../components/common/FormProfile";
import MainLayout from "../../../components/layout/MainLayout";
import { Mail, IdCard, User, Venus, Lock } from "lucide-react";

const PerfilPassenger = () => {
  {
    /* const {
    user: { userId },
  } = useAuth();
  const [user, setUser] = useState();

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
  }, []);/*/
  }

  const personalFields = [
    {
      name: "nombre",
      label: "Nombre",
      type: "text",
      placeholder: "Nombre",
      required: true,
      icon: <User className="text-zinc-500" size={16} />,
    },
    {
      name: "correo",
      label: "Correo Electrónico",
      type: "email",
      placeholder: "Correo Electrónico",
      required: true,
      icon: <Mail className="text-zinc-500" size={16} />,
    },
    {
      name: "dni",
      label: "DNI",
      type: "text",
      placeholder: "N° de DNI",
      required: true,
      icon: <IdCard className="text-zinc-500" size={16} />,
    },
    {
      name: "genero",
      label: "Género",
      type: "select",
      options: [
        { value: "Masculino", label: "Masculino" },
        { value: "Femenino", label: "Femenino" },
        { value: "Otro", label: "Otro" },
      ],
      required: true,
      icon: <Venus className="text-zinc-500" size={16} />,
    },
  ];

  const securityFields = [
    {
      name: "currentPassword",
      label: "Contraseña Actual",
      type: "password",
      placeholder: "********",
      required: true,
      icon: <Lock className="text-zinc-500" size={16} />,
    },
    {
      name: "newPassword",
      label: "Nueva Contraseña",
      type: "password",
      placeholder: "********",
      required: true,
      icon: <Lock className="text-zinc-500" size={16} />,
    },
    {
      name: "confirmPassword",
      label: "Confirmar Contraseña",
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
        <div className="bg-zinc-900 p-6 rounded-md flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div className="flex flex-col items-center text-center border border-zinc-700 p-8 rounded-md">
            <div className="w-32 h-32 bg-zinc-800 rounded-full flex items-center justify-center relative">
              <User className="w-20 h-20 text-yellow-500" />
            </div>
            <h2 className="mt-4 font-semibold text-white text-lg">
              Carlos Gonzales
            </h2>
          </div>

          {/* Información */}
          <div className="flex-1 space-y-4">
            <h2 className="text-2xl font-bold text-white">
              Información Personal
            </h2>
            <p className="text-zinc-400 text-sm">
              Actualiza tu información de perfil
            </p>

            <FormProfile
              fields={personalFields}
              submitText="Guardar Cambios"
              onSubmit={handleFormSubmit}
            />
          </div>
        </div>
        {/* SEGURIDAD */}
        <div className="bg-zinc-900 p-6 rounded-md space-y-4">
          <h2 className="text-2xl text-white font-bold">Seguridad</h2>
          <p className="text-zinc-400 text-sm">
            Gestiona la seguridad de tu cuenta
          </p>

          <FormProfile
            fields={securityFields}
            submitText="Actualizar Contraseña"
            onSubmit={handlePasswordSubmit}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default PerfilPassenger;
