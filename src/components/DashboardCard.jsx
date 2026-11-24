import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const DashboardCard = ({
  title,
  value,
  icon,
  color = "green",
  description,
}) => {
  const colors = {
    green: "bg-green-100 text-green-600",
    blue: "bg-blue-100 text-blue-600",
    orange: "bg-orange-100 text-orange-600",
    purple: "bg-purple-100 text-purple-600",
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h2 className="text-3xl font-bold text-gray-800 mt-3">{value}</h2>
          {description && (
            <p className="text-xs text-gray-400 mt-2">{description}</p>
          )}
        </div>

        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${colors[color]}`}
        >
          <FontAwesomeIcon icon={icon} className="text-xl" />
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
