import React from "react";
import StatusBadge from "../../components/StatusBadge";

const availableFood = [
  { id: 1, food: "Vegetable Rice",  donor: "Rahul Sharma",  qty: "25 meals",  expiry: "25 Nov 2026", status: "Available" },
  { id: 2, food: "Fresh Bread",     donor: "City Bakery",   qty: "40 pieces", expiry: "24 Nov 2026", status: "Available" },
  { id: 3, food: "Fruit Packs",     donor: "Fresh Mart",    qty: "15 packs",  expiry: "26 Nov 2026", status: "Pending"   },
  { id: 4, food: "Cooked Dal",      donor: "Home Kitchen",  qty: "30 meals",  expiry: "24 Nov 2026", status: "Available" },
];

const NgoAvailableFood = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Available Food</h1>
      <p className="text-gray-500 mt-1 mb-8">Browse food donations available for collection.</p>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="p-4">#</th>
                <th className="p-4">Food Item</th>
                <th className="p-4">Donor</th>
                <th className="p-4">Quantity</th>
                <th className="p-4">Best Before</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {availableFood.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 text-gray-400">{item.id}</td>
                  <td className="p-4 font-medium text-gray-800">{item.food}</td>
                  <td className="p-4">{item.donor}</td>
                  <td className="p-4">{item.qty}</td>
                  <td className="p-4 text-gray-500">{item.expiry}</td>
                  <td className="p-4"><StatusBadge status={item.status} /></td>
                  <td className="p-4">
                    {item.status === "Available" && (
                      <button className="text-sm bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700">
                        Request
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NgoAvailableFood;
