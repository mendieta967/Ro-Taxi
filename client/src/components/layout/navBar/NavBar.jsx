import { useState } from "react";
import { User } from "lucide-react";
import { useAuth } from "../../../context/auth";
import { useNavigate } from "react-router-dom";

const Navbar = ({ isMobile }) => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLogaut = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-between items-center px-4 md:px-6 py-4 border-b border-gray-800 bg-gray-900 relative">
      {isMobile ? (
        <>
          <div className="flex-1 flex justify-center items-center gap-3">
            <h1 className="text-xl font-bold text-white">Ro-Taxi</h1>
          </div>
        </>
      ) : (
        <div></div>
      )}

      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center space-x-2 border border-gray-800 rounded-full p-1 pr-3 hover:bg-gray-800 transition cursor-pointer"
        >
          <div className="bg-yellow-400 rounded-full h-8 w-8 flex items-center justify-center text-black">
            <User className="h-5 w-5" />
          </div>
          {!isMobile && (
            <span className="text-sm font-medium text-yellow-500">
              {user.userName}
            </span>
          )}
        </button>

        {isDropdownOpen && (
          <div className="absolute top-12 right-0 w-56 bg-gray-900 rounded-lg shadow-lg border border-gray-800 z-50">
            <div className="px-4 py-3 text-sm">
              <div className="font-medium text-yellow-500">{user.userName}</div>
              <div className="text-xs text-gray-400">{user.email}</div>
            </div>
            <hr className="border-gray-800" />

            <button
              onClick={handleLogaut}
              className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-800 cursor-pointer"
            >
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
