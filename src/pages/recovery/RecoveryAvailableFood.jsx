import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRecycle, faMapMarkerAlt, faHandHolding, faLeaf } from "@fortawesome/free-solid-svg-icons";
import StatusBadge from "../../components/StatusBadge";
import Toast from "../../components/Toast";
import { useApp } from "../../context/AppContext";

const TYPE_COLORS = {
  Composting: "bg-green-100 text-green-700",
  Biogas: "bg-blue-100 text-blue-700",
  "Animal Feed": "bg-orange-100 text-orange-700",
};

const RecoveryAvailableFood = () => {
  const navigate = useNavigate();
  const { availableWaste, claimAvailableWaste } = useApp();
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState("All");

  const types = ["All", "Composting", "Biogas", "Animal Feed"];
  const filtered = filter === "All" ? availableWaste : availableWaste.filter((w) => w.type === filter);

  const claim = (item) => {
    const id = claimAvailableWaste(item.id);
    setToast({ message: `${item.name} claimed as ${id}. Track it under My Materials.`, type: "success" });
  };

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Nearby Organic Waste</h1>
          <p className="text-gray-500 mt-1">Claim unsuitable or surplus material for composting, biogas, or animal feed.</p>
        </div>
        <button onClick={() => navigate("/recovery/my-materials")} className="text-sm font-semibold text-green-700 hover:underline">
          View my pipeline
        </button>
      </div>

      <div className="flex gap-2 flex-wrap mb-5">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border ${
              filter === t ? "bg-green-600 text-white border-green-600" : "bg-white text-gray-600 border-gray-200"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-gray-400 font-mono">{item.id}</p>
                <h2 className="font-bold text-gray-800">{item.name}</h2>
                <p className="text-sm text-gray-500 mt-1">{item.qty} · {item.source}</p>
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TYPE_COLORS[item.type] || "bg-gray-100"}`}>
                {item.type}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-3">{item.condition}</p>
            <p className="text-xs text-amber-700 mt-1">{item.suitability}</p>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-3">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="text-green-600" />
              {item.location?.address}, {item.location?.city} · {item.distance}
            </div>
            <div className="flex items-center justify-between mt-4">
              <StatusBadge status="Available" />
              <button
                onClick={() => claim(item)}
                className="inline-flex items-center gap-2 bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-green-700"
              >
                <FontAwesomeIcon icon={faHandHolding} /> Claim & assign
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <FontAwesomeIcon icon={faRecycle} className="text-4xl mb-3" />
          <p>No nearby waste in this category.</p>
          <p className="text-xs mt-1 flex items-center justify-center gap-1">
            <FontAwesomeIcon icon={faLeaf} /> New listings appear here before they enter your pipeline.
          </p>
        </div>
      )}
    </div>
  );
};

export default RecoveryAvailableFood;
