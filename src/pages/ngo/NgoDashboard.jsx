import React, { useState } from "react";
import { Link } from "react-router-dom";
import DashboardCard from "../../components/DashboardCard";
import StatusBadge from "../../components/StatusBadge";
import GenericProgressTracker from "../../components/GenericProgressTracker";
import Toast from "../../components/Toast";
import { useApp } from "../../context/AppContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUtensils,
  faClock,
  faCheckCircle,
  faClipboardList,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

const NgoDashboard = () => {
  const { ngoRequests, advanceNgoRequest, NGO_REQUEST_STAGES } = useApp();
  const [toast, setToast] = useState(null);

  const total = ngoRequests.length;
  const pending = ngoRequests.filter((r) => r.status === "Submitted" || r.status === "Under Review").length;
  const approved = ngoRequests.filter((r) => r.status === "Approved" || r.status === "Collected").length;
  const completed = ngoRequests.filter((r) => r.status === "Completed").length;

  const recent = ngoRequests.slice(0, 5);

  const advance = (r) => {
    const idx = NGO_REQUEST_STAGES.indexOf(r.status);
    const next = NGO_REQUEST_STAGES[idx + 1];
    if (!next) return;
    advanceNgoRequest(r.id, next);
    setToast({ message: `${r.id} moved to ${next}`, type: "success" });
  };

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <h1 className="text-2xl font-bold text-gray-800">NGO Dashboard</h1>
      <p className="text-gray-500 mt-1 mb-8">Move requests from Submitted through Completed.</p>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <DashboardCard title="Total Requests"  value={total}     icon={faClipboardList} />
        <DashboardCard title="Pending"         value={pending}   icon={faClock}         color="orange" />
        <DashboardCard title="Approved"        value={approved}  icon={faUtensils}      color="blue"   />
        <DashboardCard title="Completed"       value={completed} icon={faCheckCircle}   color="purple" />
      </div>

      <div className="bg-white rounded-xl shadow-sm mt-8 overflow-hidden">
        <div className="p-5 flex justify-between items-center">
          <h2 className="font-bold text-lg text-gray-800">My Requests</h2>
          <Link to="/ngo/my-requests" className="text-green-600 text-sm font-semibold">View All</Link>
        </div>

        <div className="divide-y divide-gray-50">
          {recent.map((r) => (
            <div key={r.id} className="p-5 hover:bg-gray-50 transition">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div>
                  <p className="font-semibold text-gray-800">{r.foodName}</p>
                  <p className="text-xs text-gray-400">{r.qty} · From: {r.source} · {r.requestedAt}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>
              <GenericProgressTracker stages={NGO_REQUEST_STAGES} current={r.status} compact />
              {NGO_REQUEST_STAGES[NGO_REQUEST_STAGES.indexOf(r.status) + 1] && (
                <button
                  onClick={() => advance(r)}
                  className="mt-3 inline-flex items-center gap-2 bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Mark as {NGO_REQUEST_STAGES[NGO_REQUEST_STAGES.indexOf(r.status) + 1]}
                  <FontAwesomeIcon icon={faArrowRight} />
                </button>
              )}
            </div>
          ))}
          {recent.length === 0 && (
            <p className="text-center text-gray-400 py-8">No requests yet. <Link to="/ngo/available-food" className="text-green-600 font-semibold">Browse available food →</Link></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NgoDashboard;
