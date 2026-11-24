import React from "react";
import { Link } from "react-router-dom";
import StatusBadge from "../../components/StatusBadge";

const donations = [
  { id: 1, food: "Vegetable Rice",  quantity: "25 meals",  date: "24 Nov 2026", status: "Available" },
  { id: 2, food: "Fresh Bread",     quantity: "40 pieces", date: "23 Nov 2026", status: "Completed" },
  { id: 3, food: "Fruit Packs",     quantity: "15 packs",  date: "22 Nov 2026", status: "Pending"   },
  { id: 4, food: "Cooked Dal",      quantity: "30 meals",  date: "20 Nov 2026", status: "Approved"  },
  { id: 5, food: "Boiled Eggs",     quantity: "60 pieces", date: "18 Nov 2026", status: "Completed" },
];

const DonorMyDonations = () => {
  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Donations</h1>
          <p className="text-gray-500 mt-1">Track all your food donations.</p>
        </div>
        <Link to="/donor/add-donation" className="bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700">
          + Add Donation
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="p-4">#</th>
                <th className="p-4">Food Item</th>
                <th className="p-4">Quantity</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((d) => (
                <tr key={d.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 text-gray-400">{d.id}</td>
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

export default DonorMyDonations;
