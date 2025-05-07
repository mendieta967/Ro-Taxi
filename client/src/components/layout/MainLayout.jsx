import { useState, useEffect } from "react";
import Sidebar from "./sidebar/Sidebar";
import Navbar from "./navBar/NavBar";

const MainLayout = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    <div className="h-screen flex bg-background overflow-hidden relative bg-gradient-to-b from-gray-900 to-gray-800">
      <Sidebar
        isMobile={isMobile}
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      <div className="flex-1 flex flex-col">
        <Navbar isMobile={isMobile} />
        <main className="flex-1 p-4 md:p-6 bg-background overflow-y-auto">
          <div className="max-w-7xl mx-auto animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
