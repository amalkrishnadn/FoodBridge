import React from "react";
import { Link } from "react-router-dom";
import DashboardCard from "../../components/DashboardCard";
import StatusBadge from "../../components/StatusBadge";
import {
  faFileAlt,
  faClock,
  faCheckCircle,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";

const EventsDashboard = () => {
  const reports = [
    { id: 1, event: "Annual Gala Dinner",  food: "Biryani",       qty: "50 meals",  date: "24 Nov 2026", status: "Pending"   },
    { id: 2, event: "Wedding Reception",   food: "Mixed Sweets",  qty: "80 boxes",  date: "22 Nov 2026", status: "Approved"  },
    { id: 3, event: "Corporate Lunch",     food: "Sandwiches",    qty: "60 pieces", date: "20 Nov 2026", status: "Completed" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Event Organizer Dashboard</h1>
      <p className="text-gray-500 mt-1 mb-8">Report and manage surplus food from your events.</p>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <DashboardCard title="Total Reports"   value="12" icon={faFileAlt}     />
        <DashboardCard title="Pending"         value="3"  icon={faClock}       color="orange" />
        <DashboardCard title="Completed"       value="8"  icon={faCheckCircle} color="blue"   />
        <DashboardCard title="Upcoming Events" value="2"  icon={faCalendarAlt} color="purple" />
      </div>

      <div className="bg-white rounded-xl shadow-sm mt-8 overflow-hidden">
        <div className="p-5 flex justify-between items-center">
          <h2 className="font-bold text-lg text-gray-800">Recent Food Reports</h2>
          <Link to="/events/report-food" className="text-green-600 text-sm font-semibold">Report Food</Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="p-4">Event</th>
                <th className="p-4">Food Item</th>
                <th className="p-4">Quantity</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-800">{r.event}</td>
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

export default EventsDashboard;
