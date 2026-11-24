
import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeaf } from "@fortawesome/free-solid-svg-icons";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          <div>
            <h2 className="text-2xl font-bold mb-4">
              <FontAwesomeIcon icon={faLeaf} className="text-green-500 mr-2" />
              FoodBridge
            </h2>
            <p className="text-gray-400 leading-7">
              Connecting surplus food with people and organisations that
              can make a difference. Together, we can reduce food waste.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="flex flex-col gap-3 text-gray-400">
              <Link to="/" className="hover:text-green-400">Home</Link>
              <a href="/#about" className="hover:text-green-400">About</a>
              <a href="/#how-it-works" className="hover:text-green-400">How It Works</a>
              <Link to="/login" className="hover:text-green-400">Login</Link>
              <Link to="/register" className="hover:text-green-400">Register</Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Our Mission</h3>
            <p className="text-gray-400 leading-7">
              Recover usable surplus food, support communities, and
              redirect unavoidable food waste towards responsible recovery.
            </p>
          </div>

        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} FoodBridge. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
