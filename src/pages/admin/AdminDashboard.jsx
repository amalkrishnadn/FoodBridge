import React from "react";
import { Link } from "react-router-dom";
import DashboardCard from "../../components/DashboardCard";
import StatusBadge from "../../components/StatusBadge";
import {
  faUsers,
  faBox,
  faBuilding,
  faClock,
} from "@fortawesome/free-solid-svg-icons";

const AdminDashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
      <p className="text-gray-500 mt-1 mb-8">
        Monitor and manage the FoodBridge platform.
      </p>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <DashboardCard title="Total Users"       value="1,250" icon={faUsers}    />
        <DashboardCard title="Total Donations"   value="430"   icon={faBox}      color="blue"   />
        <DashboardCard title="Organizations"     value="85"    icon={faBuilding} color="purple" />
        <DashboardCard title="Pending Approvals" value="12"    icon={faClock}    color="orange" />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="font-bold text-lg text-gray-800">User Management</h2>
          <p className="text-gray-500 mt-2">Review and manage registered platform users.</p>
          <Link to="/admin/users" className="inline-block mt-5 bg-green-600 text-white px-5 py-2 rounded-lg">
            Manage Users
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="font-bold text-lg text-gray-800">Donation Management</h2>
          <p className="text-gray-500 mt-2">Monitor donations and their current status.</p>
          <Link to="/admin/donations" className="inline-block mt-5 bg-green-600 text-white px-5 py-2 rounded-lg">
            Manage Donations
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="font-bold text-lg text-gray-800">Organization Management</h2>
          <p className="text-gray-500 mt-2">Review and manage registered organizations.</p>
          <Link to="/admin/organizations" className="inline-block mt-5 bg-green-600 text-white px-5 py-2 rounded-lg">
            Manage Organizations
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
