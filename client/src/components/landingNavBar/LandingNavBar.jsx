import React, { useState, useEffect } from "react";
import { Menu, X, CarTaxiFront as Taxi } from "lucide-react";
import Button from "../common/Button";

const LandingNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-gray-900/95 shadow-lg backdrop-blur-sm py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="relative flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img
              src="/logo.png"
              alt="RO-TAXI Logo"
              className="w-20 h-20 object-contain border-2 border-yellow-700 rounded-full transform hover:scale-105 transition duration-300"
            />
            <span className="text-2xl font-bold text-yellow-500 tracking-wider hover:text-yellow-600 font-sans">
              RO-TAXI
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="secondary"
              className="px-6 py-2 text-sm cursor-pointer"
            >
              Iniciar sesión
            </Button>
            <Button
              variant="primary"
              className="px-6 py-2 text-sm cursor-pointer"
            >
              Registrarse
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-yellow-500 hover:text-yellow-400 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isOpen
              ? "max-h-48 opacity-100 visible mt-4"
              : "max-h-0 opacity-0 invisible"
          }`}
        >
          <div className="bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-xl p-4 space-y-3">
            <Button
              variant="secondary"
              className="w-full justify-center text-sm cursor-pointer "
            >
              Iniciar sesión
            </Button>
            <Button
              variant="primary"
              className="w-full justify-center text-sm cursor-pointer"
            >
              Registrarse
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default LandingNavbar;
