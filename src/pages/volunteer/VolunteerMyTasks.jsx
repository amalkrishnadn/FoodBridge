import React from "react";
import StatusBadge from "../../components/StatusBadge";

const tasks = [
  { id: 1, pickup: "Green Hotel",   delivery: "Hope NGO",         food: "Veg Rice",   time: "10:30 AM", status: "Pending"     },
  { id: 2, pickup: "City Bakery",   delivery: "Care Centre",       food: "Fresh Bread", time: "12:00 PM", status: "In Progress" },
  { id: 3, pickup: "Fresh Mart",    delivery: "Helping Hands NGO", food: "Fruit Packs", time: "Yesterday", status: "Completed"  },
  { id: 4, pickup: "Royal Kitchen", delivery: "Sunrise NGO",       food: "Cooked Dal",  time: "3:00 PM",  status: "Pending"    },
];

const VolunteerMyTasks = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
      <p className="text-gray-500 mt-1 mb-8">All your assigned food pickup and delivery tasks.</p>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="p-4">#</th>
                <th className="p-4">Food Item</th>
                <th className="p-4">Pickup From</th>
                <th className="p-4">Deliver To</th>
                <th className="p-4">Time</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 text-gray-400">{task.id}</td>
                  <td className="p-4 font-medium text-gray-800">{task.food}</td>
                  <td className="p-4">{task.pickup}</td>
                  <td className="p-4">{task.delivery}</td>
                  <td className="p-4 text-gray-500">{task.time}</td>
                  <td className="p-4"><StatusBadge status={task.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VolunteerMyTasks;
