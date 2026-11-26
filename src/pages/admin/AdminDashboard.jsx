import React, { useState } from "react";
import DashboardCard from "../../components/DashboardCard";
import VerificationBadge from "../../components/VerificationBadge";
import Toast from "../../components/Toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faBox,
  faBuilding,
  faClock,
  faCheckCircle,
  faTimesCircle,
  faEye,
  faFileAlt,
  faShield,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

/* ── Sample verification applications ─────────────────────────── */
const INITIAL_NGO_APPS = [
  {
    id: "NGO-APP-001",
    orgName: "Care Centre NGO",
    regNumber: "NGO/REG/2024/001",
    contactEmail: "care@centre.org",
    submittedOn: "20 Nov 2026",
    status: "Verification Pending",
    documents: ["Registration Certificate", "Official Email Proof"],
    address: "Kaloor, Kochi, Kerala",
  },
  {
    id: "NGO-APP-002",
    orgName: "Green Earth NGO",
    regNumber: "NGO/KL/2025/045",
    contactEmail: "info@greenearth.org",
    submittedOn: "18 Nov 2026",
    status: "Verification Pending",
    documents: ["Registration Certificate"],
    address: "Thrissur, Kerala",
  },
  {
    id: "NGO-APP-003",
    orgName: "Hope Foundation",
    regNumber: "NGO/TN/2023/120",
    contactEmail: "hope@foundation.org",
    submittedOn: "15 Nov 2026",
    status: "Verified",
    documents: ["Registration Certificate", "Tax Exemption Letter"],
    address: "Chennai, Tamil Nadu",
  },
];

const INITIAL_EVENT_APPS = [
  {
    id: "EVT-APP-001",
    orgName: "City Events Co",
    orgType: "Event Management Company",
    regNumber: "EV/KL/2025/009",
    contactEmail: "city@events.com",
    submittedOn: "22 Nov 2026",
    status: "Verification Pending",
    documents: ["Business Registration Document", "Previous Event Photos"],
    address: "Ernakulam, Kochi, Kerala",
  },
  {
    id: "EVT-APP-002",
    orgName: "Royal Occasions",
    orgType: "Wedding Planner",
    regNumber: "EV/KL/2024/033",
    contactEmail: "royal@occasions.in",
    submittedOn: "19 Nov 2026",
    status: "Rejected",
    documents: ["Organization Registration Certificate"],
    address: "Trivandrum, Kerala",
  },
];

