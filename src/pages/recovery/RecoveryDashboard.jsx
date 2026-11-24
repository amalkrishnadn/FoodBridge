import React from "react";
import { Link } from "react-router-dom";
import DashboardCard from "../../components/DashboardCard";
import StatusBadge from "../../components/StatusBadge";
import {
  faLeaf,
  faRecycle,
  faClock,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

const RecoveryDashboard = () => {
  const materials = [
    { id: 1, name: "Vegetable Waste",      quantity: "40 kg", type: "Composting",    status: "Available" },
    { id: 2, name: "Expired Bread",        quantity: "20 kg", type: "Animal Feed",   status: "Completed" },
    { id: 3, name: "Food Processing Waste",quantity: "60 kg", type: "Composting",    status: "Pending"   },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Recovery Facility Dashboard</h1>
      <p className="text-gray-500 mt-1 mb-8">Manage available organic materials and recovery requests.</p>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <DashboardCard title="Available Materials" value="15"     icon={faLeaf}        />
        <DashboardCard title="Total Recovered"     value="850 kg" icon={faRecycle}     color="blue"   />
        <DashboardCard title="Pending Requests"    value="4"      icon={faClock}       color="orange" />
        <DashboardCard title="Completed"           value="11"     icon={faCheckCircle} color="purple" />
      </div>

      <div className="flex justify-between items-center mt-8 mb-5">
        <h2 className="text-xl font-bold text-gray-800">Available Materials</h2>
        <Link to="/recovery/available-food" className="text-green-600 font-semibold text-sm">View All</Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="p-4">Material</th>
                <th className="p-4">Quantity</th>
                <th className="p-4">Recovery Type</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-800">{item.name}</td>
                  <td className="p-4">{item.quantity}</td>
                  <td className="p-4">{item.type}</td>
                  <td className="p-4"><StatusBadge status={item.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecoveryDashboard;
