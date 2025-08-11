import { useState } from "react";
import { User } from "lucide-react";
import { useAuth } from "../../../context/auth";
import { useNavigate } from "react-router-dom";
import { useTranslate } from "../../../hooks/useTranslate";
import { useContext } from "react";
import { ThemeContext } from "../../../context/ThemeContext";

const Navbar = ({ isMobile }) => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const translate = useTranslate();

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleLogaut = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`flex justify-between items-center px-4 md:px-6 py-4 border-b border-gray-800 ${
        theme === "dark" ? "bg-gray-900" : "bg-yellow-500"
      } relative`}
    >
      {isMobile ? (
        <>
          <div className="flex-1 flex justify-center items-center gap-3">
            <h1 className="text-xl font-bold text-white">Rodaxi</h1>
          </div>
        </>
      ) : (
        <div></div>
      )}

      <div className="relative">
        <button
          onClick={toggleDropdown}
          className={`flex items-center space-x-2 border border-gray-800 rounded-full p-1 pr-3 hover:bg-gray-800 transition cursor-pointer ${
            theme === "dark"
              ? "bg-gray-900"
              : "bg-yellow-500 hover:bg-yellow-500"
          }`}
        >
          <div
            className={`rounded-full h-8 w-8 flex items-center justify-center text-black ${
              theme === "dark" ? "bg-yellow-500" : "bg-gray-900"
            }`}
          >
            <User
              className={`h-5 w-5 ${
                theme === "dark" ? "text-gray-900" : "text-yellow-500"
              }`}
            />
          </div>
          {!isMobile && (
            <span
              className={`text-sm font-medium  ${
                theme === "dark" ? "text-yellow-500" : "text-gray-900"
              }`}
            >
              {user.userName}
            </span>
          )}
        </button>

        {isDropdownOpen && (
          <div
            className={`absolute top-12 right-0 w-56 bg-gray-900 rounded-lg shadow-lg border border-gray-800 z-50 ${
              theme === "dark" ? "bg-gray-900" : "bg-yellow-500"
            }`}
          >
            <div className="px-4 py-3 text-sm">
              <div
                className={`font-medium  ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                {user.userName}
              </div>
              <div
                className={`text-xs  ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                {user.email}
              </div>
            </div>
            <hr className="border-gray-800" />

            <button
              onClick={handleLogaut}
              className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-800 cursor-pointer"
            >
              {translate("Cerrar Sesión")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
