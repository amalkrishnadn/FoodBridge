import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown, faChevronUp, faForward, faBan, faTimes,
  faPencil, faEye, faFloppyDisk, faDrumstickBite,
} from "@fortawesome/free-solid-svg-icons";
import { useApp } from "../../context/AppContext";
import GenericProgressTracker from "../../components/GenericProgressTracker";
import StatusBadge from "../../components/StatusBadge";
import Toast from "../../components/Toast";
import ConfirmModal from "../../components/ConfirmModal";

const AnimalFeedMyRequests = () => {
  const { animalFeedReqs, advanceAnimalFeed, cancelAnimalFeedReq, updateAnimalFeedReq, ANIMAL_FEED_STAGES } = useApp();

  const [toast, setToast] = useState({ message: "", type: "success" });
  const [expanded, setExpanded] = useState(null);
  const [cancelConfirm, setCancelConfirm] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [viewItem, setViewItem] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");

  const showToast = (msg, type = "success") => setToast({ message: msg, type });
  const closeToast = () => setToast({ message: "", type: "success" });

  const statuses = ["All", ...ANIMAL_FEED_STAGES, "Cancelled"];
  const filtered = filterStatus === "All"
    ? animalFeedReqs
    : animalFeedReqs.filter((r) => r.status === filterStatus);

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

  const handleCancel = (r) => {
    cancelAnimalFeedReq(r.id);
    setCancelConfirm(null);
    showToast("Request marked as Cancelled.", "error");
  };

  const openEdit = (r) => {
    setEditItem(r);
    setEditForm({ farm: r.farm || r.farmDestination || "", pickupTime: r.pickupTime || "", notes: r.notes || "" });
  };

  return (
    <div>
      {toast.message && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Collection Requests</h1>
        <p className="text-gray-500 mt-1">Track your animal-feed collection requests.</p>
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
                      <FontAwesomeIcon icon={faDrumstickBite} className="text-orange-500" />
                      <span className="font-semibold text-gray-800">{r.foodName || r.foodItem || r.id}</span>
                      <span className="text-xs text-gray-400 font-mono">{r.id}</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {r.qty} · Source: {r.source || r.donor} · {r.requestedAt}
                    </p>
                    {(r.farm || r.farmDestination) && (
                      <p className="text-xs text-gray-400 mt-0.5">Farm: {r.farm || r.farmDestination}</p>
                    )}
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
                  <GenericProgressTracker stages={ANIMAL_FEED_STAGES} current={r.status} />
                </div>

                {/* Actions */}
                {!isFinal && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {next && (
                      <button onClick={() => handleAdvance(r)} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700">
                        <FontAwesomeIcon icon={faForward} /> Move to {next}
                      </button>
                    )}
                    <button onClick={() => openEdit(r)} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 text-sm rounded-lg hover:bg-blue-100">
                      <FontAwesomeIcon icon={faPencil} /> Edit
                    </button>
                    <button onClick={() => setViewItem(r)} className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 text-sm rounded-lg hover:bg-gray-100">
                      <FontAwesomeIcon icon={faEye} /> View
                    </button>
                    <button onClick={() => setCancelConfirm(r)} className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 text-sm rounded-lg hover:bg-red-100">
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
                        <div className="w-2 h-2 rounded-full bg-orange-400 mt-1.5 flex-shrink-0" />
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
            <FontAwesomeIcon icon={faDrumstickBite} className="text-4xl mb-3 text-gray-300" />
            <p>No requests found.</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editItem && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-bold text-lg text-gray-800">Edit Request</h2>
              <button onClick={() => setEditItem(null)} className="text-gray-400 hover:text-gray-600"><FontAwesomeIcon icon={faTimes} /></button>
            </div>
            <div className="space-y-4 text-sm">
              {[
                { label: "Farm / Destination", key: "farm" },
                { label: "Pickup Time", key: "pickupTime" },
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
              <button onClick={() => { updateAnimalFeedReq(editItem.id, { farm: editForm.farm, farmDestination: editForm.farm, pickupTime: editForm.pickupTime, notes: editForm.notes }); showToast("Request updated!"); setEditItem(null); }} className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700">
                <FontAwesomeIcon icon={faFloppyDisk} className="mr-2" /> Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewItem && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setViewItem(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-bold text-lg text-gray-800">Request Details</h2>
              <button onClick={() => setViewItem(null)} className="text-gray-400 hover:text-gray-600"><FontAwesomeIcon icon={faTimes} /></button>
            </div>
            <div className="space-y-3 text-sm">
              {[["ID", viewItem.id], ["Food", viewItem.foodName || viewItem.foodItem], ["Source", viewItem.source || viewItem.donor], ["Quantity", viewItem.qty], ["Farm", viewItem.farm || viewItem.farmDestination], ["Pickup Time", viewItem.pickupTime], ["Requested", viewItem.requestedAt]].map(([label, value]) => (
                <div key={label} className="flex justify-between py-2 border-b border-gray-50">
                  <span className="text-gray-400">{label}</span>
                  <span className="font-medium text-gray-700 text-right max-w-48">{value}</span>
                </div>
              ))}
              <div className="flex justify-between py-2">
                <span className="text-gray-400">Status</span>
                <StatusBadge status={viewItem.status} />
              </div>
            </div>
            <button onClick={() => setViewItem(null)} className="w-full mt-4 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700">Close</button>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!cancelConfirm}
        title="Cancel Request?"
        message={`Cancel request for "${cancelConfirm?.foodItem}"? This action cannot be undone.`}
        danger
        onConfirm={() => handleCancel(cancelConfirm)}
        onCancel={() => setCancelConfirm(null)}
      />
    </div>
  );
};

export default AnimalFeedMyRequests;
