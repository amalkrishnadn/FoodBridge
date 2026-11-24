import React from "react";
import { Link } from "react-router-dom";
import DashboardCard from "../../components/DashboardCard";
import StatusBadge from "../../components/StatusBadge";
import {
  faBox,
  faClock,
  faCheckCircle,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

const DonorDashboard = () => {
  const donations = [
    { id: 1, food: "Vegetable Rice", quantity: "25 meals",  date: "24 Nov 2026", status: "Available" },
    { id: 2, food: "Fresh Bread",    quantity: "40 pieces", date: "23 Nov 2026", status: "Completed" },
    { id: 3, food: "Fruit Packs",    quantity: "15 packs",  date: "22 Nov 2026", status: "Pending"   },
  ];

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Donor Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your food donations.</p>
        </div>
        <Link to="/donor/add-donation" className="bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700">
          + Add Donation
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <DashboardCard title="Total Donations"   value="24" icon={faBox}         />
        <DashboardCard title="Pending Donations" value="5"  icon={faClock}       color="orange" />
        <DashboardCard title="Completed"         value="16" icon={faCheckCircle} color="blue"   />
        <DashboardCard title="Partner Requests"  value="8"  icon={faUsers}       color="purple" />
      </div>

      <div className="bg-white rounded-xl shadow-sm mt-8 overflow-hidden">
        <div className="p-5 flex justify-between items-center">
          <h2 className="font-bold text-lg text-gray-800">Recent Donations</h2>
          <Link to="/donor/my-donations" className="text-green-600 text-sm font-semibold">View All</Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="p-4">Food Item</th>
                <th className="p-4">Quantity</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((d) => (
                <tr key={d.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-800">{d.food}</td>
                  <td className="p-4">{d.quantity}</td>
                  <td className="p-4 text-gray-500">{d.date}</td>
                  <td className="p-4"><StatusBadge status={d.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;
