import React from "react";
import StatusBadge from "../../components/StatusBadge";

const materials = [
  { id: 1, name: "Vegetable Waste",        qty: "40 kg", source: "Fresh Mart",    type: "Composting",    date: "24 Nov 2026", status: "Available" },
  { id: 2, name: "Expired Bread",          qty: "20 kg", source: "City Bakery",   type: "Animal Feed",   date: "23 Nov 2026", status: "Completed" },
  { id: 3, name: "Food Processing Waste",  qty: "60 kg", source: "Food Plant Ltd",type: "Composting",    date: "22 Nov 2026", status: "Pending"   },
  { id: 4, name: "Fruit Trimmings",        qty: "15 kg", source: "FreshCo",       type: "Biogas",        date: "21 Nov 2026", status: "Available" },
];

const RecoveryAvailableFood = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Available Organic Materials</h1>
      <p className="text-gray-500 mt-1 mb-8">Browse available organic materials for recovery.</p>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="p-4">#</th>
                <th className="p-4">Material</th>
                <th className="p-4">Source</th>
                <th className="p-4">Quantity</th>
                <th className="p-4">Recovery Type</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 text-gray-400">{item.id}</td>
                  <td className="p-4 font-medium text-gray-800">{item.name}</td>
                  <td className="p-4">{item.source}</td>
                  <td className="p-4">{item.qty}</td>
                  <td className="p-4">{item.type}</td>
                  <td className="p-4 text-gray-500">{item.date}</td>
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

export default RecoveryAvailableFood;
