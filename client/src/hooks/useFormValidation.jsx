import { useState } from "react";
const useFormValidation = (fields) => {
  const [errors, setErrors] = useState({});

  const validate = (formData) => {
    const newErrors = {};

    fields.forEach((field) => {
      const value = formData[field.name];

      if (field.required && !value) {
        newErrors[field.name] = "Este campo es obligatorio";
        return;
      }

      // Validar correo
      if (field.name === "correo" && value) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(value)) {
          newErrors.correo = "Por favor, ingresa un email válido";
        }
      }

      // Validar DNI
      if (field.name === "dni" && value) {
        if (isNaN(value)) {
          newErrors.dni = "El DNI debe ser numérico";
        } else if (value.length < 8) {
          newErrors.dni = "El DNI debe tener al menos 8 dígitos";
        }
      }

      // Validar contraseñas (newPassword y confirmPassword)
      if (
        (field.name === "newPassword" || field.name === "confirmPassword") &&
        value &&
        value.length < 6
      ) {
        newErrors[field.name] =
          "La contraseña debe tener al menos 6 caracteres";
      }
    });

    // Validación cruzada: coincidencia de contraseñas
    if (
      formData.newPassword &&
      formData.confirmPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { errors, validate };
};

export default useFormValidation;
