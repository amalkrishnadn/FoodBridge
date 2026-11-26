import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Public pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerificationPending from "./pages/VerificationPending";
import VerificationRejected from "./pages/VerificationRejected";

// Layout
import DashboardLayout from "./layouts/DashboardLayout";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminDonations from "./pages/admin/AdminDonations";
import AdminOrganizations from "./pages/admin/AdminOrganizations";
import AdminStats from "./pages/admin/AdminStats";
import AdminRecovery from "./pages/admin/AdminRecovery";

// Donor pages
import DonorDashboard from "./pages/donor/DonorDashboard";
import DonorAddDonation from "./pages/donor/DonorAddDonation";
import DonorMyDonations from "./pages/donor/DonorMyDonations";
import DonorRequests from "./pages/donor/DonorRequests";

// NGO pages
import NgoDashboard from "./pages/ngo/NgoDashboard";
import NgoAvailableFood from "./pages/ngo/NgoAvailableFood";
import NgoMyRequests from "./pages/ngo/NgoMyRequests";
import NgoRegister from "./pages/ngo/NgoRegister";
import NgoVerificationPending from "./pages/ngo/NgoVerificationPending";

// Volunteer pages
import VolunteerDashboard from "./pages/volunteer/VolunteerDashboard";
import VolunteerMyTasks from "./pages/volunteer/VolunteerMyTasks";

// Events (Event Organizer) pages
import EventsDashboard from "./pages/events/EventsDashboard";
import EventsReportFood from "./pages/events/EventsReportFood";
import EventOrganizerRegister from "./pages/events/EventOrganizerRegister";
import EventsMyReports from "./pages/events/EventsMyReports";

// Recovery Facility pages
import RecoveryDashboard from "./pages/recovery/RecoveryDashboard";
import RecoveryAvailableFood from "./pages/recovery/RecoveryAvailableFood";
import RecoveryMyMaterials from "./pages/recovery/RecoveryMyMaterials";
import RecoveryAddMaterial from "./pages/recovery/RecoveryAddMaterial";

// Animal Feed pages
import AnimalFeedDashboard from "./pages/animalFeed/AnimalFeedDashboard";
import AnimalFeedAvailableFood from "./pages/animalFeed/AnimalFeedAvailableFood";
import AnimalFeedMyRequests from "./pages/animalFeed/AnimalFeedMyRequests";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public ── */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verification-pending" element={<VerificationPending />} />
        <Route path="/verification-rejected" element={<VerificationRejected />} />

        {/* ── NGO Registration & Verification ── */}
        <Route path="/ngo-register" element={<NgoRegister />} />
        <Route path="/ngo-verification-pending" element={<NgoVerificationPending />} />

        {/* ── Event Organizer Registration ── */}
        <Route path="/event-organizer-register" element={<EventOrganizerRegister />} />

        {/* ── Admin ── */}
        <Route path="/admin" element={<DashboardLayout role="admin" />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="donations" element={<AdminDonations />} />
          <Route path="organizations" element={<AdminOrganizations />} />
          <Route path="stats" element={<AdminStats />} />
          <Route path="recovery" element={<AdminRecovery />} />
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
          <Route path="my-reports" element={<EventsMyReports />} />
        </Route>

        {/* ── Recovery Facility ── */}
        <Route path="/recovery" element={<DashboardLayout role="recovery" />}>
          <Route index element={<RecoveryDashboard />} />
          <Route path="available-food" element={<RecoveryAvailableFood />} />
          <Route path="my-materials" element={<RecoveryMyMaterials />} />
          <Route path="add-material" element={<RecoveryAddMaterial />} />
        </Route>

        {/* ── Animal Feed Handler ── */}
        <Route path="/animalFeed" element={<DashboardLayout role="animalFeed" />}>
          <Route index element={<AnimalFeedDashboard />} />
          <Route path="available-food" element={<AnimalFeedAvailableFood />} />
          <Route path="my-requests" element={<AnimalFeedMyRequests />} />
        </Route>

        {/* ── Fallback ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
