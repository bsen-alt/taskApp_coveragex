import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export default function Navbar({ setView, currentView }) {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  // Apply dark mode class to <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <nav className="bg-black shadow-lg p-4 fixed top-0 w-full flex justify-between items-center font-inter">
      {/* Left - Logo */}
      <h1 className="text-2xl font-bold text-gray-200 ">Task Manager</h1>
      <p className="text-gray-200">Assessment Project - CoverageX</p>

      {/* Right - Dark Mode Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="p-2 rounded-lg bg-surface-dark border border-border-dark hover:bg-background-dark  transition"
      >
        {darkMode ? (
          <Sun className="text-yellow-400" size={16} />
        ) : (
          <Moon className="text-border-light" size={16} />
        )}
      </button>
    </nav>
  );
}
