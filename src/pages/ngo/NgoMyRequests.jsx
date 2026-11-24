import React from "react";
import StatusBadge from "../../components/StatusBadge";

const myRequests = [
  { id: 1, food: "Vegetable Rice", source: "Rahul Sharma", qty: "20 meals",  date: "24 Nov 2026", status: "Pending"   },
  { id: 2, food: "Fresh Bread",    source: "City Bakery",  qty: "30 pieces", date: "22 Nov 2026", status: "Approved"  },
  { id: 3, food: "Fruit Packs",    source: "Fresh Mart",   qty: "10 packs",  date: "20 Nov 2026", status: "Completed" },
];

const NgoMyRequests = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">My Requests</h1>
      <p className="text-gray-500 mt-1 mb-8">Track all requests you have made for food donations.</p>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="p-4">#</th>
                <th className="p-4">Food Item</th>
                <th className="p-4">Source</th>
                <th className="p-4">Quantity</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {myRequests.map((r) => (
                <tr key={r.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 text-gray-400">{r.id}</td>
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

export default NgoMyRequests;
