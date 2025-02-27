import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <nav className="bg-black shadow-lg p-4 fixed top-0 w-full flex items-center justify-between px-6 md:px-10 font-inter">
      {/* Left - Logo */}
      <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-200">
        Task Manager
      </h1>

      {/* Center - Project Name (Hidden on Small Screens) */}
      <p className="hidden sm:block absolute left-1/2 transform -translate-x-1/2 text-gray-200">
        Assessment Project - CoverageX
      </p>

      {/* Right - Dark Mode Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="p-2 rounded-lg bg-surface-dark border border-border-dark hover:bg-background-dark transition focus:outline-none"
        aria-label="Toggle Dark Mode"
      >
        {darkMode ? (
          <Sun className="text-yellow-400" size={20} />
        ) : (
          <Moon className="text-border-light" size={20} />
        )}
      </button>
    </nav>
  );
}
