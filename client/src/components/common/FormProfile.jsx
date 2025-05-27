import React, { useState, useEffect, useContext } from "react";
import { Eye, EyeOff } from "lucide-react";
import useFormValidation from "../../hooks/useFormValidation";
import { ThemeContext } from "../../context/ThemeContext";

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
  const [isEditing, setIsEditing] = useState(false);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const initialData = {};
    fields.forEach((f) => {
      if (f.value) initialData[f.name] = f.value;
    });
    setFormData(initialData);
  }, [fields]);

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
      setIsEditing(false);
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

          className: `w-full mt-1 p-2 pr-10 ${theme === 'dark' ? 'bg-zinc-800' : 'bg-white border border-yellow-500'} rounded-md outline-none appearance-none ${
            isError ? "border-red-500" : "border-gray-600"
          } focus:outline-none focus:ring-2 focus:ring-yellow-500`,
        };

        return (
          <div key={field.name} className="relative w-full">
            {field.label && field.type !== "hidden" && (
              <label
                htmlFor={field.name}
                className={`text-sm ${theme === 'dark' ? 'text-yellow-500' : 'text-gray-900'} mb-1 block`}
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
                  disabled={!isEditing}
                  className={`pl-10 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'} cursor-pointer ${commonProps.className}`}
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
                value={formData[field.name] || extraValues[field.name] || ""}
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
                  readOnly={!isEditing}
                  className={`pl-10 pr-10 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-900'} ${commonProps.className}`}
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

      <div className="flex justify-center md:justify-end gap-4 w-full md:col-span-2">
        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className={`w-full sm:w-1/2 md:w-1/4 mt-4  text-white font-semibold py-2 px-4 rounded-xl transition-all cursor-pointer ${theme === 'dark' ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-yellow-500 hover:bg-yellow-600'}`}
          >
            Editar
          </button>
        )}
        {isEditing && (
          <button
            type="submit"
            className={`w-full sm:w-1/2 md:w-1/4 mt-4  text-gray-900 font-semibold py-2 px-4 rounded-xl transition-all cursor-pointer ${theme === 'dark' ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-yellow-500 hover:bg-yellow-600'}`}
          >
            {submitText}
          </button>
        )}
      </div>
    </form>
  );
};

export default FormProfile;
