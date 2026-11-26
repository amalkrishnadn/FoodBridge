import React, { useState } from "react";
import { Link } from "react-router-dom";
import DashboardCard from "../../components/DashboardCard";
import StatusBadge from "../../components/StatusBadge";
import GenericProgressTracker from "../../components/GenericProgressTracker";
import Toast from "../../components/Toast";
import { useApp } from "../../context/AppContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faClock,
  faCheckCircle,
  faUsers,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

const DonorDashboard = () => {
  const { donations, advanceDonation, DONATION_STAGES } = useApp();
  const [toast, setToast] = useState(null);

  const total = donations.length;
  const pending = donations.filter((d) => d.status === "Pending" || d.status === "Available").length;
  const completed = donations.filter((d) => d.status === "Completed").length;
  const requested = donations.filter((d) => d.status === "Requested" || d.status === "Approved").length;

  const recent = donations.slice(0, 5);

  const advance = (d) => {
    const idx = DONATION_STAGES.indexOf(d.status);
    const next = DONATION_STAGES[idx + 1];
    if (!next) return;
    advanceDonation(d.id, next);
    setToast({ message: `${d.id} moved to ${next}`, type: "success" });
  };

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Donor Dashboard</h1>
          <p className="text-gray-500 mt-1">Update each donation from Available through Completed.</p>
        </div>
        <Link to="/donor/add-donation" className="bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700">
          + Add Donation
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <DashboardCard title="Total Donations"   value={total}     icon={faBox}         />
        <DashboardCard title="Active / Pending"  value={pending}   icon={faClock}       color="orange" />
        <DashboardCard title="Completed"         value={completed} icon={faCheckCircle} color="blue"   />
        <DashboardCard title="Partner Requests"  value={requested} icon={faUsers}       color="purple" />
      </div>

      <div className="bg-white rounded-xl shadow-sm mt-8 overflow-hidden">
        <div className="p-5 flex justify-between items-center">
          <h2 className="font-bold text-lg text-gray-800">Recent Donations</h2>
          <Link to="/donor/my-donations" className="text-green-600 text-sm font-semibold">View All</Link>
        </div>

        <div className="divide-y divide-gray-50">
          {recent.map((d) => (
            <div key={d.id} className="p-5 hover:bg-gray-50 transition">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div>
                  <p className="font-semibold text-gray-800">{d.foodName}</p>
                  <p className="text-xs text-gray-400">{d.quantity} {d.unit} · {d.createdAt}</p>
                </div>
                <StatusBadge status={d.status} />
              </div>
              <GenericProgressTracker stages={DONATION_STAGES} current={d.status} compact />
              {DONATION_STAGES[DONATION_STAGES.indexOf(d.status) + 1] && (
                <button
                  onClick={() => advance(d)}
                  className="mt-3 inline-flex items-center gap-2 bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Mark as {DONATION_STAGES[DONATION_STAGES.indexOf(d.status) + 1]}
                  <FontAwesomeIcon icon={faArrowRight} />
                </button>
              )}
            </div>
          ))}
          {recent.length === 0 && (
            <p className="text-center text-gray-400 py-8">No donations yet. <Link to="/donor/add-donation" className="text-green-600 font-semibold">Add one now →</Link></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;
