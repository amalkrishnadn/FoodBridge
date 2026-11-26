/**
 * ConfirmModal – reusable confirmation dialog
 */
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

const ConfirmModal = ({ open = false, title, message, onConfirm, onCancel, confirmLabel = "Confirm", danger = false }) => {
  if (!open) return null;
  return (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
      <div className="flex justify-center mb-3">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${danger ? "bg-red-100" : "bg-yellow-100"}`}>
          <FontAwesomeIcon icon={faExclamationTriangle} className={danger ? "text-red-500 text-xl" : "text-yellow-500 text-xl"} />
        </div>
      </div>
      {title && <h3 className="text-center font-bold text-gray-800 mb-1">{title}</h3>}
      <p className="text-gray-700 font-medium text-center mb-5 text-sm">{message}</p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={onConfirm}
          className={`px-6 py-2 rounded-lg font-semibold text-sm text-white ${danger ? "bg-red-500 hover:bg-red-600" : "bg-green-600 hover:bg-green-700"}`}
        >
          {confirmLabel}
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
};

export default ConfirmModal;
