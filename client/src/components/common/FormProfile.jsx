import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import useFormValidation from "../../hooks/useFormValidation";

const FormProfile = ({
  fields,
  onSubmit,
  submitText,
  refs = {},
  extraValues = {},
  extraContent = null,
}) => {
  const { errors, validate } = useFormValidation(fields);
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = (fieldName) => {
    setShowPassword((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validate(formData);

    if (isValid) {
      onSubmit({ ...formData, ...extraValues }, () => e.target.reset());
    } else {
      console.log("Errores en el formulario", errors);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 w-full"
    >
      {fields.map((field) => {
        const isError = errors[field.name];
        const commonProps = {
          id: field.name,
          name: field.name,
          required: field.required,
          ref: refs[field.name] || null,
          value: formData[field.name] || "",
          onChange: handleChange,
          className: `w-full mt-1 p-2 pr-10 bg-zinc-800 rounded-md outline-none appearance-none ${
            isError ? "border-red-500" : "border-gray-600"
          } focus:outline-none focus:ring-2 focus:ring-yellow-500`,
        };

        return (
          <div key={field.name} className="relative w-full">
            {field.label && field.type !== "hidden" && (
              <label
                htmlFor={field.name}
                className="text-sm text-yellow-500 mb-1 block"
              >
                {field.label}
              </label>
            )}

            {field.type === "select" ? (
              <div className="relative">
                {field.icon && (
                  <div className="absolute top-1/2 left-3 -translate-y-1/2 pointer-events-none">
                    {field.icon}
                  </div>
                )}
                <select
                  {...commonProps}
                  className={`pl-10 text-gray-300 ${commonProps.className}`}
                >
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : field.type === "hidden" ? (
              <input
                type="hidden"
                name={field.name}
                value={extraValues[field.value] || ""}
              />
            ) : (
              <div className="relative">
                {field.icon && (
                  <div className="absolute top-1/2 left-3 -translate-y-1/2 pointer-events-none">
                    {field.icon}
                  </div>
                )}
                <input
                  {...commonProps}
                  type={
                    field.type === "password" && showPassword[field.name]
                      ? "text"
                      : field.type
                  }
                  placeholder={field.placeholder}
                  autoComplete={field.autoComplete}
                  autoFocus={field.autoFocus}
                  value={field.value}
                  className={`pl-10 pr-10 text-gray-300 ${commonProps.className}`}
                />
                {field.type === "password" && (
                  <div
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-zinc-500"
                    onClick={() => togglePasswordVisibility(field.name)}
                  >
                    {showPassword[field.name] ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </div>
                )}
              </div>
            )}

            {isError && (
              <span className="text-xs text-red-400 mt-1 block">
                {errors[field.name]}
              </span>
            )}
          </div>
        );
      })}

      {extraContent}

      <div className="flex justify-center md:justify-end w-full md:col-span-2">
        <button
          type="submit"
          className="w-full sm:w-1/2 md:w-1/4 mt-4 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-2 px-4 rounded-xl transition-all cursor-pointer"
        >
          {submitText}
        </button>
      </div>
    </form>
  );
};

export default FormProfile;
