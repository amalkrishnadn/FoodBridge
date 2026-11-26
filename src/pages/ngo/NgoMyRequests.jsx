import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown, faChevronUp, faForward, faBan, faEye, faPencil, faTimes, faFloppyDisk,
  faHandshake, faCheckCircle, faClock, faClipboardCheck,
} from "@fortawesome/free-solid-svg-icons";
import { useApp } from "../../context/AppContext";
import GenericProgressTracker from "../../components/GenericProgressTracker";
import StatusBadge from "../../components/StatusBadge";
import Toast from "../../components/Toast";
import ConfirmModal from "../../components/ConfirmModal";

const NgoMyRequests = () => {
  const { ngoRequests, advanceNgoRequest, cancelNgoRequest, NGO_REQUEST_STAGES } = useApp();

  const [toast, setToast] = useState({ message: "", type: "success" });
  const [expanded, setExpanded] = useState(null);
  const [cancelConfirm, setCancelConfirm] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");

  const showToast = (msg, type = "success") => setToast({ message: msg, type });
  const closeToast = () => setToast({ message: "", type: "success" });

  const statuses = ["All", ...NGO_REQUEST_STAGES, "Rejected", "Cancelled"];
  const filtered = filterStatus === "All"
    ? ngoRequests
    : ngoRequests.filter((r) => r.status === filterStatus);

  const getNextStage = (current) => {
    const idx = NGO_REQUEST_STAGES.indexOf(current);
    return idx >= 0 && idx < NGO_REQUEST_STAGES.length - 1 ? NGO_REQUEST_STAGES[idx + 1] : null;
  };

  const handleAdvance = (r) => {
    const next = getNextStage(r.status);
    if (!next) return;
    advanceNgoRequest(r.id, next);
    showToast(`Request moved to "${next}"`);
  };

  const handleCancel = (r) => {
    cancelNgoRequest(r.id);
    setCancelConfirm(null);
    showToast("Request marked as Cancelled.", "error");
  };

  return (
    <div>
      {toast.message && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Requests</h1>
        <p className="text-gray-500 mt-1">Track all food collection requests.</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-5">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
              filterStatus === s ? "bg-green-600 text-white border-green-600" : "bg-white text-gray-600 border-gray-200 hover:border-green-400"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((r) => {
          const next = getNextStage(r.status);
          const isExpanded = expanded === r.id;
          const isFinal = r.status === "Completed" || r.status === "Cancelled";
          return (
            <div key={r.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <FontAwesomeIcon icon={faHandshake} className="text-green-500" />
                      <span className="font-semibold text-gray-800">{r.foodName}</span>
                      <span className="text-xs text-gray-400 font-mono">{r.id}</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {r.qty} · From: {r.source} · Requested: {r.requestedAt}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={r.status} />
                    <button onClick={() => setExpanded(isExpanded ? null : r.id)} className="text-gray-400 hover:text-gray-600 p-1">
                      <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} />
                    </button>
                  </div>
                </div>

                {/* Progress tracker */}
                <div className="mt-4">
                  <GenericProgressTracker stages={NGO_REQUEST_STAGES} current={r.status} />
                </div>

                {/* Actions */}
                {!isFinal && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {next && (
                      <button
                        onClick={() => handleAdvance(r)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                      >
                        <FontAwesomeIcon icon={faForward} /> Move to {next}
                      </button>
                    )}
                    <button
                      onClick={() => setCancelConfirm(r)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 text-sm rounded-lg hover:bg-red-100"
                    >
                      <FontAwesomeIcon icon={faBan} /> Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Timeline */}
              {isExpanded && (
                <div className="border-t border-gray-100 bg-gray-50 px-5 py-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Activity Timeline</p>
                  <div className="space-y-3">
                    {(r.timeline || []).map((t, i) => (
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
            <FontAwesomeIcon icon={faClipboardCheck} className="text-4xl mb-3 text-gray-300" />
            <p>No requests found.</p>
          </div>
        )}
      </div>

      <ConfirmModal
        open={!!cancelConfirm}
        title="Cancel Request?"
        message={`Are you sure you want to cancel the request for "${cancelConfirm?.foodName}"?`}
        danger
        onConfirm={() => handleCancel(cancelConfirm)}
        onCancel={() => setCancelConfirm(null)}
      />
    </div>
  );
};

export default NgoMyRequests;
