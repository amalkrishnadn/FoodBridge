import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const DashboardLayout = ({ role }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role={role} />

      <div className="flex-1 min-w-0">
        <Navbar role={role} />

        <main className="p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
