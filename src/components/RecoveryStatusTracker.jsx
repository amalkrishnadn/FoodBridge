import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleDot,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";

/* ─── Shared stage data ─────────────────────────────────────────── */
export const RECOVERY_STAGES = [
  { key: "Reported",   label: "Reported",   short: "Reported"   },
  { key: "Assigned",   label: "Assigned",   short: "Assigned"   },
  { key: "Collected",  label: "Collected",  short: "Collected"  },
  { key: "Processing", label: "Processing", short: "Processing" },
  { key: "Processed",  label: "Processed",  short: "Processed"  },
  { key: "Closed",     label: "Closed",     short: "Closed"     },
];

export const recoveryStageIndex = (key) =>
  RECOVERY_STAGES.findIndex((s) => s.key === key);

/* ─── Component ─────────────────────────────────────────────────── */
const RecoveryStatusTracker = ({ status, compact = false }) => {
  const current = Math.max(recoveryStageIndex(status), 0);
  const total   = RECOVERY_STAGES.length;
  const pct     = Math.round((current / (total - 1)) * 100);

  return (
    <div className="w-full">
      {/* Progress bar + % */}
      {!compact && (
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-green-600 w-9 text-right">
            {pct}%
          </span>
        </div>
      )}

      {/* Stepper */}
      <div className={`flex items-start overflow-x-auto ${compact ? "gap-0" : "gap-0 pb-1"}`}>
        {RECOVERY_STAGES.map((stage, i) => {
          const done    = i < current;
          const active  = i === current;

          return (
            <React.Fragment key={stage.key}>
              {/* Step bubble */}
              <div className={`flex flex-col items-center ${compact ? "min-w-[44px]" : "min-w-[64px]"}`}>
                <div
                  className={`flex items-center justify-center rounded-full border-2 transition-all ${
                    compact ? "w-6 h-6 text-[9px]" : "w-8 h-8 text-xs"
                  } ${
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

                {!compact && (
                  <span
                    className={`mt-1 text-center leading-tight text-[9px] font-medium ${
                      done
                        ? "text-green-600"
                        : active
                        ? "text-green-700 font-bold"
                        : "text-gray-400"
                    }`}
                    style={{ maxWidth: 60 }}
                  >
                    {stage.short}
                  </span>
                )}
              </div>

              {/* Connector line */}
              {i < RECOVERY_STAGES.length - 1 && (
                <div
                  className={`flex-1 h-0.5 ${compact ? "mt-3" : "mt-4"} min-w-[8px] transition-all ${
                    done ? "bg-green-400" : "bg-gray-200"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Current stage label (non-compact) */}
      {!compact && (
        <p className="mt-2 text-xs text-gray-500">
          Current stage:{" "}
          <span className="font-semibold text-green-700">{status}</span>
        </p>
      )}
    </div>
  );
};

export default RecoveryStatusTracker;
