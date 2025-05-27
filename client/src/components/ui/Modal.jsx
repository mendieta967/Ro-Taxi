import { ThemeContext } from "../../context/ThemeContext";
import { useContext } from "react";
const Modal = ({ children, onClose }) => {
  const {theme} = useContext(ThemeContext);
  return (
    <div className={`fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm`}>
      <div className={`rounded-xl p-6 w-[90%] max-w-xl text-white space-y-4 relative ${theme === 'dark' ? 'bg-zinc-900' : 'bg-white border border-yellow-500'}`}>
        <button
          onClick={onClose}
          className={`absolute cursor-pointer top-3 right-3  ${theme === 'dark' ? 'text-yellow-500 hover:text-white' : 'text-gray-900 hover:text-yellow-500'}`}
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
