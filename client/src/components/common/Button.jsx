import React from "react";

const Button = ({
  children,
  variant = "primary",
  className = "",
  onClick,
  type = "button",
  disabled = false,
}) => {
  const baseStyles =
    "font-medium rounded-lg text-sm px-5 py-2.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 transform hover:scale-105 active:scale-95";

  const variantStyles = {
    primary:
      "bg-yellow-500 hover:bg-yellow-600 text-gray-900 shadow-md focus:ring-yellow-400",
    secondary:
      "bg-gray-800 hover:bg-gray-700 text-white shadow-md focus:ring-gray-600",
    outline:
      "bg-transparent border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-gray-900 focus:ring-yellow-400",
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variantStyles[variant]} ${className} `}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
