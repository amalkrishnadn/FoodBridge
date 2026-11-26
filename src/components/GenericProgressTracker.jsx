/**
 * GenericProgressTracker.jsx
 * A reusable stepper that works with ANY stage array.
 * Props:
 *   stages  – string[]   list of stage keys in order
 *   current – string     the current active stage key
 *   compact – boolean    smaller variant (no labels)
 */
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleDot, faCircle } from "@fortawesome/free-solid-svg-icons";

const GenericProgressTracker = ({ stages = [], current, compact = false }) => {
  const idx = stages.indexOf(current);
  if (current && idx < 0) {
    return (
      <p className={`text-xs font-semibold ${current === "Rejected" || current === "Cancelled" ? "text-red-600" : "text-gray-600"}`}>
        Status: {current}
      </p>
    );
  }
  const pct = idx < 0 ? 0 : Math.round((idx / Math.max(stages.length - 1, 1)) * 100);

  return (
    <div className="w-full">
      {!compact && (
        <div className="flex items-center gap-3 mb-2">
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-green-600 w-9 text-right">{pct}%</span>
        </div>
      )}

      <div className={`flex items-start overflow-x-auto pb-1 ${compact ? "" : "gap-0"}`}>
        {stages.map((stage, i) => {
          const done   = i < idx;
          const active = i === idx;
          return (
            <React.Fragment key={stage}>
              <div className={`flex flex-col items-center ${compact ? "min-w-[44px]" : "min-w-[72px]"}`}>
                <div
                  className={`flex items-center justify-center rounded-full border-2 transition-all ${
                    compact ? "w-6 h-6" : "w-8 h-8"
                  } ${
                    done   ? "bg-green-500 border-green-500 text-white"
                    : active ? "bg-white border-green-500 text-green-600 shadow-md"
                    :          "bg-gray-100 border-gray-300 text-gray-400"
                  }`}
                >
                  {done   ? <FontAwesomeIcon icon={faCircleCheck} className="text-white text-xs" />
                  : active ? <FontAwesomeIcon icon={faCircleDot}   className="text-green-500 text-xs" />
                  :          <FontAwesomeIcon icon={faCircle}      className="text-gray-300 text-xs" />}
                </div>
                {!compact && (
                  <span className={`mt-1 text-center leading-tight text-[9px] font-medium ${
                    done ? "text-green-600" : active ? "text-green-700 font-bold" : "text-gray-400"
                  }`} style={{ maxWidth: 68 }}>
                    {stage}
                  </span>
                )}
              </div>
              {i < stages.length - 1 && (
                <div className={`flex-1 h-0.5 ${compact ? "mt-3" : "mt-4"} min-w-[8px] ${
                  done ? "bg-green-400" : "bg-gray-200"
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {!compact && (
        <p className="mt-1 text-xs text-gray-500">
          Current: <span className="font-semibold text-green-700">{current}</span>
        </p>
      )}
    </div>
  );
};

export default GenericProgressTracker;
