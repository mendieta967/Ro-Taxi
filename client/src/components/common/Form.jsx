import React from "react";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

const Form = ({
  fields,
  onSubmit,
  submitText,
  refs = {},
  errors = {},
  extraValues = {},
  extraContent = null,
}) => {
  const theme = useContext(ThemeContext);
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(e.target).entries());
    onSubmit({ ...formData, ...extraValues }, () => e.target.reset());
    // console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => {
        const isError = errors[field.name];
        const commonProps = {
          id: field.name,
          name: field.name,
          required: field.required,
          className: theme === 'dark' ? `w-full px-4 py-2 rounded-xl bg-gray-800 text-yellow-700 border ${
            isError ? "border-red-500" : "border-gray-600"
          } focus:outline-none focus:ring-2 focus:ring-yellow-500` : `w-full px-4 py-2 rounded-xl bg-white  text-gray-900 border ${
            isError ? "border-red-500" : "border-yellow-500"
          } focus:outline-none focus:ring-2 focus:ring-yellow-500`,
          ...(refs[field.name] ? { ref: refs[field.name] } : {}),
          defaultValue: field.defaultValue || "",
        };

        return (
          <div key={field.name} className="flex flex-col">
            {field.label && field.type !== "hidden" && (
              <label
                htmlFor={field.name}
                className={theme === 'dark' ? "text-sm font-semibold text-yellow-500 mb-1" : "text-sm font-semibold text-gray-900 mb-1"}
              >
                {field.label}
              </label>
            )}

            {field.type === "select" ? (
              <select {...commonProps}>
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : field.type === "hidden" ? (
              <input
                type="hidden"
                name={field.name}
                defaultValue={extraValues[field.name] || ""}
              />
            ) : (
              <input
                {...commonProps}
                {...(refs[field.name] ? { ref: refs[field.name] } : {})}
                type={field.type}
                placeholder={field.placeholder}
                autoComplete={field.autoComplete}
                autoFocus={field.autoFocus}
              />
            )}

            {isError && (
              <span className="text-xs text-red-400 mt-1">
                Este campo es obligatorio o inválido.
              </span>
            )}
          </div>
        );
      })}

      {extraContent}
      <div className="flex justify-center w-full">
        <button
          type="submit"
          className="w-[50%] mt-4 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-2 px-4 rounded-xl transition-all cursor-pointer"
        >
          {submitText}
        </button>
      </div>
    </form>
  );
};

export default Form;
