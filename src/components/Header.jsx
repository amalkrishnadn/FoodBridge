
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark, faLeaf } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/#about" },
    { name: "How It Works", path: "/#how-it-works" },
    { name: "Our Impact", path: "/#impact" },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <FontAwesomeIcon icon={faLeaf} className="text-green-600 text-2xl" />
          <span className="text-2xl font-bold text-gray-800">
            Food<span className="text-green-600">Bridge</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.path}
              className="text-gray-600 hover:text-green-600 font-medium"
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link to="/login" className="text-green-700 font-semibold">
            Login
          </Link>
          <Link
            to="/register"
            className="bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700"
          >
            Get Started
          </Link>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-700 text-xl"
          aria-label="Toggle navigation"
        >
          <FontAwesomeIcon icon={menuOpen ? faXmark : faBars} />
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden bg-white px-6 pb-5 space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.path}
              onClick={() => setMenuOpen(false)}
              className="block text-gray-700 hover:text-green-600"
            >
              {link.name}
            </a>
          ))}

          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
            className="block text-green-700 font-semibold"
          >
            Login
          </Link>

          <Link
            to="/register"
            onClick={() => setMenuOpen(false)}
            className="block bg-green-600 text-white text-center py-2 rounded-lg"
          >
            Get Started
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
