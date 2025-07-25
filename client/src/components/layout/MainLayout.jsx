import { useState, useEffect, useContext } from "react";
import Sidebar from "./sidebar/Sidebar";
import Navbar from "./navBar/NavBar";
import { ThemeContext } from "../../context/ThemeContext";
import { Toaster } from "@/components/ui/sonner";

const MainLayout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme } = useContext(ThemeContext);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div
      className={`h-screen flex  overflow-hidden relative bg-gradient-to-b ${
        theme === "dark" ? "from-gray-900 to-gray-800" : "bg-white"
      } `}
    >
      <Sidebar
        isMobile={isMobile}
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <Toaster />
      <div className="flex-1 flex flex-col">
        <Navbar isMobile={isMobile} />
        <main className="flex-1 p-4 md:p-6  overflow-y-auto">
          <div className="max-w-7xl mx-auto animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
