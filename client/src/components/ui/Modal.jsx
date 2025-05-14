const Modal = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-zinc-900 rounded-xl p-6 w-[90%] max-w-xl text-white space-y-4 relative">
        <button
          onClick={onClose}
          className="absolute cursor-pointer top-3 right-3 text-yellow-500 hover:text-white"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
