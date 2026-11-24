import React from "react";
import StatusBadge from "../../components/StatusBadge";

const requests = [
  { id: 1, ngo: "Hope NGO",         food: "Vegetable Rice", qty: "20 meals",  date: "24 Nov 2026", status: "Pending"   },
  { id: 2, ngo: "Care Centre NGO",  food: "Fresh Bread",    qty: "30 pieces", date: "22 Nov 2026", status: "Approved"  },
  { id: 3, ngo: "Helping Hands",    food: "Fruit Packs",    qty: "10 packs",  date: "20 Nov 2026", status: "Completed" },
];

const DonorRequests = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Requests</h1>
      <p className="text-gray-500 mt-1 mb-8">NGO requests made for your donations.</p>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="p-4">#</th>
                <th className="p-4">NGO</th>
                <th className="p-4">Food Item</th>
                <th className="p-4">Quantity</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 text-gray-400">{r.id}</td>
                  <td className="p-4 font-medium text-gray-800">{r.ngo}</td>
                  <td className="p-4">{r.food}</td>
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

export default DonorRequests;
