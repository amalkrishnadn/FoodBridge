import React from "react";
import { Link } from "react-router-dom";
import DashboardCard from "../../components/DashboardCard";
import StatusBadge from "../../components/StatusBadge";
import {
  faTruck,
  faClock,
  faCheckCircle,
  faRoute,
} from "@fortawesome/free-solid-svg-icons";

const VolunteerDashboard = () => {
  const tasks = [
    { id: 1, pickup: "Green Hotel",  delivery: "Hope NGO",          time: "10:30 AM", status: "Pending"     },
    { id: 2, pickup: "City Bakery",  delivery: "Care Centre",        time: "12:00 PM", status: "In Progress" },
    { id: 3, pickup: "Fresh Mart",   delivery: "Helping Hands NGO",  time: "Yesterday", status: "Completed"  },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Volunteer Dashboard</h1>
      <p className="text-gray-500 mt-1 mb-8">Manage your food pickup and delivery tasks.</p>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <DashboardCard title="Total Tasks"     value="20" icon={faTruck}       />
        <DashboardCard title="Pending Tasks"   value="4"  icon={faClock}       color="orange" />
        <DashboardCard title="Completed Tasks" value="14" icon={faCheckCircle} color="blue"   />
        <DashboardCard title="Deliveries"      value="14" icon={faRoute}       color="purple" />
      </div>

      <div className="bg-white rounded-xl shadow-sm mt-8 overflow-hidden">
        <div className="p-5 flex justify-between items-center">
          <h2 className="font-bold text-lg">Recent Tasks</h2>
          <Link to="/volunteer/my-tasks" className="text-green-600 text-sm font-semibold">View All</Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="p-4">Pickup</th>
                <th className="p-4">Delivery</th>
                <th className="p-4">Time</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className="border-t hover:bg-gray-50">
                  <td className="p-4">{task.pickup}</td>
                  <td className="p-4">{task.delivery}</td>
                  <td className="p-4">{task.time}</td>
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

export default VolunteerDashboard;
