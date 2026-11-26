import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle,
  faInfoCircle,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const STYLES = {
  success: {
    wrap: "bg-green-50 border-green-400 text-green-800",
    icon: faCheckCircle,
    iconClass: "text-green-500",
  },
  error: {
    wrap: "bg-red-50 border-red-400 text-red-800",
    icon: faTimesCircle,
    iconClass: "text-red-500",
  },
  info: {
    wrap: "bg-blue-50 border-blue-400 text-blue-800",
    icon: faInfoCircle,
    iconClass: "text-blue-500",
  },
};

const Toast = ({ message, type = "success", onClose, duration = 3500 }) => {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [message, duration, onClose]);

  if (!message) return null;

  const s = STYLES[type] || STYLES.info;

  return (
    <div
      className={`fixed top-5 right-5 z-50 flex items-start gap-3 border-l-4 px-5 py-4 rounded-xl shadow-lg max-w-sm ${s.wrap} animate-fade-in`}
    >
      <FontAwesomeIcon icon={s.icon} className={`mt-0.5 text-lg ${s.iconClass}`} />
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">
        <FontAwesomeIcon icon={faXmark} />
      </button>
    </div>
  );
};

export default Toast;