/* ── Detail modal ──────────────────────────────────────────────── */
function DetailModal({ app, onClose, onApprove, onReject }) {
  if (!app) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4 py-8 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-bold text-lg text-gray-800">{app.orgName}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        <div className="space-y-2 text-sm text-gray-700 mb-4">
          <p><span className="font-medium text-gray-500">ID:</span> {app.id}</p>
          <p><span className="font-medium text-gray-500">Type:</span> {app.orgType || "NGO"}</p>
          <p><span className="font-medium text-gray-500">Reg. Number:</span> {app.regNumber}</p>
          <p><span className="font-medium text-gray-500">Email:</span> {app.contactEmail}</p>
          <p><span className="font-medium text-gray-500">Address:</span> {app.address}</p>
          <p><span className="font-medium text-gray-500">Submitted:</span> {app.submittedOn}</p>
          <div>
            <span className="font-medium text-gray-500">Status: </span>
            <VerificationBadge status={app.status} />
          </div>
        </div>

        <div className="mb-5">
          <p className="font-medium text-gray-500 text-sm mb-2">Submitted Documents:</p>
          <div className="space-y-1">
            {app.documents.map((d) => (
              <div key={d} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
                <FontAwesomeIcon icon={faFileAlt} className="text-green-500" />
                {d}
              </div>
            ))}
          </div>
        </div>

        {app.status === "Verification Pending" && (
          <div className="flex gap-3">
            <button
              onClick={() => { onApprove(app.id); onClose(); }}
              className="flex-1 bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 text-sm flex items-center justify-center gap-1"
            >
              <FontAwesomeIcon icon={faCheckCircle} /> Approve
            </button>
            <button
              onClick={() => { onReject(app.id); onClose(); }}
              className="flex-1 bg-red-500 text-white py-2.5 rounded-lg font-semibold hover:bg-red-600 text-sm flex items-center justify-center gap-1"
            >
              <FontAwesomeIcon icon={faTimesCircle} /> Reject
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Application table ─────────────────────────────────────────── */
function AppTable({ apps, onApprove, onReject, onView }) {
  if (apps.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        <FontAwesomeIcon icon={faShield} className="text-4xl mb-2 text-gray-200" />
        <p>No applications in this category</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-500">
          <tr>
            <th className="p-4">Organization</th>
            <th className="p-4">Reg. Number</th>
            <th className="p-4">Email</th>
            <th className="p-4">Submitted</th>
            <th className="p-4">Status</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {apps.map((app) => (
            <tr key={app.id} className="border-t hover:bg-gray-50">
              <td className="p-4 font-medium text-gray-800">
                {app.orgName}
                {app.orgType && <div className="text-xs text-gray-400">{app.orgType}</div>}
              </td>
              <td className="p-4 font-mono text-xs text-gray-600">{app.regNumber}</td>
              <td className="p-4 text-gray-500">{app.contactEmail}</td>
              <td className="p-4 text-gray-500">{app.submittedOn}</td>
              <td className="p-4"><VerificationBadge status={app.status} /></td>
              <td className="p-4">
                <div className="flex gap-1 flex-wrap">
                  <button
                    onClick={() => onView(app)}
                    className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-lg hover:bg-blue-100 font-semibold flex items-center gap-1"
                  >
                    <FontAwesomeIcon icon={faEye} /> View
                  </button>
                  {app.status === "Verification Pending" && (
                    <>
                      <button
                        onClick={() => onApprove(app.id)}
                        className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded-lg hover:bg-green-100 font-semibold flex items-center gap-1"
                      >
                        <FontAwesomeIcon icon={faCheckCircle} /> Approve
                      </button>
                      <button
                        onClick={() => onReject(app.id)}
                        className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-lg hover:bg-red-100 font-semibold flex items-center gap-1"
                      >
                        <FontAwesomeIcon icon={faTimesCircle} /> Reject
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Admin Dashboard ───────────────────────────────────────────── */
const AdminDashboard = () => {
  const [tab, setTab] = useState("overview"); // overview | ngo | events
  const [ngoApps, setNgoApps] = useState(INITIAL_NGO_APPS);
  const [eventApps, setEventApps] = useState(INITIAL_EVENT_APPS);
  const [toast, setToast] = useState(null);
  const [detailApp, setDetailApp] = useState(null);

  const updateStatus = (setFn, id, status) => {
    setFn((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
    setToast({ msg: `Application ${status === "Verified" ? "approved" : "rejected"} successfully.`, type: status === "Verified" ? "success" : "error" });
  };

  const approveNgo = (id) => updateStatus(setNgoApps, id, "Verified");
  const rejectNgo = (id) => updateStatus(setNgoApps, id, "Rejected");
  const approveEvent = (id) => updateStatus(setEventApps, id, "Verified");
  const rejectEvent = (id) => updateStatus(setEventApps, id, "Rejected");

  const pendingNgo = ngoApps.filter((a) => a.status === "Verification Pending").length;
  const pendingEvent = eventApps.filter((a) => a.status === "Verification Pending").length;

  return (
    <div>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      {detailApp && (
        <DetailModal
          app={detailApp}
          onClose={() => setDetailApp(null)}
          onApprove={detailApp.id.startsWith("NGO") ? approveNgo : approveEvent}
          onReject={detailApp.id.startsWith("NGO") ? rejectNgo : rejectEvent}
        />
      )}

      <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
      <p className="text-gray-500 mt-1 mb-6">Monitor and manage the FoodBridge platform.</p>

      {/* Nav tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 pb-0">
        {[
          { key: "overview", label: "Overview" },
          { key: "ngo", label: `NGO Verification${pendingNgo ? ` (${pendingNgo})` : ""}` },
          { key: "events", label: `Event Organizer Verification${pendingEvent ? ` (${pendingEvent})` : ""}` },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 rounded-t-lg text-sm font-semibold border-b-2 transition ${
              tab === t.key
                ? "border-green-600 text-green-700 bg-white"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Overview Tab ── */}
      {tab === "overview" && (
        <>
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
            <DashboardCard title="Total Users"       value="1,250" icon={faUsers}    />
            <DashboardCard title="Total Donations"   value="430"   icon={faBox}      color="blue"   />
            <DashboardCard title="Organizations"     value="85"    icon={faBuilding} color="purple" />
            <DashboardCard title="Pending Approvals" value={pendingNgo + pendingEvent} icon={faClock} color="orange" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="font-bold text-lg text-gray-800">User Management</h2>
              <p className="text-gray-500 mt-2">Review and manage registered platform users.</p>
              <Link to="/admin/users" className="inline-block mt-5 bg-green-600 text-white px-5 py-2 rounded-lg text-sm">
                Manage Users
              </Link>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="font-bold text-lg text-gray-800">Donation Management</h2>
              <p className="text-gray-500 mt-2">Monitor donations and their current status.</p>
              <Link to="/admin/donations" className="inline-block mt-5 bg-green-600 text-white px-5 py-2 rounded-lg text-sm">
                Manage Donations
              </Link>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="font-bold text-lg text-gray-800">Organization Management</h2>
              <p className="text-gray-500 mt-2">Review and manage registered organizations.</p>
              <Link to="/admin/organizations" className="inline-block mt-5 bg-green-600 text-white px-5 py-2 rounded-lg text-sm">
                Manage Organizations
              </Link>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border-2 border-orange-200">
              <h2 className="font-bold text-lg text-gray-800">Verification Requests</h2>
              <p className="text-gray-500 mt-2">{pendingNgo + pendingEvent} pending verification applications.</p>
              <div className="flex gap-2 mt-5">
                <button onClick={() => setTab("ngo")} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm">
                  NGO ({pendingNgo})
                </button>
                <button onClick={() => setTab("events")} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
                  Events ({pendingEvent})
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── NGO Verification Tab ── */}
      {tab === "ngo" && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b flex justify-between items-center">
            <h2 className="font-bold text-lg text-gray-800">NGO Verification Applications</h2>
            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-semibold">
              {pendingNgo} Pending
            </span>
          </div>
          <AppTable
            apps={ngoApps}
            onApprove={approveNgo}
            onReject={rejectNgo}
            onView={setDetailApp}
          />
        </div>
      )}

      {/* ── Event Organizer Verification Tab ── */}
      {tab === "events" && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b flex justify-between items-center">
            <h2 className="font-bold text-lg text-gray-800">Event Organizer Verification Applications</h2>
            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-semibold">
              {pendingEvent} Pending
            </span>
          </div>
          <AppTable
            apps={eventApps}
            onApprove={approveEvent}
            onReject={rejectEvent}
            onView={setDetailApp}
          />
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
