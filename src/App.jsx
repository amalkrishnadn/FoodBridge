import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Public pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Layout
import DashboardLayout from "./layouts/DashboardLayout";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminDonations from "./pages/admin/AdminDonations";
import AdminOrganizations from "./pages/admin/AdminOrganizations";

// Donor pages
import DonorDashboard from "./pages/donor/DonorDashboard";
import DonorAddDonation from "./pages/donor/DonorAddDonation";
import DonorMyDonations from "./pages/donor/DonorMyDonations";
import DonorRequests from "./pages/donor/DonorRequests";

// NGO pages
import NgoDashboard from "./pages/ngo/NgoDashboard";
import NgoAvailableFood from "./pages/ngo/NgoAvailableFood";
import NgoMyRequests from "./pages/ngo/NgoMyRequests";

// Volunteer pages
import VolunteerDashboard from "./pages/volunteer/VolunteerDashboard";
import VolunteerMyTasks from "./pages/volunteer/VolunteerMyTasks";

// Events (Event Organizer) pages
import EventsDashboard from "./pages/events/EventsDashboard";
import EventsReportFood from "./pages/events/EventsReportFood";

// Recovery Facility pages
import RecoveryDashboard from "./pages/recovery/RecoveryDashboard";
import RecoveryAvailableFood from "./pages/recovery/RecoveryAvailableFood";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public ── */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ── Admin ── */}
        <Route path="/admin" element={<DashboardLayout role="admin" />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="donations" element={<AdminDonations />} />
          <Route path="organizations" element={<AdminOrganizations />} />
        </Route>

        {/* ── Donor ── */}
        <Route path="/donor" element={<DashboardLayout role="donor" />}>
          <Route index element={<DonorDashboard />} />
          <Route path="add-donation" element={<DonorAddDonation />} />
          <Route path="my-donations" element={<DonorMyDonations />} />
          <Route path="requests" element={<DonorRequests />} />
        </Route>

        {/* ── NGO ── */}
        <Route path="/ngo" element={<DashboardLayout role="ngo" />}>
          <Route index element={<NgoDashboard />} />
          <Route path="available-food" element={<NgoAvailableFood />} />
          <Route path="my-requests" element={<NgoMyRequests />} />
        </Route>

        {/* ── Volunteer ── */}
        <Route path="/volunteer" element={<DashboardLayout role="volunteer" />}>
          <Route index element={<VolunteerDashboard />} />
          <Route path="my-tasks" element={<VolunteerMyTasks />} />
        </Route>

        {/* ── Events / Event Organizer ── */}
        <Route path="/events" element={<DashboardLayout role="events" />}>
          <Route index element={<EventsDashboard />} />
          <Route path="report-food" element={<EventsReportFood />} />
        </Route>

        {/* ── Recovery Facility ── */}
        <Route path="/recovery" element={<DashboardLayout role="recovery" />}>
          <Route index element={<RecoveryDashboard />} />
          <Route path="available-food" element={<RecoveryAvailableFood />} />
        </Route>

        {/* ── Fallback ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
