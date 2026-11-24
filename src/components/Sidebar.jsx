import React from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLeaf,
  faGauge,
  faPlus,
  faBox,
  faClipboardList,
  faUtensils,
  faTruck,
  faFileAlt,
  faUsers,
  faBuilding,
  faRecycle,
} from "@fortawesome/free-solid-svg-icons";

const menus = {
  donor: [
    { name: "Dashboard",    path: "",             icon: faGauge },
    { name: "Add Donation", path: "add-donation", icon: faPlus },
    { name: "My Donations", path: "my-donations", icon: faBox },
    { name: "Requests",     path: "requests",     icon: faClipboardList },
  ],
  ngo: [
    { name: "Dashboard",      path: "",             icon: faGauge },
    { name: "Available Food", path: "available-food", icon: faUtensils },
    { name: "My Requests",    path: "my-requests",  icon: faClipboardList },
  ],
  volunteer: [
    { name: "Dashboard", path: "",        icon: faGauge },
    { name: "My Tasks",  path: "my-tasks", icon: faTruck },
  ],
  events: [
    { name: "Dashboard",   path: "",           icon: faGauge },
    { name: "Report Food", path: "report-food", icon: faFileAlt },
  ],
  recovery: [
    { name: "Dashboard",      path: "",              icon: faGauge },
    { name: "Available Food", path: "available-food", icon: faRecycle },
  ],
  admin: [
    { name: "Dashboard",     path: "",             icon: faGauge },
    { name: "Users",         path: "users",        icon: faUsers },
    { name: "Donations",     path: "donations",    icon: faBox },
    { name: "Organizations", path: "organizations", icon: faBuilding },
  ],
};

const Sidebar = ({ role }) => {
  const links = menus[role] || [];

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white hidden md:block">
      <div className="px-6 py-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold">
          <FontAwesomeIcon icon={faLeaf} className="text-green-400 mr-2" />
          FoodBridge
        </h1>
      </div>

      <nav className="p-4 space-y-2">
        {links.map((item) => (
          <NavLink
            key={item.path + item.name}
            to={`/${role}${item.path ? `/${item.path}` : ""}`}
            end={item.path === ""}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? "bg-green-600 text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`
            }
          >
            <FontAwesomeIcon icon={item.icon} />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
