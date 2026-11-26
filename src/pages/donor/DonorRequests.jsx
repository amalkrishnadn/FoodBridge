import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHandshake, faCheckCircle, faClock, faClipboardList,
  faChevronDown, faChevronUp, faForward, faBan,
} from "@fortawesome/free-solid-svg-icons";
import { useApp } from "../../context/AppContext";
import GenericProgressTracker from "../../components/GenericProgressTracker";
import StatusBadge from "../../components/StatusBadge";
import Toast from "../../components/Toast";
import ConfirmModal from "../../components/ConfirmModal";

const DonorRequests = () => {
  const { ngoRequests, advanceNgoRequest, NGO_REQUEST_STAGES } = useApp();

  const [toast, setToast] = useState({ message: "", type: "success" });
  const [expanded, setExpanded] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");

  const showToast = (msg, type = "success") => setToast({ message: msg, type });
  const closeToast = () => setToast({ message: "", type: "success" });

  const statuses = ["All", ...NGO_REQUEST_STAGES, "Rejected"];
  const filtered = filterStatus === "All" ? ngoRequests : ngoRequests.filter((r) => r.status === filterStatus);

  const nextStage = (status) => {
    const idx = NGO_REQUEST_STAGES.indexOf(status);
    return idx >= 0 && idx < NGO_REQUEST_STAGES.length - 1 ? NGO_REQUEST_STAGES[idx + 1] : null;
  };

  const handleApprove = (r) => {
    if (r.status === "Submitted" || r.status === "Under Review") {
      advanceNgoRequest(r.id, "Approved");
      showToast(`Request ${r.id} approved!`);
    }
  };

  const handleAdvance = (r) => {
    const next = nextStage(r.status);
    if (!next || next === "Approved") return;
    advanceNgoRequest(r.id, next);
    showToast(`Request ${r.id} moved to "${next}"`);
  };

  const handleReject = (r) => {
    advanceNgoRequest(r.id, "Rejected", "Donor rejected the request");
    showToast(`Request ${r.id} rejected.`, "error");
  };

  const totalReqs = ngoRequests.length;
  const pendingReqs = ngoRequests.filter((r) => r.status === "Submitted" || r.status === "Under Review").length;
  const approvedReqs = ngoRequests.filter((r) => r.status === "Approved").length;

  return (
    <div>
      {toast.message && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">NGO Requests</h1>
        <p className="text-gray-500 mt-1">Review and approve incoming requests for your donations.</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total", value: totalReqs, color: "bg-green-50 text-green-600", icon: faClipboardList },
          { label: "Pending", value: pendingReqs, color: "bg-orange-50 text-orange-600", icon: faClock },
          { label: "Approved", value: approvedReqs, color: "bg-blue-50 text-blue-600", icon: faCheckCircle },
        ].map(({ label, value, color, icon }) => (
          <div key={label} className={`${color} rounded-xl p-4 flex items-center gap-3`}>
            <FontAwesomeIcon icon={icon} className="text-lg" />
            <div>
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs font-medium opacity-80">{label}</p>
            </div>
          </div>
        ))}
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
          const isExpanded = expanded === r.id;
          const canAction = r.status === "Submitted" || r.status === "Under Review";
          const later = nextStage(r.status);
          const canAdvanceLater = later && later !== "Approved" && !["Rejected", "Cancelled", "Completed"].includes(r.status);
          return (
            <div key={r.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <FontAwesomeIcon icon={faHandshake} className="text-blue-500" />
                      <span className="font-semibold text-gray-800">{r.foodName}</span>
                      <span className="text-xs text-gray-400 font-mono">{r.id}</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {r.qty} · Requested for: {r.requestedFor}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">Requested at: {r.requestedAt}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={r.status} />
                    <button onClick={() => setExpanded(isExpanded ? null : r.id)} className="text-gray-400 hover:text-gray-600 p-1">
                      <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} />
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <GenericProgressTracker stages={NGO_REQUEST_STAGES} current={r.status} />
                </div>

                {canAction && (
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleApprove(r)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                    >
                      <FontAwesomeIcon icon={faCheckCircle} /> Approve
                    </button>
                    <button
                      onClick={() => handleReject(r)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 text-sm rounded-lg hover:bg-red-100"
                    >
                      <FontAwesomeIcon icon={faBan} /> Reject
                    </button>
                  </div>
                )}
                {canAdvanceLater && (
                  <button
                    onClick={() => handleAdvance(r)}
                    className="mt-4 flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                  >
                    <FontAwesomeIcon icon={faForward} /> Mark as {later}
                  </button>
                )}
              </div>

              {isExpanded && (
                <div className="border-t border-gray-100 bg-gray-50 px-5 py-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Timeline</p>
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
            <FontAwesomeIcon icon={faClipboardList} className="text-4xl mb-3 text-gray-300" />
            <p>No requests found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonorRequests;
