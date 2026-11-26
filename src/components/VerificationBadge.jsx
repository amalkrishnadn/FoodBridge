import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle,
  faHourglassHalf,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";

const STYLES = {
  Verified: {
    cls: "bg-green-100 text-green-700 border-green-300",
    icon: faCheckCircle,
  },
  "Verification Pending": {
    cls: "bg-yellow-100 text-yellow-700 border-yellow-300",
    icon: faHourglassHalf,
  },
  Rejected: {
    cls: "bg-red-100 text-red-700 border-red-300",
    icon: faTimesCircle,
  },
  "Not Verified": {
    cls: "bg-gray-100 text-gray-600 border-gray-300",
    icon: faQuestionCircle,
  },
};

const VerificationBadge = ({ status }) => {
  const s = STYLES[status] || STYLES["Not Verified"];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${s.cls}`}>
      <FontAwesomeIcon icon={s.icon} />
      {status}
    </span>
  );
};

export default VerificationBadge;
