import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleDot,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";

export const TASK_STAGES = [
  { key: "Pending",           label: "Pending",            short: "Pending" },
  { key: "Accepted",          label: "Accepted",           short: "Accepted" },
  { key: "Pickup In Progress",label: "Pickup In Progress", short: "Pickup" },
  { key: "Food Collected",    label: "Food Collected",     short: "Collected" },
  { key: "Out for Delivery",  label: "Out for Delivery",   short: "Delivery" },
  { key: "Delivered",         label: "Delivered",          short: "Delivered" },
  { key: "Completed",         label: "Completed",          short: "Completed" },
];

export const stageIndex = (key) => TASK_STAGES.findIndex((s) => s.key === key);

const TaskProgressTracker = ({ status }) => {
  const current = stageIndex(status);
  const pct = current < 0 ? 0 : Math.round((current / (TASK_STAGES.length - 1)) * 100);

  return (
    <div className="space-y-3">
      {/* Progress bar */}
      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
        <span>Progress</span>
        <span className="font-semibold text-green-700">{pct}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div
          className="bg-green-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Stepper */}
      <div className="flex items-start gap-0 overflow-x-auto pb-1">
        {TASK_STAGES.map((stage, i) => {
          const done = i < current;
          const active = i === current;
          const pending = i > current;

          return (
            <React.Fragment key={stage.key}>
              {/* Step */}
              <div className="flex flex-col items-center min-w-[64px]">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                    done
                      ? "bg-green-500 border-green-500 text-white"
                      : active
                      ? "bg-white border-green-500 text-green-600 shadow-md"
                      : "bg-gray-100 border-gray-300 text-gray-400"
                  }`}
                >
                  {done ? (
                    <FontAwesomeIcon icon={faCircleCheck} className="text-white" />
                  ) : active ? (
                    <FontAwesomeIcon icon={faCircleDot} className="text-green-500" />
                  ) : (
                    <FontAwesomeIcon icon={faCircle} className="text-gray-300" />
                  )}
                </div>
                <span
                  className={`mt-1 text-center leading-tight text-[9px] font-medium ${
                    done ? "text-green-600" : active ? "text-green-700 font-bold" : "text-gray-400"
                  }`}
                  style={{ maxWidth: 60 }}
                >
                  {stage.short}
                </span>
              </div>

              {/* Connector */}
              {i < TASK_STAGES.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mt-4 min-w-[16px] transition-all ${
                    done ? "bg-green-400" : "bg-gray-200"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default TaskProgressTracker;
