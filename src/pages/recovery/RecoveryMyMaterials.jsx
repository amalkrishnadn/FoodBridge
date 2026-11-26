import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLeaf,
  faSearch,
  faPencil,
  faTrash,
  faChevronDown,
  faChevronUp,
  faForward,
  faXmark,
  faFloppyDisk,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import RecoveryStatusTracker, {
  RECOVERY_STAGES,
  recoveryStageIndex,
} from "../../components/RecoveryStatusTracker";
import Toast from "../../components/Toast";
import { useApp } from "../../context/AppContext";

const TYPE_FILTERS   = ["All", "Composting", "Biogas", "Animal Feed"];
const STATUS_FILTERS = ["All", "Reported", "Assigned", "Collected", "Processing", "Processed", "Closed"];

const TYPE_COLORS = {
  Composting:    "bg-green-100 text-green-700",
  Biogas:        "bg-blue-100  text-blue-700",
  "Animal Feed": "bg-orange-100 text-orange-700",
  Mixed:         "bg-gray-100  text-gray-700",
};

/* ─── Helper: next stage ────────────────────────────────────────── */
const nextStage = (current) => {
  const idx = recoveryStageIndex(current);
  if (idx < 0 || idx >= RECOVERY_STAGES.length - 1) return null;
  return RECOVERY_STAGES[idx + 1].key;
};

