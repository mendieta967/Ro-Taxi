import { useState, useRef } from "react";
import Form from "../../../components/common/Form";
import { registerUser } from "../../../services/auth";
import { toast } from "sonner";

const Register = ({ onSwitch }) => {
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const dniRef = useRef(null);
  const generoRef = useRef(null);

  const [userType, setUserType] = useState("");

  const [errors, setErrors] = useState({
    name: false,
    email: false,
    password: false,
    dni: false,
    genre: false,
  });

  const registerFields = [
    {
      name: "name",
      label: "Nombre",
      type: "text",
      placeholder: "Ingrese su nombre",
      required: true,
      autoComplete: "name",
      autoFocus: true,
    },
    {
      name: "dni",
      label: "DNI",
      type: "text",
      placeholder: "Ingrese su DNI",
      required: true,
      autoComplete: "dni",
    },
    {
      name: "email",
      label: "Correo electrónico",
      type: "email",
      placeholder: "Correo electrónico",
      required: true,
      autoComplete: "email",
    },
    {
      name: "password",
      label: "Contraseña",
      type: "password",
      placeholder: "Contraseña",
      required: true,
      autoComplete: "current-password",
    },
    {
      name: "genre",
      label: "Género",
      type: "select",
      required: true,
      options: [
        { label: "Selecciona tu género", value: "" },
        { label: "Masculino", value: "Male" },
        { label: "Femenino", value: "Female" },
        { label: "Otro", value: "Other" },
      ],
    },
  ];

  const handleRegister = async (formData, resetForm) => {
    setErrors({
      name: false,
      email: false,
      password: false,
      dni: false,
      genero: false,
    });

    if (!formData.name.trim()) {
      setErrors((prev) => ({ ...prev, name: true }));
      nameRef.current.focus();
      return;
    }
    const isValidEmail = (email) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

    if (!isValidEmail(formData.email)) {
      emailRef.current.focus();
      setErrors((prev) => ({ ...prev, email: true }));
      return;
    }

    if (!formData.password.trim() || formData.password.length < 6) {
      setErrors((prev) => ({ ...prev, password: true }));
      passwordRef.current.focus();
      return;
    }

    if (!formData.dni.trim() || formData.dni.length < 8) {
      setErrors((prev) => ({ ...prev, dni: true }));
      dniRef.current.focus();
      return;
    }

    if (!formData.genre) {
      setErrors((prev) => ({ ...prev, genre: true }));
      generoRef.current.focus();
      return;
    }

    if (!userType || (userType !== "taxista" && userType !== "pasajero")) {
      alert("Debes seleccionar si eres Pasajero o Taxista.");
      return;
    }

    console.log("Registro del usuario:", formData);

    resetForm();
    setUserType("");
    onSwitch();

    try {
      const res = await registerUser(formData);
      console.log("Respuesta del servidor:", res);

      if (res.status === 201) {
        toast.success("✅ Usuario registrado con éxito", {
          description: "El usuario fue registrado correctamente.",
        });
        resetForm();
      }
    } catch (error) {
      toast.error("❌ Error al registrar usuario", {
        description:
          "Por favor, revisá los datos ingresados o intentá más tarde.",
      });
      console.error(error);
    }
  };

  return (
    <div className="w-full h-full bg-gray-800/95 flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-md p-4 sm:p-8 bg-gray-900 rounded-3xl shadow-2xl shadow-yellow-600 transition-all">
        <h1 className="text-center text-4xl font-bold text-yellow-500 mb-6 tracking-tight">
          Crear cuenta
        </h1>
        <Form
          fields={registerFields}
          onSubmit={handleRegister}
          submitText="Registrarse"
          refs={{
            name: nameRef,
            email: emailRef,
            password: passwordRef,
            dni: dniRef,
            genre: generoRef,
          }}
          errors={errors}
          extraValues={{ role: userType === "taxista" ? "Driver" : "Client" }}
          extraContent={
            <>
              <div className="flex justify-center gap-4 mb-6">
                {["pasajero", "taxista"].map((type) => (
                  <label
                    key={type}
                    className={`flex bg-yellow-50 text-black items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-all duration-200 cursor-pointer shadow-sm ${
                      userType === type
                        ? "bg-cyan-50 border-yellow-600 text-yellow-700 font-semibold"
                        : "border-gray-300 hover:border-yellow-400 hover:bg-cyan-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="userType"
                      value={type}
                      checked={userType === type}
                      onChange={(e) => setUserType(e.target.value)}
                      className="accent-yellow-600"
                    />

                    <span className="capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </>
          }
        />
        <div className="text-center mt-4 text-sm">
          <p className="text-gray-400">¿Ya tienes una cuenta?</p>
          <button
            onClick={onSwitch}
            className="text-yellow-600 font-semibold hover:underline hover:text-yellow-800 transition-colors cursor-pointer"
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
