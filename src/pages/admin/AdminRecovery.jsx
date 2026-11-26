import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRecycle, faArrowRight, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import RecoveryStatusTracker, { RECOVERY_STAGES } from "../../components/RecoveryStatusTracker";
import StatusBadge from "../../components/StatusBadge";
import Toast from "../../components/Toast";
import { useApp } from "../../context/AppContext";

const AdminRecovery = () => {
  const { recoveryMaterials, advanceRecovery } = useApp();
  const [toast, setToast] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState("All");

  const stages = ["All", ...RECOVERY_STAGES.map((s) => s.key)];
  const rows = filter === "All" ? recoveryMaterials : recoveryMaterials.filter((m) => m.status === filter);

  const advance = (item) => {
    const idx = RECOVERY_STAGES.findIndex((s) => s.key === item.status);
    const next = RECOVERY_STAGES[idx + 1];
    if (!next) return;
    advanceRecovery(item.id, next.key, `Admin moved record to ${next.label}`);
    setToast({ message: `${item.id} moved to ${next.label}`, type: "success" });
  };

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <h1 className="text-2xl font-bold text-gray-800">Recovery Monitoring</h1>
      <p className="text-gray-500 mt-1 mb-6">
        Track composting, biogas, and animal-feed batches from Reported through Closed.
      </p>

      <div className="flex gap-2 flex-wrap mb-5">
        {stages.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border ${
              filter === s ? "bg-green-600 text-white border-green-600" : "bg-white text-gray-600 border-gray-200"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {rows.map((m) => {
          const idx = RECOVERY_STAGES.findIndex((s) => s.key === m.status);
          const next = RECOVERY_STAGES[idx + 1];
          const open = expanded === m.id;
          return (
            <div key={m.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex flex-wrap justify-between gap-3 mb-3">
                <div>
                  <p className="font-semibold text-gray-800">{m.name}</p>
                  <p className="text-xs text-gray-500">{m.id} · {m.type} · {m.qty} · {m.source}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={m.status} />
                  <button onClick={() => setExpanded(open ? null : m.id)} className="text-gray-400 p-1">
                    <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} />
                  </button>
                </div>
              </div>
              <RecoveryStatusTracker status={m.status} />
              {next && (
                <button
                  onClick={() => advance(m)}
                  className="mt-4 inline-flex items-center gap-2 bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Mark as {next.label} <FontAwesomeIcon icon={faArrowRight} />
                </button>
              )}
              {open && (
                <div className="mt-4 border-t pt-3 space-y-2">
                  {(m.timeline || []).map((t, i) => (
                    <p key={i} className="text-xs text-gray-500">{t.stage} · {t.time} · {t.note}</p>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {rows.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <FontAwesomeIcon icon={faRecycle} className="text-4xl mb-3" />
            <p>No recovery records in this stage.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRecovery;
