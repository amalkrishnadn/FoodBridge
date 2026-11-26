import React, { useState } from "react";
import { Link } from "react-router-dom";
import DashboardCard from "../../components/DashboardCard";
import StatusBadge from "../../components/StatusBadge";
import TaskProgressTracker, { TASK_STAGES } from "../../components/TaskProgressTracker";
import Toast from "../../components/Toast";
import { useApp } from "../../context/AppContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruck, faClock, faCheckCircle, faRoute, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const VolunteerDashboard = () => {
  const { volunteerTasks, advanceVolunteerTask } = useApp();
  const [toast, setToast] = useState(null);

  const active = volunteerTasks.filter((t) => !["Completed", "Cancelled"].includes(t.status));
  const completed = volunteerTasks.filter((t) => t.status === "Completed").length;

  const advance = (task) => {
    const idx = TASK_STAGES.findIndex((s) => s.key === task.status);
    const next = TASK_STAGES[idx + 1];
    if (!next) return;
    advanceVolunteerTask(task.id, next.key);
    setToast({ message: `${task.id} moved to ${next.label}`, type: "success" });
  };

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <h1 className="text-2xl font-bold text-gray-800">Volunteer Dashboard</h1>
      <p className="text-gray-500 mt-1 mb-8">Update pickup and delivery progress from Pending through Completed.</p>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <DashboardCard title="Total Tasks" value={volunteerTasks.length} icon={faTruck} />
        <DashboardCard title="Active Tasks" value={active.length} icon={faClock} color="orange" />
        <DashboardCard title="Completed" value={completed} icon={faCheckCircle} color="blue" />
        <DashboardCard title="Deliveries" value={completed} icon={faRoute} color="purple" />
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-lg text-gray-800">Active tasks</h2>
          <Link to="/volunteer/my-tasks" className="text-green-600 text-sm font-semibold">View all</Link>
        </div>
        {active.length === 0 && <p className="text-gray-400 text-sm">No active tasks.</p>}
        {active.map((task) => {
          const idx = TASK_STAGES.findIndex((s) => s.key === task.status);
          const next = TASK_STAGES[idx + 1];
          return (
            <div key={task.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex flex-wrap justify-between gap-3 mb-3">
                <div>
                  <p className="font-semibold text-gray-800">{task.foodName}</p>
                  <p className="text-xs text-gray-500">{task.pickupLocation} → {task.deliveryLocation}</p>
                </div>
                <StatusBadge status={task.status} />
              </div>
              <TaskProgressTracker status={task.status} />
              {next && (
                <button
                  onClick={() => advance(task)}
                  className="mt-4 inline-flex items-center gap-2 bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Mark as {next.label} <FontAwesomeIcon icon={faArrowRight} />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VolunteerDashboard;
