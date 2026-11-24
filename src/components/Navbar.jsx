import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faUserCircle } from "@fortawesome/free-solid-svg-icons";

const Navbar = ({ role }) => {
  const roleName = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <div>
        <h2 className="text-lg font-bold text-gray-800">
          {roleName} Dashboard
        </h2>
        <p className="text-sm text-gray-500">Welcome back to FoodBridge</p>
      </div>

      <div className="flex items-center gap-5">
        <button
          className="text-gray-500 hover:text-green-600"
          aria-label="Notifications"
        >
          <FontAwesomeIcon icon={faBell} className="text-xl" />
        </button>

        <div className="flex items-center gap-2">
          <FontAwesomeIcon
            icon={faUserCircle}
            className="text-3xl text-green-600"
          />
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-800">Demo User</p>
            <p className="text-xs text-gray-500">{roleName}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
