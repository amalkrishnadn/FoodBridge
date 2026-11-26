import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLeaf,
  faUpload,
  faFloppyDisk,
  faArrowLeft,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import LocationPicker from "../../components/LocationPicker";
import Toast from "../../components/Toast";
import { useApp } from "../../context/AppContext";

/* ─── Field helpers ─────────────────────────────────────────────── */
const Label = ({ htmlFor, children, required }) => (
  <label
    htmlFor={htmlFor}
    className="block text-sm font-medium text-gray-700 mb-1"
  >
    {children}
    {required && <span className="text-red-500 ml-0.5">*</span>}
  </label>
);

const inputCls =
  "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 " +
  "focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent " +
  "placeholder-gray-400 transition";

const selectCls =
  "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 " +
  "focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent " +
  "bg-white transition";

/* ─── Initial form state ────────────────────────────────────────── */
const EMPTY = {
  materialName: "",
  materialType: "",
  sourceName: "",
  quantity: "",
  unit: "kg",
  conditionDescription: "",
  collectionUrgency: "",
  preferredRecovery: "",
  specialHandling: "",
  files: [],
  location: null,
};

/* ─── Component ─────────────────────────────────────────────────── */
const RecoveryAddMaterial = () => {
  const navigate              = useNavigate();
  const { createRecoveryMaterial } = useApp();
  const [form, setForm]       = useState(EMPTY);
  const [errors, setErrors]   = useState({});
  const [toast, setToast]     = useState({ message: "", type: "success" });
  const [submitting, setSub]  = useState(false);

  const closeToast = () => setToast({ message: "", type: "success" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((er) => ({ ...er, [name]: "" }));
  };

  const handleFiles = (e) => {
    setForm((f) => ({ ...f, files: Array.from(e.target.files) }));
  };

  const handleLocation = (loc) => {
    setForm((f) => ({ ...f, location: loc }));
  };

  const validate = () => {
    const errs = {};
    if (!form.materialName.trim()) errs.materialName = "Material name is required.";
    if (!form.materialType)        errs.materialType = "Please select a material type.";
    if (!form.sourceName.trim())   errs.sourceName   = "Source name is required.";
    if (!form.quantity || isNaN(Number(form.quantity)) || Number(form.quantity) <= 0)
      errs.quantity = "Enter a valid quantity.";
    if (!form.collectionUrgency)   errs.collectionUrgency = "Select collection urgency.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      setToast({ message: "Please fix the errors before submitting.", type: "error" });
      return;
    }

    setSub(true);
    createRecoveryMaterial({
      name: form.materialName.trim(),
      type: form.materialType,
      qty: `${form.quantity} ${form.unit}`,
      source: form.sourceName.trim(),
      condition: form.conditionDescription,
      urgency: form.collectionUrgency,
      notes: [form.preferredRecovery && `Preferred: ${form.preferredRecovery}`, form.specialHandling]
        .filter(Boolean)
        .join(" · "),
      location: form.location || { address: "", city: "", state: "" },
    });
    setSub(false);
    setToast({ message: "Material reported successfully! Redirecting…", type: "success" });
    setTimeout(() => navigate("/recovery/my-materials"), 900);
  };

  const ErrorMsg = ({ field }) =>
    errors[field] ? (
      <p className="mt-1 text-xs text-red-500">{errors[field]}</p>
    ) : null;

  return (
    <div>
      <Toast message={toast.message} type={toast.type} onClose={closeToast} />

      {/* Page header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FontAwesomeIcon icon={faLeaf} className="text-green-500" />
            Report Organic Material
          </h1>
          <p className="text-gray-500 mt-0.5 text-sm">
            Submit organic waste or by-products for recovery and sustainable processing.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* ── Left / Main column ─────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Basic Info */}
            <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-base font-semibold text-gray-800 mb-4">Material Details</h2>
              <div className="grid sm:grid-cols-2 gap-4">

                {/* Material Name */}
                <div className="sm:col-span-2">
                  <Label htmlFor="materialName" required>Material Name</Label>
                  <input
                    id="materialName"
                    name="materialName"
                    type="text"
                    value={form.materialName}
                    onChange={handleChange}
                    placeholder="e.g. Vegetable peels, Expired bread"
                    className={`${inputCls} ${errors.materialName ? "border-red-400" : ""}`}
                  />
                  <ErrorMsg field="materialName" />
                </div>

                {/* Material Type */}
                <div>
                  <Label htmlFor="materialType" required>Material Type</Label>
                  <select
                    id="materialType"
                    name="materialType"
                    value={form.materialType}
                    onChange={handleChange}
                    className={`${selectCls} ${errors.materialType ? "border-red-400" : ""}`}
                  >
                    <option value="">Select type…</option>
                    <option>Composting</option>
                    <option>Biogas</option>
                    <option>Animal Feed</option>
                    <option>Mixed / Unknown</option>
                  </select>
                  <ErrorMsg field="materialType" />
                </div>

                {/* Source Name */}
                <div>
                  <Label htmlFor="sourceName" required>Source Name</Label>
                  <input
                    id="sourceName"
                    name="sourceName"
                    type="text"
                    value={form.sourceName}
                    onChange={handleChange}
                    placeholder="Restaurant / Hotel / Factory name"
                    className={`${inputCls} ${errors.sourceName ? "border-red-400" : ""}`}
                  />
                  <ErrorMsg field="sourceName" />
                </div>

                {/* Quantity */}
                <div>
                  <Label htmlFor="quantity" required>Quantity</Label>
                  <div className="flex gap-2">
                    <input
                      id="quantity"
                      name="quantity"
                      type="number"
                      min="0"
                      value={form.quantity}
                      onChange={handleChange}
                      placeholder="0"
                      className={`${inputCls} flex-1 ${errors.quantity ? "border-red-400" : ""}`}
                    />
                    <select
                      name="unit"
                      value={form.unit}
                      onChange={handleChange}
                      className={`${selectCls} w-28`}
                    >
                      <option value="kg">kg</option>
                      <option value="tonnes">tonnes</option>
                      <option value="litres">litres</option>
                      <option value="bags">bags</option>
                    </select>
                  </div>
                  <ErrorMsg field="quantity" />
                </div>

                {/* Condition */}
                <div className="sm:col-span-2">
                  <Label htmlFor="conditionDescription">Condition Description</Label>
                  <textarea
                    id="conditionDescription"
                    name="conditionDescription"
                    rows={3}
                    value={form.conditionDescription}
                    onChange={handleChange}
                    placeholder="Describe the current condition, any odour, moisture level, etc."
                    className={inputCls}
                  />
                </div>
              </div>
            </section>

            {/* Collection & Recovery */}
            <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-base font-semibold text-gray-800 mb-4">Collection & Recovery Preferences</h2>
              <div className="grid sm:grid-cols-2 gap-4">

                {/* Collection Urgency */}
                <div>
                  <Label htmlFor="collectionUrgency" required>Collection Urgency</Label>
                  <select
                    id="collectionUrgency"
                    name="collectionUrgency"
                    value={form.collectionUrgency}
                    onChange={handleChange}
                    className={`${selectCls} ${errors.collectionUrgency ? "border-red-400" : ""}`}
                  >
                    <option value="">Select urgency…</option>
                    <option>Immediate (within hours)</option>
                    <option>Today</option>
                    <option>Within 2-3 Days</option>
                    <option>Flexible</option>
                  </select>
                  <ErrorMsg field="collectionUrgency" />
                </div>

                {/* Preferred Recovery */}
                <div>
                  <Label htmlFor="preferredRecovery">Preferred Recovery Method</Label>
                  <select
                    id="preferredRecovery"
                    name="preferredRecovery"
                    value={form.preferredRecovery}
                    onChange={handleChange}
                    className={selectCls}
                  >
                    <option value="">No preference</option>
                    <option>Composting</option>
                    <option>Biogas Generation</option>
                    <option>Animal Feed</option>
                    <option>Fertilizer Production</option>
                  </select>
                </div>

                {/* Special Handling */}
                <div className="sm:col-span-2">
                  <Label htmlFor="specialHandling">Special Handling Notes</Label>
                  <textarea
                    id="specialHandling"
                    name="specialHandling"
                    rows={3}
                    value={form.specialHandling}
                    onChange={handleChange}
                    placeholder="Any allergens, contaminants, storage conditions, access restrictions…"
                    className={inputCls}
                  />
                </div>
              </div>
            </section>

            {/* File Upload */}
            <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-base font-semibold text-gray-800 mb-4">
                <FontAwesomeIcon icon={faUpload} className="text-green-500 mr-2" />
                Photos / Documents
              </h2>
              <label className="block cursor-pointer border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-green-400 transition-colors">
                <FontAwesomeIcon icon={faUpload} className="text-3xl text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">
                  Drag & drop or{" "}
                  <span className="text-green-600 font-semibold">browse files</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG, PDF up to 10 MB each</p>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  multiple
                  onChange={handleFiles}
                  className="sr-only"
                />
              </label>
              {form.files.length > 0 && (
                <ul className="mt-3 space-y-1">
                  {form.files.map((f) => (
                    <li key={f.name} className="text-xs text-gray-600 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                      {f.name}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          {/* ── Right column — Location ─────────────────────────── */}
          <div className="space-y-6">
            <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faLocationDot} className="text-green-500" />
                Pickup Location
              </h2>
              <LocationPicker onLocationSelect={handleLocation} />
              {form.location && (
                <p className="mt-2 text-xs text-green-700 font-medium">
                  ✓ Location selected:{" "}
                  {form.location.lat?.toFixed(4)}, {form.location.lng?.toFixed(4)}
                </p>
              )}
            </section>

            {/* Submit */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-sm text-green-800 space-y-2">
              <p className="font-semibold">What happens next?</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Your report is received immediately</li>
                <li>A recovery facility will be assigned</li>
                <li>You'll be notified when collection is scheduled</li>
                <li>Track progress in My Materials</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl shadow-sm transition"
            >
              <FontAwesomeIcon icon={faFloppyDisk} />
              {submitting ? "Submitting…" : "Submit Report"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RecoveryAddMaterial;
