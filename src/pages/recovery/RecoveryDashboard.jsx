import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLeaf, faRecycle, faCheckDouble, faWeightHanging, faPlus,
  faEye, faPencil, faTrash, faChevronDown, faChevronUp, faForward, faTimes,
} from "@fortawesome/free-solid-svg-icons";
import DashboardCard from "../../components/DashboardCard";
import StatusBadge from "../../components/StatusBadge";
import RecoveryStatusTracker, { RECOVERY_STAGES } from "../../components/RecoveryStatusTracker";
import Toast from "../../components/Toast";
import { useApp } from "../../context/AppContext";
import { Link } from "react-router-dom";
import ConfirmModal from "../../components/ConfirmModal";

const TYPE_COLORS = {
  Composting: "bg-green-100 text-green-700",
  Biogas: "bg-blue-100 text-blue-700",
  "Animal Feed": "bg-orange-100 text-orange-700",
  Other: "bg-gray-100 text-gray-700",
};
const TYPE_FILTERS = ["All", "Composting", "Biogas", "Animal Feed", "Other"];

const RecoveryDashboard = () => {
  const { recoveryMaterials, deleteRecoveryMaterial, advanceRecovery } = useApp();

  const [activeFilter, setActiveFilter] = useState("All");
  const [toast, setToast] = useState({ message: "", type: "success" });
  const [expanded, setExpanded] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const showToast = (msg, type = "success") => setToast({ message: msg, type });
  const closeToast = () => setToast({ message: "", type: "success" });

  const filtered = activeFilter === "All"
    ? recoveryMaterials
    : recoveryMaterials.filter((m) => m.type === activeFilter);

  const totalMaterials = recoveryMaterials.length;
  const inProgress = recoveryMaterials.filter((m) => !["Closed", "Reported"].includes(m.status)).length;
  const completed = recoveryMaterials.filter((m) => m.status === "Closed").length;
  const totalQty = recoveryMaterials.reduce((acc, m) => {
    const val = parseFloat(m.qty);
    return acc + (isNaN(val) ? 0 : val);
  }, 0);

  const getNextStage = (current) => {
    const idx = RECOVERY_STAGES.findIndex((s) => s.key === current);
    return idx >= 0 && idx < RECOVERY_STAGES.length - 1 ? RECOVERY_STAGES[idx + 1].key : null;
  };

  const handleAdvance = (m) => {
    const next = getNextStage(m.status);
    if (!next) return;
    advanceRecovery(m.id, next);
    showToast(`${m.id} moved to "${next}"`);
  };

  const confirmDelete = () => {
    deleteRecoveryMaterial(deleteTarget.id);
    setDeleteTarget(null);
    showToast("Material deleted.", "error");
  };

  return (
    <div>
      {toast.message && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}

      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Recovery Facility Dashboard</h1>
          <p className="text-gray-500 mt-1">Monitor and manage organic material recovery pipeline.</p>
        </div>
        <Link to="/recovery/add-material" className="bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm font-semibold">
          <FontAwesomeIcon icon={faPlus} /> Add Material
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <DashboardCard title="Total Materials" value={totalMaterials} icon={faLeaf}        />
        <DashboardCard title="In Progress"     value={inProgress}    icon={faRecycle}      color="orange" />
        <DashboardCard title="Closed"          value={completed}     icon={faCheckDouble}  color="blue"   />
        <DashboardCard title="Total Weight"    value={`${totalQty} kg`} icon={faWeightHanging} color="purple" />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {TYPE_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
              activeFilter === f ? "bg-green-600 text-white border-green-600" : "bg-white text-gray-600 border-gray-200 hover:border-green-400"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Materials list with progress tracker */}
      <div className="space-y-4">
        {filtered.map((m) => {
          const next = getNextStage(m.status);
          const isExp = expanded === m.id;
          return (
            <div key={m.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-800">{m.name}</span>
                      <span className="text-xs text-gray-400 font-mono">{m.id}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TYPE_COLORS[m.type] || "bg-gray-100 text-gray-700"}`}>{m.type}</span>
                    </div>
                    <p className="text-sm text-gray-500">{m.qty} · Source: {m.source} · {m.reportedOn}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={m.status === "Closed" ? "Completed" : m.status === "Processing" ? "In Progress" : m.status === "Collected" ? "Approved" : m.status === "Reported" ? "Available" : "Pending"} />
                    <button onClick={() => setExpanded(isExp ? null : m.id)} className="text-gray-400 hover:text-gray-600 p-1">
                      <FontAwesomeIcon icon={isExp ? faChevronUp : faChevronDown} />
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <RecoveryStatusTracker status={m.status} />
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {next && (
                    <button onClick={() => handleAdvance(m)} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
                      <FontAwesomeIcon icon={faForward} /> Move to {next}
                    </button>
                  )}
                  <Link to="/recovery/my-materials" className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 text-sm rounded-lg hover:bg-blue-100">
                    <FontAwesomeIcon icon={faEye} /> Details
                  </Link>
                  <button onClick={() => setDeleteTarget(m)} className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 text-sm rounded-lg hover:bg-red-100">
                    <FontAwesomeIcon icon={faTrash} /> Delete
                  </button>
                </div>
              </div>

              {isExp && (
                <div className="border-t border-gray-100 bg-gray-50 px-5 py-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Timeline</p>
                  <div className="space-y-3">
                    {(m.timeline || []).map((t, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-400 mt-1.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">{t.stage}</p>
                          <p className="text-xs text-gray-400">{t.time} · {t.note}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <FontAwesomeIcon icon={faRecycle} className="text-4xl mb-3 text-gray-300" />
            <p>No materials found.</p>
          </div>
        )}
      </div>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Material?"
        message={`Delete "${deleteTarget?.name}"? This cannot be undone.`}
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default RecoveryDashboard;
