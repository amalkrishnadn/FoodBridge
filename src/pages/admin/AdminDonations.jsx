import React from "react";
import StatusBadge from "../../components/StatusBadge";

const donations = [
  { id: 1, donor: "Rahul Sharma",  food: "Vegetable Rice",  qty: "25 meals",  date: "24 Nov 2026", status: "Available" },
  { id: 2, donor: "Priya Nair",    food: "Fresh Bread",     qty: "40 pieces", date: "23 Nov 2026", status: "Completed" },
  { id: 3, donor: "Amit Kumar",    food: "Fruit Packs",     qty: "15 packs",  date: "22 Nov 2026", status: "Pending"   },
  { id: 4, donor: "Sara Thomas",   food: "Cooked Dal",      qty: "30 meals",  date: "21 Nov 2026", status: "Approved"  },
];

const AdminDonations = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Donation Management</h1>
      <p className="text-gray-500 mt-1 mb-8">Monitor all food donations on the platform.</p>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="p-4">#</th>
                <th className="p-4">Donor</th>
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
                  <td className="p-4 font-medium text-gray-800">{d.donor}</td>
                  <td className="p-4">{d.food}</td>
                  <td className="p-4">{d.qty}</td>
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

export default AdminDonations;
