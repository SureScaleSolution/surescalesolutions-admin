import React from "react";

interface ButtonProps {
  text?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export const Button: React.FC<ButtonProps> = ({ 
  text = "", 
  onClick, 
  disabled = false,
  type = "button"
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center border-primary border-1 font-bold px-18 py-2 transition-colors duration-300 text-xs md:text-sm lg:text-base ${
        disabled 
          ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
          : 'hover:bg-transparent bg-primary cursor-pointer text-white hover:text-primary'
      }`}
    >
      {text}
    </button>
  );
};
