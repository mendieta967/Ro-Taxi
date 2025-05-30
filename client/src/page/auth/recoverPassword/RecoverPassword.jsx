import React, { useRef, useState } from "react";
import Form from "../../../components/common/Form"; // Ajusta el path si tu Form está en otro directorio

const RecoverPassword = () => {
  const emailRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const handleRecover = async (formData, resetForm) => {
    const { email } = formData;

    if (!email || !email.includes("@")) {
      setErrors({ email: true });
      setMessage("");
      return;
    }

    try {
      // Aquí iría la lógica para enviar el email al backend
      console.log("Recuperar contraseña para:", email);

      setErrors({});
      setMessage(
        "✅ Si el correo existe, recibirás un mensaje con instrucciones."
      );
      resetForm();
    } catch (error) {
      setErrors({ email: true });
      setMessage("❌ Hubo un error. Intenta nuevamente.", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-yellow-500 mb-6">
        Recuperar contraseña
      </h1>

      <Form
        fields={[
          {
            name: "email",
            label: "Correo electrónico",
            type: "email",
            required: true,
            placeholder: "ejemplo@correo.com",
          },
        ]}
        onSubmit={handleRecover}
        submitText="Enviar instrucciones"
        refs={{ email: emailRef }}
        errors={errors}
      />

      {message && (
        <p className="mt-4 text-center text-sm text-green-600 dark:text-yellow-400">
          {message}
        </p>
      )}
    </div>
  );
};

export default RecoverPassword;
