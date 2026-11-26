import React, { useState } from "react";
import { Link } from "react-router-dom";
import DashboardCard from "../../components/DashboardCard";
import StatusBadge from "../../components/StatusBadge";
import GenericProgressTracker from "../../components/GenericProgressTracker";
import Toast from "../../components/Toast";
import { useApp } from "../../context/AppContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileAlt,
  faClock,
  faCheckCircle,
  faCalendarAlt,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

const EventsDashboard = () => {
  const { eventReports, advanceEventReport, EVENT_REPORT_STAGES } = useApp();
  const [toast, setToast] = useState(null);

  const total = eventReports.length;
  const pending = eventReports.filter((r) => r.status === "Reported").length;
  const inProgress = eventReports.filter((r) => ["Matched","Scheduled","Collected"].includes(r.status)).length;
  const completed = eventReports.filter((r) => r.status === "Completed").length;

  const recent = eventReports.slice(0, 5);

  const advance = (r) => {
    const idx = EVENT_REPORT_STAGES.indexOf(r.status);
    const next = EVENT_REPORT_STAGES[idx + 1];
    if (!next) return;
    advanceEventReport(r.id, next);
    setToast({ message: `${r.id} moved to ${next}`, type: "success" });
  };

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Event Organizer Dashboard</h1>
          <p className="text-gray-500 mt-1">Move leftover-food reports from Reported through Completed.</p>
        </div>
        <Link to="/events/report-food" className="bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700">
          + Report Food
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <DashboardCard title="Total Reports"   value={total}      icon={faFileAlt}     />
        <DashboardCard title="Reported"        value={pending}    icon={faClock}       color="orange" />
        <DashboardCard title="In Progress"     value={inProgress} icon={faCalendarAlt} color="blue"   />
        <DashboardCard title="Completed"       value={completed}  icon={faCheckCircle} color="purple" />
      </div>

      <div className="bg-white rounded-xl shadow-sm mt-8 overflow-hidden">
        <div className="p-5 flex justify-between items-center">
          <h2 className="font-bold text-lg text-gray-800">Recent Food Reports</h2>
          <Link to="/events/my-reports" className="text-green-600 text-sm font-semibold">View All</Link>
        </div>

        <div className="divide-y divide-gray-50">
          {recent.map((r) => (
            <div key={r.id} className="p-5 hover:bg-gray-50 transition">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div>
                  <p className="font-semibold text-gray-800">{r.eventName || r.foodName}</p>
                  <p className="text-xs text-gray-400">{r.quantity} {r.unit} · {r.reportedAt}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>
              <GenericProgressTracker stages={EVENT_REPORT_STAGES} current={r.status} compact />
              {EVENT_REPORT_STAGES[EVENT_REPORT_STAGES.indexOf(r.status) + 1] && (
                <button
                  onClick={() => advance(r)}
                  className="mt-3 inline-flex items-center gap-2 bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Mark as {EVENT_REPORT_STAGES[EVENT_REPORT_STAGES.indexOf(r.status) + 1]}
                  <FontAwesomeIcon icon={faArrowRight} />
                </button>
              )}
            </div>
          ))}
          {recent.length === 0 && (
            <p className="text-center text-gray-400 py-8">No reports yet. <Link to="/events/report-food" className="text-green-600 font-semibold">Report surplus food →</Link></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsDashboard;
