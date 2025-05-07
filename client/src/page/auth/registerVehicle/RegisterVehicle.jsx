import Form from "../../../components/common/Form";
import { useRef, useState } from "react";

const RegisterVehicle = ({ userHasVehicle = false }) => {
  const patenteRef = useRef(null);
  const marcaRef = useRef(null);
  const modeloRef = useRef(null);

  const [errors, setErrors] = useState({
    patente: false,
    marca: false,
    modelo: false,
  });

  const vehicleFields = [
    {
      name: "patente",
      label: "Patente",
      type: "text",
      placeholder: "Ingrese la N° de Patente",
      required: true,
      autoComplete: "off",
    },
    {
      name: "marca",
      label: "Marca",
      type: "text",
      placeholder: "Ingrese la marca",
      required: true,
      autoComplete: "off",
    },
    {
      name: "modelo",
      label: "Modelo",
      type: "text",
      placeholder: "Ingrese el modelo",
      required: true,
      autoComplete: "off",
    },
  ];

  const handleRegisterVehicle = (formData, resetForm) => {
    setErrors({
      patente: false,
      marca: false,
      modelo: false,
    });

    const isPatenteValida = /^[A-Z]{3}\d{3}$|^[A-Z]{2}\d{3}[A-Z]{2}$/.test(
      formData.patente.trim().toUpperCase()
    );

    if (!isPatenteValida) {
      setErrors((prev) => ({ ...prev, patente: true }));
      patenteRef.current.focus();
      return;
    }

    if (!formData.marca.trim()) {
      setErrors((prev) => ({ ...prev, marca: true }));
      marcaRef.current.focus();
      return;
    }
    if (!formData.modelo.trim()) {
      setErrors((prev) => ({ ...prev, modelo: true }));
      modeloRef.current.focus();
      return;
    }

    console.log("Registro de vehiculo:", formData);
    // Aquí va la llamada a la API para guardar el vehículo
    resetForm();
  };

  return (
    <div className="min-h-screen w-full bg-gray-800/95 flex items-center justify-center px-4">
      <div className="w-full max-w-md p-6 sm:p-8 bg-gray-900 rounded-3xl shadow-2xl shadow-yellow-600">
        {!userHasVehicle ? (
          <>
            <h1 className="text-center text-4xl font-bold text-yellow-500 mb-6 tracking-tight">
              Registrar vehículo
            </h1>
            <Form
              fields={vehicleFields}
              onSubmit={handleRegisterVehicle}
              errors={errors}
              submitText={"Registrar Vehículo"}
              refs={{ patente: patenteRef, marca: marcaRef, modelo: modeloRef }}
            />
          </>
        ) : (
          <>
            <h1 className="text-center text-3xl font-bold text-yellow-500 mb-6 tracking-tight">
              Ya tienes un vehículo registrado
            </h1>
            <p className="text-center text-gray-300 mb-6">
              Puedes gestionarlo desde tu perfil.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default RegisterVehicle;
