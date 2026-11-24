import React from "react";
import { Link } from "react-router-dom";
import DashboardCard from "../../components/DashboardCard";
import StatusBadge from "../../components/StatusBadge";
import {
  faUtensils,
  faClock,
  faCheckCircle,
  faClipboardList,
} from "@fortawesome/free-solid-svg-icons";

const NgoDashboard = () => {
  const requests = [
    { id: 1, food: "Vegetable Rice", source: "Rahul Sharma",  qty: "25 meals",  date: "24 Nov 2026", status: "Pending"   },
    { id: 2, food: "Fresh Bread",    source: "City Bakery",   qty: "40 pieces", date: "23 Nov 2026", status: "Approved"  },
    { id: 3, food: "Fruit Packs",    source: "Fresh Mart",    qty: "15 packs",  date: "22 Nov 2026", status: "Completed" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">NGO Dashboard</h1>
      <p className="text-gray-500 mt-1 mb-8">Manage food requests and collections.</p>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <DashboardCard title="Available Food"  value="18"  icon={faUtensils}      />
        <DashboardCard title="Pending Requests" value="4"  icon={faClock}         color="orange" />
        <DashboardCard title="Fulfilled"       value="12" icon={faCheckCircle}   color="blue"   />
        <DashboardCard title="Total Requests"  value="30" icon={faClipboardList} color="purple" />
      </div>

      <div className="bg-white rounded-xl shadow-sm mt-8 overflow-hidden">
        <div className="p-5 flex justify-between items-center">
          <h2 className="font-bold text-lg text-gray-800">My Requests</h2>
          <Link to="/ngo/my-requests" className="text-green-600 text-sm font-semibold">View All</Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="p-4">Food Item</th>
                <th className="p-4">Source</th>
                <th className="p-4">Quantity</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-800">{r.food}</td>
                  <td className="p-4">{r.source}</td>
                  <td className="p-4">{r.qty}</td>
                  <td className="p-4 text-gray-500">{r.date}</td>
                  <td className="p-4"><StatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NgoDashboard;
