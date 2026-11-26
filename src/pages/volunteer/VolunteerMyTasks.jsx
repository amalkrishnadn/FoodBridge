import React, { useState } from "react";
import TaskProgressTracker, { TASK_STAGES, stageIndex } from "../../components/TaskProgressTracker";
import { useApp } from "../../context/AppContext";
import StatusBadge from "../../components/StatusBadge";
import Toast from "../../components/Toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTruck,
  faMapMarkerAlt,
  faPhone,
  faUser,
  faBox,
  faClock,
  faCheckCircle,
  faTimesCircle,
  faArrowRight,
  faClipboardList,
} from "@fortawesome/free-solid-svg-icons";

/* ─── Confirm modal ────────────────────────────────────────────── */
function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
        <p className="text-gray-700 font-medium text-center mb-5">{message}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onConfirm}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-semibold text-sm"
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="border border-gray-300 text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-50 font-semibold text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Single task card ─────────────────────────────────────────── */
function TaskCard({ task, onAdvance, onCancel }) {
  const [expanded, setExpanded] = useState(false);
  const idx = stageIndex(task.status);
  const isCompleted = task.status === "Completed";
  const isCancelled = task.status === "Cancelled";
  const nextStage = TASK_STAGES[idx + 1];
  const canAdvance = !isCompleted && !isCancelled && nextStage;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-5 flex flex-wrap justify-between items-start gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-gray-400 font-mono">{task.id}</span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-400">{task.donationId}</span>
          </div>
          <h3 className="font-bold text-gray-800 text-lg">{task.foodName}</h3>
          <p className="text-sm text-gray-500">{task.quantity}</p>
        </div>
        <StatusBadge status={task.status} />
      </div>

      {/* Info grid */}
      <div className="px-5 pb-4 grid sm:grid-cols-2 gap-3">
        <div className="flex items-start gap-2 text-sm text-gray-600">
          <FontAwesomeIcon icon={faUser} className="text-green-500 mt-0.5 w-4" />
          <div>
            <span className="font-medium text-gray-700">{task.donorName}</span>
            <div className="flex items-center gap-1">
              <FontAwesomeIcon icon={faPhone} className="text-xs text-gray-400" />
              <span className="text-xs">{task.donorPhone}</span>
            </div>
          </div>
        </div>
        <div className="flex items-start gap-2 text-sm text-gray-600">
          <FontAwesomeIcon icon={faClock} className="text-green-500 mt-0.5 w-4" />
          <span>{task.scheduledTime}</span>
        </div>
        <div className="flex items-start gap-2 text-sm text-gray-600">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="text-green-500 mt-0.5 w-4 shrink-0" />
          <div>
            <div className="text-xs text-gray-400 font-semibold uppercase">Pickup</div>
            {task.pickupLocation}
          </div>
        </div>
        <div className="flex items-start gap-2 text-sm text-gray-600">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-500 mt-0.5 w-4 shrink-0" />
          <div>
            <div className="text-xs text-gray-400 font-semibold uppercase">Delivery</div>
            {task.deliveryLocation}
          </div>
        </div>
      </div>

      {/* Progress tracker */}
      <div className="px-5 pb-4">
        <TaskProgressTracker status={task.status} />
      </div>

      {/* Action buttons */}
      {!isCompleted && !isCancelled && (
        <div className="px-5 pb-5 flex flex-wrap gap-2">
          {canAdvance && (
            <button
              onClick={() => onAdvance(task.id, nextStage.key)}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition"
            >
              {nextStage.key === "Accepted" ? "Accept Task" : `Mark as ${nextStage.label}`}
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          )}
          <button
            onClick={() => onCancel(task.id)}
            className="flex items-center gap-2 border border-red-300 text-red-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-50 transition"
          >
            <FontAwesomeIcon icon={faTimesCircle} />
            Cancel Task
          </button>
        </div>
      )}

      {isCompleted && (
        <div className="px-5 pb-5">
          <span className="inline-flex items-center gap-1 text-green-700 text-sm font-semibold">
            <FontAwesomeIcon icon={faCheckCircle} /> Task completed successfully
          </span>
        </div>
      )}

      {/* Activity timeline toggle */}
      <div className="border-t px-5 py-3">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-green-600 font-semibold hover:underline flex items-center gap-1"
        >
          <FontAwesomeIcon icon={faClipboardList} />
          {expanded ? "Hide" : "Show"} Activity Timeline ({task.timeline.length} events)
        </button>

        {expanded && (
          <div className="mt-3 space-y-2">
            {task.timeline.map((e, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0" />
                <div>
                  <span className="text-xs text-gray-400">{e.time}</span>
                  <div className="text-sm text-gray-700">
                    <span className="font-semibold">{e.stage}</span> — {e.note}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Main page ────────────────────────────────────────────────── */
const VolunteerMyTasks = () => {
  const { volunteerTasks: tasks, advanceVolunteerTask, cancelVolunteerTask } = useApp();
  const [toast, setToast] = useState(null);
  const [confirm, setConfirm] = useState(null); // { taskId, nextStatus, message }
  const [filter, setFilter] = useState("All");

  const advanceTask = (taskId, nextStatus) => {
    const isDelivery = nextStatus === "Completed";
    if (isDelivery) {
      setConfirm({
        taskId,
        nextStatus,
        message: "Confirm that the food has been delivered and the task is complete?",
      });
    } else {
      applyAdvance(taskId, nextStatus);
    }
  };

  const applyAdvance = (taskId, nextStatus) => {
    if (nextStatus === "Cancelled") cancelVolunteerTask(taskId);
    else advanceVolunteerTask(taskId, nextStatus);
    setToast({ msg: `Task updated to "${nextStatus}"`, type: nextStatus === "Cancelled" ? "error" : "success" });
  };

  const cancelTask = (taskId) => {
    setConfirm({
      taskId,
      nextStatus: "Cancelled",
      message: "Are you sure you want to cancel this task?",
    });
  };

  const handleConfirm = () => {
    applyAdvance(confirm.taskId, confirm.nextStatus);
    setConfirm(null);
  };

  const STATUS_FILTERS = ["All", "Pending", "Accepted", "Pickup In Progress", "Food Collected", "Out for Delivery", "Delivered", "Completed"];

  const filtered =
    filter === "All" ? tasks : tasks.filter((t) => t.status === filter);

  return (
    <div>
      {toast && (
        <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />
      )}
      {confirm && (
        <ConfirmModal
          message={confirm.message}
          onConfirm={handleConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FontAwesomeIcon icon={faTruck} className="text-green-600" />
          My Tasks
        </h1>
        <p className="text-gray-500 mt-1">
          Track and update food pickup and delivery progress.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-1">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
              filter === f
                ? "bg-green-600 text-white border-green-600"
                : "bg-white text-gray-600 border-gray-300 hover:border-green-400"
            }`}
          >
            {f}
            {f === "All"
              ? ` (${tasks.length})`
              : ` (${tasks.filter((t) => t.status === f).length})`}
          </button>
        ))}
      </div>

      {/* Task cards */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-10 text-center text-gray-400">
          <FontAwesomeIcon icon={faBox} className="text-5xl mb-3 text-gray-200" />
          <p className="font-medium">No tasks with this status</p>
        </div>
      ) : (
        <div className="space-y-5">
          {filtered.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onAdvance={advanceTask}
              onCancel={cancelTask}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default VolunteerMyTasks;
