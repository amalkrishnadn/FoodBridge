import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil, faTrash, faEye, faTimes, faForward, faChevronDown, faChevronUp,
  faLeaf, faCalendarAlt, faMapMarkerAlt, faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { useApp } from "../../context/AppContext";
import GenericProgressTracker from "../../components/GenericProgressTracker";
import StatusBadge from "../../components/StatusBadge";
import Toast from "../../components/Toast";
import ConfirmModal from "../../components/ConfirmModal";

const EventsMyReports = () => {
  const { eventReports, updateEventReport, deleteEventReport, advanceEventReport, EVENT_REPORT_STAGES } = useApp();

  const [toast, setToast] = useState({ message: "", type: "success" });
  const [expanded, setExpanded] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");

  const showToast = (message, type = "success") => setToast({ message, type });
  const closeToast = () => setToast({ message: "", type: "success" });

  const statuses = ["All", ...EVENT_REPORT_STAGES];
  const filtered = filterStatus === "All" ? eventReports : eventReports.filter((r) => r.status === filterStatus);

  const getNextStage = (current) => {
    const idx = EVENT_REPORT_STAGES.indexOf(current);
    return idx >= 0 && idx < EVENT_REPORT_STAGES.length - 1 ? EVENT_REPORT_STAGES[idx + 1] : null;
  };

  const handleAdvance = (report) => {
    const next = getNextStage(report.status);
    if (!next) return;
    advanceEventReport(report.id, next);
    showToast(`Report ${report.id} moved to "${next}"`);
  };

  const openEdit = (r) => {
    setEditItem(r);
    setEditForm({ eventName: r.eventName || "", foodName: r.foodName || "", quantity: r.quantity || "", unit: r.unit || "", notes: r.notes || "" });
  };

  const saveEdit = () => {
    updateEventReport(editItem.id, editForm);
    setEditItem(null);
    showToast("Report updated successfully!");
  };

  const confirmDelete = () => {
    deleteEventReport(deleteTarget.id);
    setDeleteTarget(null);
    showToast("Report deleted.", "error");
  };

  return (
    <div>
      {toast.message && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}

      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Food Reports</h1>
          <p className="text-gray-500 mt-1">Track your event surplus food reports.</p>
        </div>
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
          return (
            <div key={r.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <FontAwesomeIcon icon={faLeaf} className="text-green-500" />
                      <span className="font-semibold text-gray-800">{r.eventName || r.foodName}</span>
                      <span className="text-xs text-gray-400 font-mono">{r.id}</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {r.foodItem || r.foodName} · {r.quantity} {r.unit}
                      {r.reportedAt && ` · Reported: ${r.reportedAt}`}
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
                  <GenericProgressTracker stages={EVENT_REPORT_STAGES} current={r.status} />
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {next && (
                    <button
                      onClick={() => handleAdvance(r)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                    >
                      <FontAwesomeIcon icon={faForward} />
                      Move to {next}
                    </button>
                  )}
                  <button onClick={() => openEdit(r)} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 text-sm rounded-lg hover:bg-blue-100">
                    <FontAwesomeIcon icon={faPencil} /> Edit
                  </button>
                  <button onClick={() => setDeleteTarget(r)} className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 text-sm rounded-lg hover:bg-red-100">
                    <FontAwesomeIcon icon={faTrash} /> Delete
                  </button>
                </div>
              </div>

              {/* Expanded timeline */}
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
            <FontAwesomeIcon icon={faCalendarAlt} className="text-4xl mb-3 text-gray-300" />
            <p>No reports found.</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editItem && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-bold text-lg text-gray-800">Edit Report</h2>
              <button onClick={() => setEditItem(null)} className="text-gray-400 hover:text-gray-600">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="space-y-4 text-sm">
              {[
                { label: "Event Name", key: "eventName" },
                { label: "Food Name", key: "foodName" },
                { label: "Quantity", key: "quantity" },
                { label: "Unit", key: "unit" },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
                  <input
                    value={editForm[key] || ""}
                    onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-300"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Notes</label>
                <textarea
                  value={editForm.notes || ""}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-300 resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setEditItem(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={saveEdit} className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Report?"
        message={`Are you sure you want to delete report ${deleteTarget?.id}? This cannot be undone.`}
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default EventsMyReports;