/* ─── Confirm Dialog ────────────────────────────────────────────── */
const ConfirmDialog = ({ title, message, onConfirm, onCancel, danger = false }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
      <div className="flex items-start gap-3 mb-4">
        <FontAwesomeIcon
          icon={faCircleExclamation}
          className={`text-2xl mt-0.5 ${danger ? "text-red-500" : "text-amber-500"}`}
        />
        <div>
          <h3 className="font-bold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">{message}</p>
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition ${
            danger ? "bg-red-500 hover:bg-red-600" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
);

/* ─── Edit Modal ────────────────────────────────────────────────── */
const EditModal = ({ item, onSave, onClose }) => {
  const [form, setForm] = useState({
    name:  item.name,
    qty:   item.qty,
    notes: item.notes,
  });

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const inputCls =
    "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 " +
    "focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-bold text-gray-800">Edit Material — {item.id}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Material Name</label>
            <input name="name" value={form.name} onChange={handleChange} className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Quantity</label>
            <input name="qty" value={form.qty} onChange={handleChange} className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              className={inputCls}
            />
          </div>
        </div>

        <div className="flex gap-2 justify-end mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="px-4 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg transition flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faFloppyDisk} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Main Component ────────────────────────────────────────────── */
const RecoveryMyMaterials = () => {
  const { recoveryMaterials: materials, updateRecoveryMaterial, deleteRecoveryMaterial, advanceRecovery } = useApp();
  const [search, setSearch]       = useState("");
  const [typeFilter, setTypeF]    = useState("All");
  const [statusFilter, setStatF]  = useState("All");
  const [expandedTimeline, setExpandedTimeline] = useState(new Set());
  const [toast, setToast]         = useState({ message: "", type: "success" });

  /* Dialog states */
  const [confirmAdv, setConfirmAdv]   = useState(null); // { id, nextStage }
  const [confirmDel, setConfirmDel]   = useState(null); // id
  const [confirmClose, setConfirmClose] = useState(null); // id
  const [editItem, setEditItem]       = useState(null); // item object

  const closeToast = () => setToast({ message: "", type: "success" });

  /* Filtering */
  const filtered = materials.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchType   = typeFilter === "All" || m.type === typeFilter;
    const matchStatus = statusFilter === "All" || m.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  /* Toggle timeline */
  const toggleTimeline = (id) => {
    setExpandedTimeline((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  /* Advance status */
  const initiateAdvance = (item) => {
    const ns = nextStage(item.status);
    if (!ns) return;
    if (ns === "Closed") {
      setConfirmClose(item.id);
    } else {
      setConfirmAdv({ id: item.id, nextStage: ns });
    }
  };

  const doAdvance = (id, ns) => {
    advanceRecovery(id, ns, `Status advanced to ${ns}`);
    setToast({ message: `Status advanced to "${ns}"`, type: "success" });
    setConfirmAdv(null);
    setConfirmClose(null);
  };

  /* Edit */
  const doEdit = (form) => {
    updateRecoveryMaterial(editItem.id, form);
    setToast({ message: "Material updated successfully.", type: "success" });
    setEditItem(null);
  };

  /* Delete */
  const doDelete = (id) => {
    deleteRecoveryMaterial(id);
    setToast({ message: "Material removed.", type: "error" });
    setConfirmDel(null);
  };

  return (
    <div>
      <Toast message={toast.message} type={toast.type} onClose={closeToast} />

      {/* Dialogs */}
      {confirmAdv && (
        <ConfirmDialog
          title="Advance Status"
          message={`Move to "${confirmAdv.nextStage}"? This cannot be undone.`}
          onConfirm={() => doAdvance(confirmAdv.id, confirmAdv.nextStage)}
          onCancel={() => setConfirmAdv(null)}
        />
      )}
      {confirmClose && (
        <ConfirmDialog
          title="Close Record"
          message='Marking as "Closed" will finalise this recovery record. Proceed?'
          onConfirm={() => doAdvance(confirmClose, "Closed")}
          onCancel={() => setConfirmClose(null)}
          danger
        />
      )}
      {confirmDel && (
        <ConfirmDialog
          title="Delete Material"
          message="This will permanently delete the material record. This action cannot be undone."
          onConfirm={() => doDelete(confirmDel)}
          onCancel={() => setConfirmDel(null)}
          danger
        />
      )}
      {editItem && (
        <EditModal item={editItem} onSave={doEdit} onClose={() => setEditItem(null)} />
      )}

      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FontAwesomeIcon icon={faLeaf} className="text-green-500" />
          My Materials
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Full CRUD management of your reported organic recovery materials.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-5 flex flex-wrap gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name…"
            className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Type filter */}
        <div className="flex gap-2 flex-wrap">
          {TYPE_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setTypeF(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                typeFilter === f
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-green-400"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setStatF(s)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold border transition ${
              statusFilter === s
                ? "bg-gray-800 text-white border-gray-800"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
            }`}
          >
            {s}
            {s !== "All" && (
              <span className="ml-1.5 bg-white/20 text-[10px] px-1.5 py-0.5 rounded-full">
                {materials.filter((m) => m.status === s).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="text-xs text-gray-400 mb-4">
        Showing {filtered.length} of {materials.length} materials
      </p>

      {/* Cards */}
      <div className="space-y-4">
        {filtered.map((item) => {
          const ns         = nextStage(item.status);
          const isClosed   = item.status === "Closed";
          const expanded   = expandedTimeline.has(item.id);

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition hover:shadow-md"
            >
              {/* Card header */}
              <div className="flex flex-wrap gap-4 justify-between p-5">
                {/* Left info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-gray-800">{item.name}</h3>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TYPE_COLORS[item.type] || "bg-gray-100 text-gray-700"}`}>
                      {item.type}
                    </span>
                    {isClosed && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">
                        Closed
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-gray-500">
                    <span>ID: <span className="font-mono">{item.id}</span></span>
                    <span>Qty: <span className="font-medium text-gray-700">{item.qty}</span></span>
                    <span>Source: <span className="font-medium text-gray-700">{item.source}</span></span>
                    <span>Reported: {item.reportedOn}</span>
                  </div>
                  {item.notes && (
                    <p className="mt-1.5 text-xs text-gray-500 italic">{item.notes}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-start gap-2 flex-shrink-0">
                  {!isClosed && ns && (
                    <button
                      onClick={() => initiateAdvance(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-green-600 hover:bg-green-700 rounded-lg transition"
                    >
                      <FontAwesomeIcon icon={faForward} />
                      {ns === "Closed" ? "Close Record" : `→ ${ns}`}
                    </button>
                  )}
                  <button
                    onClick={() => setEditItem(item)}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition"
                    title="Edit"
                  >
                    <FontAwesomeIcon icon={faPencil} />
                  </button>
                  <button
                    onClick={() => setConfirmDel(item.id)}
                    className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition"
                    title="Delete"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>

              {/* Status Tracker */}
              <div className="px-5 pb-3">
                <RecoveryStatusTracker status={item.status} />
              </div>

              {/* Timeline toggle */}
              <div className="border-t border-gray-100">
                <button
                  onClick={() => toggleTimeline(item.id)}
                  className="w-full flex items-center justify-between px-5 py-3 text-xs font-semibold text-gray-500 hover:bg-gray-50 transition"
                >
                  <span>Activity Timeline ({item.timeline.length} events)</span>
                  <FontAwesomeIcon icon={expanded ? faChevronUp : faChevronDown} />
                </button>

                {expanded && (
                  <div className="px-5 pb-4">
                    <ol className="relative border-l border-green-200 space-y-3 ml-2">
                      {item.timeline.map((t, i) => (
                        <li key={i} className="ml-4">
                          <div className="absolute -left-1.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                          <p className="text-xs font-semibold text-green-700">{t.stage}</p>
                          <p className="text-xs text-gray-600">{t.note}</p>
                          <p className="text-[10px] text-gray-400">{t.time}</p>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
            <FontAwesomeIcon icon={faLeaf} className="text-4xl text-gray-200 mb-3" />
            <p className="font-medium">No materials found</p>
            <p className="text-xs mt-1">Try adjusting your filters or search term.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecoveryMyMaterials;
