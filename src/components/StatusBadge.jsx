import React from "react";

const StatusBadge = ({ status }) => {
  const styles = {
    Available: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Approved: "bg-blue-100 text-blue-700",
    Completed: "bg-emerald-100 text-emerald-700",
    Rejected: "bg-red-100 text-red-700",
    "In Progress": "bg-purple-100 text-purple-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || "bg-gray-100 text-gray-700"}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
