import { useRef, useState } from "react";
import Form from "../../../components/common/Form";
import { completeAccount } from "../../../services/auth";
import { Navigate, useNavigate } from "react-router-dom";
//import { useAuth } from "../../../context/auth";

const CompleteAccount = () => {
  //const { user } = useAuth();

  const dniRef = useRef(null);
  const genreRef = useRef(null);

  const [role, setRole] = useState("");
  const [errors, setErrors] = useState({
    dni: false,
    genero: false,
  });

  const navigate = useNavigate();

  // if (user.accountStatus !== "Pending") return <Navigate to="/" replace />;

  const completeFields = [
    {
      name: "dni",
      label: "DNI",
      type: "text",
      placeholder: "Ingrese su DNI",
      required: true,
      autoComplete: "dni",
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
    {
      name: "role",
      type: "hidden",
      required: true,
    },
  ];

  const handleSubmit = async (formData, resetForm) => {
    setErrors({
      dni: false,
      genre: false,
    });

    if (!formData.dni.trim() || formData.dni.length < 8) {
      setErrors((prev) => ({ ...prev, dni: true }));
      dniRef.current.focus();
      return;
    }

    if (!formData.genre) {
      setErrors((prev) => ({ ...prev, genre: true }));
      genreRef.current.focus();
      return;
    }

    if (!formData.role) {
      alert("Debes seleccionar si eres Pasajero o Taxista.");
      return;
    }

    try {
      await completeAccount(formData);
      resetForm();
      setRole("");
      navigate("/", { replace: true });
    } catch (error) {
      console.log(error);
    }
  };

  const handleRoleSelect = (type) => {
    setRole(type);
  };

  return (
    <div className="min-h-screen w-full bg-gray-800/95 flex items-center justify-center px-4">
      <div className="w-full max-w-md p-6 sm:p-8 bg-gray-900 rounded-3xl ">
        <h1 className="text-center text-4xl font-bold text-yellow-500 mb-6 tracking-tight">
          Completar cuenta
        </h1>
        <Form
          fields={completeFields}
          onSubmit={handleSubmit}
          submitText="Completar"
          refs={{
            dni: dniRef,
            genero: genreRef,
          }}
          errors={errors}
          extraValues={{ role }}
          extraContent={
            <div className="flex justify-center gap-4 mb-6">
              {[
                { title: "pasajero", value: "Client" },
                { title: "taxista", value: "Driver" },
              ].map((type, i) => (
                <label
                  key={i}
                  className={`flex bg-yellow-50 items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-all duration-200 cursor-pointer shadow-sm ${
                    role === type.value
                      ? "bg-cyan-50 border-yellow-600 text-yellow-700 font-semibold"
                      : "border-gray-300 hover:border-yellow-400 hover:bg-cyan-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={type.value}
                    checked={role === type.value}
                    onChange={(e) => handleRoleSelect(e.target.value)}
                    className="accent-yellow-600"
                  />
                  <span className="capitalize">{type.title}</span>
                </label>
              ))}
            </div>
          }
        />
      </div>
    </div>
  );
};

export default CompleteAccount;
