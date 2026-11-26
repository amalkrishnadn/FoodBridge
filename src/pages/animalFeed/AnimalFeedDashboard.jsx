import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDrumstickBite, faBox, faCheckCircle, faTruck,
  faArrowRight, faLeaf, faChevronDown, faChevronUp, faForward, faBan,
} from "@fortawesome/free-solid-svg-icons";
import DashboardCard from "../../components/DashboardCard";
import StatusBadge from "../../components/StatusBadge";
import GenericProgressTracker from "../../components/GenericProgressTracker";
import Toast from "../../components/Toast";
import { useApp } from "../../context/AppContext";

const AnimalFeedDashboard = () => {
  const { animalFeedReqs, advanceAnimalFeed, deleteAnimalFeedReq, ANIMAL_FEED_STAGES } = useApp();

  const [toast, setToast] = useState({ message: "", type: "success" });
  const [expanded, setExpanded] = useState(null);

  const showToast = (msg, type = "success") => setToast({ message: msg, type });
  const closeToast = () => setToast({ message: "", type: "success" });

  const total = animalFeedReqs.length;
  const active = animalFeedReqs.filter((r) => !["Completed", "Cancelled"].includes(r.status)).length;
  const completed = animalFeedReqs.filter((r) => r.status === "Completed").length;

  const getNextStage = (current) => {
    const idx = ANIMAL_FEED_STAGES.indexOf(current);
    return idx >= 0 && idx < ANIMAL_FEED_STAGES.length - 1 ? ANIMAL_FEED_STAGES[idx + 1] : null;
  };

  const handleAdvance = (r) => {
    const next = getNextStage(r.status);
    if (!next) return;
    advanceAnimalFeed(r.id, next);
    showToast(`Request moved to "${next}"`);
  };

  const recentActivity = [
    { text: "Collected 15 kg Stale Bread from City Bakery", time: "2 hrs ago" },
    { text: "Request approved for Vegetable Scraps", time: "5 hrs ago" },
    { text: "New animal-feed food listed: Cooked Rice", time: "Yesterday" },
    { text: "Delivered 25 kg feed to Sunrise Cattle Farm", time: "2 days ago" },
  ];

  return (
    <div>
      {toast.message && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}

      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Animal Feed Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage food redirected for animal consumption and farm collections.</p>
        </div>
        <Link to="/animalFeed/available-food" className="bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm font-semibold">
          Browse Available Food
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <DashboardCard title="Total Requests"      value={total}     icon={faDrumstickBite} />
        <DashboardCard title="Active Requests"     value={active}    icon={faBox}           color="orange" />
        <DashboardCard title="Completed"           value={completed} icon={faCheckCircle}   color="blue"   />
        <DashboardCard title="Stages Tracked"      value={ANIMAL_FEED_STAGES.length} icon={faTruck} color="purple" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent requests with progress tracker */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold text-lg text-gray-800">Recent Requests</h2>
            <Link to="/animalFeed/my-requests" className="text-green-600 text-sm font-semibold flex items-center gap-1 hover:text-green-700">
              View All <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
            </Link>
          </div>
          {animalFeedReqs.slice(0, 4).map((r) => {
            const next = getNextStage(r.status);
            const isExp = expanded === r.id;
            return (
              <div key={r.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                    <div>
                      <p className="font-semibold text-gray-800">{r.foodName || r.foodItem || r.id}</p>
                      <p className="text-xs text-gray-400">{r.qty} · {r.requestedAt}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={r.status} />
                      <button onClick={() => setExpanded(isExp ? null : r.id)} className="text-gray-400 hover:text-gray-600 p-1">
                        <FontAwesomeIcon icon={isExp ? faChevronUp : faChevronDown} />
                      </button>
                    </div>
                  </div>
                  <GenericProgressTracker stages={ANIMAL_FEED_STAGES} current={r.status} compact />
                  {next && (
                    <button onClick={() => handleAdvance(r)} className="mt-3 flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700">
                      <FontAwesomeIcon icon={faForward} /> Move to {next}
                    </button>
                  )}
                </div>
                {isExp && (
                  <div className="border-t border-gray-100 bg-gray-50 px-4 py-3">
                    {(r.timeline || []).map((t, i) => (
                      <div key={i} className="flex gap-2 mb-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
                        <p className="text-xs text-gray-500">{t.stage} · {t.time} · {t.note}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          {animalFeedReqs.length === 0 && (
            <p className="text-gray-400 text-sm py-6 text-center">No requests yet. Browse available food to get started.</p>
          )}
        </div>

        {/* Activity feed */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 h-fit">
          <h2 className="font-bold text-lg text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-700">{a.text}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimalFeedDashboard;
