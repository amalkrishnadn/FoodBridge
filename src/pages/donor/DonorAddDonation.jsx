import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "../../components/Toast";
import LocationPicker from "../../components/LocationPicker";
import { useApp } from "../../context/AppContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUtensils,
  faTag,
  faLeaf,
  faImage,
  faMapMarkerAlt,
  faClock,
  faUser,
  faPhone,
  faRecycle,
  faCheckCircle,
  faUpload,
  faChevronRight,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  "Cooked Meals",
  "Bakery & Bread",
  "Fruits & Vegetables",
  "Dairy Products",
  "Beverages",
  "Packaged Food",
  "Raw Ingredients",
  "Surplus Event Food",
];

const CONDITIONS = [
  "Fresh (Same Day)",
  "Good (1-2 Days Old)",
  "Near Expiry",
  "Day-Old",
];

const UNITS = ["meals", "kg", "pieces", "packs", "litres", "boxes"];

const ALLERGENS_LIST = ["Gluten", "Dairy", "Nuts", "Eggs", "Soy", "Shellfish"];

const STORAGE_OPTIONS = ["Room Temperature", "Refrigerated", "Frozen"];

const DISPOSAL_OPTIONS = [
  {
    value: "human",
    label: "Human Consumption (NGO / Public)",
    icon: faUser,
    description: "Food goes directly to NGOs, food banks, or community kitchens to feed people in need.",
    color: "green",
  },
  {
    value: "animal",
    label: "Animal Feed (Farms / Handlers)",
    icon: faLeaf,
    description: "Surplus food is redirected to licensed farms and animal handlers as feed.",
    color: "amber",
  },
  {
    value: "composting",
    label: "Composting",
    icon: faRecycle,
    description: "Organic waste is composted into nutrient-rich soil — a sustainable choice.",
    color: "lime",
  },
  {
    value: "biogas",
    label: "Biogas Facility",
    icon: faCheckCircle,
    description: "Food waste is converted into biogas energy at registered facilities.",
    color: "blue",
  },
  {
    value: "any",
    label: "Any (Let Platform Decide)",
    icon: faInfoCircle,
    description: "FoodBridge will assign the best disposal route based on quantity, quality, and demand.",
    color: "purple",
  },
];

const DISPOSAL_COLOR_MAP = {
  green: {
    border: "border-green-400",
    bg: "bg-green-50",
    icon: "text-green-600",
    label: "text-green-800",
  },
  amber: {
    border: "border-amber-400",
    bg: "bg-amber-50",
    icon: "text-amber-600",
    label: "text-amber-800",
  },
  lime: {
    border: "border-lime-400",
    bg: "bg-lime-50",
    icon: "text-lime-600",
    label: "text-lime-800",
  },
  blue: {
    border: "border-blue-400",
    bg: "bg-blue-50",
    icon: "text-blue-600",
    label: "text-blue-800",
  },
  purple: {
    border: "border-purple-400",
    bg: "bg-purple-50",
    icon: "text-purple-600",
    label: "text-purple-800",
  },
};

// ─── Section Wrapper ───────────────────────────────────────────────────────────
const Section = ({ icon, title, subtitle, children, step }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-white">
      <div className="w-9 h-9 rounded-xl bg-green-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
        {step}
      </div>
      <div>
        <h2 className="font-bold text-gray-800 flex items-center gap-2 text-base">
          <FontAwesomeIcon icon={icon} className="text-green-600" />
          {title}
        </h2>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

// ─── Field Wrapper ─────────────────────────────────────────────────────────────
const Field = ({ label, required, children, hint }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
  </div>
);

// ─── Main Form ─────────────────────────────────────────────────────────────────
export default function DonorAddDonation() {
  const navigate = useNavigate();
  const { createDonation } = useApp();
  const fileInputRef = useRef(null);

  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Form state
  const [form, setForm] = useState({
    // Section 1 – Food Info
    foodName: "",
    category: "",
    condition: "",
    quantity: "",
    unit: "meals",
    expiryDate: "",
    allergens: [],
    storageRequirement: "Room Temperature",
    imageFile: null,
    imagePreview: null,
    description: "",

    // Section 2 – Disposal
    disposalPreference: "any",

    // Section 3 – Location
    location: {
      address: "",
      state: "",
      district: "",
      city: "",
      pincode: "",
      lat: null,
      lng: null,
    },

    // Section 4 – Collection Window
    availableFrom: "",
    availableUntil: "",
    contactName: "",
    contactPhone: "",
  });

  const set = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const toggleAllergen = (a) =>
    setForm((prev) => ({
      ...prev,
      allergens: prev.allergens.includes(a)
        ? prev.allergens.filter((x) => x !== a)
        : [...prev.allergens, a],
    }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    set("imageFile", file);
    const reader = new FileReader();
    reader.onload = (ev) => set("imagePreview", ev.target.result);
    reader.readAsDataURL(file);
  };

  // Validation
  const validate = () => {
    const errs = {};
    if (!form.foodName.trim()) errs.foodName = "Food name is required.";
    if (!form.category) errs.category = "Please select a category.";
    if (!form.condition) errs.condition = "Please select the food condition.";
    if (!form.quantity || Number(form.quantity) <= 0) errs.quantity = "Enter a valid quantity.";
    if (!form.expiryDate) errs.expiryDate = "Expiry date is required.";
    if (!form.location.address.trim()) errs.address = "Pickup address is required.";
    if (!form.location.lat || !form.location.lng)
      errs.location = "Please select a location on the map.";
    if (!form.contactName.trim()) errs.contactName = "Contact name is required.";
    if (!form.contactPhone.trim()) errs.contactPhone = "Contact phone is required.";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setToast({ message: "Please fix the highlighted errors before submitting.", type: "error" });
      setTimeout(() => setToast(null), 4000);
      return;
    }

    setSubmitting(true);
    createDonation({
      foodName: form.foodName.trim(),
      category: form.category,
      condition: form.condition,
      quantity: form.quantity,
      unit: form.unit,
      expiryDate: form.expiryDate,
      allergens: form.allergens,
      storage: form.storageRequirement,
      notes: form.description,
      disposalPreference: form.disposalPreference,
      images: form.imagePreview ? [form.imagePreview] : [],
      location: form.location,
      donorName: form.contactName,
      donorPhone: form.contactPhone,
    });
    setSubmitting(false);
    setToast({ message: "Donation listed successfully! Redirecting…", type: "success" });
    setTimeout(() => navigate("/donor/my-donations"), 800);
  };

  const inputCls = (err) =>
    `w-full border ${err ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:ring-green-500"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2`;

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Page Header */}
      <div className="max-w-3xl mx-auto mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Add New Donation</h1>
        <p className="text-sm text-gray-500 mt-1">
          Fill in the details below to list your food donation on FoodBridge.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="max-w-3xl mx-auto space-y-6">

        {/* ── SECTION 1: Food Information ─────────────────────────────────── */}
        <Section icon={faUtensils} title="Food Information" subtitle="Describe the food you want to donate." step="1">
          <div className="space-y-5">

            {/* Food Name */}
            <Field label="Food Name" required>
              <input
                type="text"
                value={form.foodName}
                onChange={(e) => set("foodName", e.target.value)}
                placeholder="e.g. Vegetable Biryani, Sourdough Bread, Fresh Tomatoes"
                className={inputCls(errors.foodName)}
              />
              {errors.foodName && <p className="text-xs text-red-500 mt-1">{errors.foodName}</p>}
            </Field>

            {/* Category + Condition */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Category" required>
                <select
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  className={inputCls(errors.category)}
                >
                  <option value="">Select category…</option>
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
              </Field>

              <Field label="Condition" required>
                <select
                  value={form.condition}
                  onChange={(e) => set("condition", e.target.value)}
                  className={inputCls(errors.condition)}
                >
                  <option value="">Select condition…</option>
                  {CONDITIONS.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                {errors.condition && <p className="text-xs text-red-500 mt-1">{errors.condition}</p>}
              </Field>
            </div>

            {/* Quantity + Unit */}
            <Field label="Quantity" required>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="1"
                  value={form.quantity}
                  onChange={(e) => set("quantity", e.target.value)}
                  placeholder="e.g. 20"
                  className={`flex-1 border ${errors.quantity ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:ring-green-500"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2`}
                />
                <select
                  value={form.unit}
                  onChange={(e) => set("unit", e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {UNITS.map((u) => (
                    <option key={u}>{u}</option>
                  ))}
                </select>
              </div>
              {errors.quantity && <p className="text-xs text-red-500 mt-1">{errors.quantity}</p>}
            </Field>

            {/* Expiry Date */}
            <Field label="Best Before / Expiry Date" required>
              <input
                type="date"
                value={form.expiryDate}
                onChange={(e) => set("expiryDate", e.target.value)}
                className={inputCls(errors.expiryDate)}
              />
              {errors.expiryDate && <p className="text-xs text-red-500 mt-1">{errors.expiryDate}</p>}
            </Field>

            {/* Allergens */}
            <Field label="Allergens" hint="Select all that apply. Leave blank if none.">
              <div className="flex flex-wrap gap-2 mt-1">
                {ALLERGENS_LIST.map((a) => {
                  const checked = form.allergens.includes(a);
                  return (
                    <label
                      key={a}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border cursor-pointer text-sm transition-colors select-none ${
                        checked
                          ? "bg-red-50 border-red-300 text-red-700 font-medium"
                          : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={checked}
                        onChange={() => toggleAllergen(a)}
                      />
                      {a}
                    </label>
                  );
                })}
              </div>
            </Field>

            {/* Storage Requirements */}
            <Field label="Storage Requirements">
              <div className="flex flex-wrap gap-2 mt-1">
                {STORAGE_OPTIONS.map((opt) => (
                  <label
                    key={opt}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border cursor-pointer text-sm transition-colors select-none ${
                      form.storageRequirement === opt
                        ? "bg-green-50 border-green-400 text-green-700 font-medium"
                        : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <input
                      type="radio"
                      className="hidden"
                      name="storage"
                      value={opt}
                      checked={form.storageRequirement === opt}
                      onChange={() => set("storageRequirement", opt)}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </Field>

            {/* Food Image Upload */}
            <Field label="Food Image" hint="Upload a photo of the food (optional). Max 5 MB.">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative cursor-pointer border-2 border-dashed border-gray-300 rounded-xl overflow-hidden hover:border-green-500 transition-colors"
              >
                {form.imagePreview ? (
                  <div className="relative">
                    <img
                      src={form.imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <span className="text-white text-sm font-medium flex items-center gap-1">
                        <FontAwesomeIcon icon={faUpload} />
                        Change Image
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                    <FontAwesomeIcon icon={faImage} className="text-4xl mb-2" />
                    <p className="text-sm font-medium">Click to upload a photo</p>
                    <p className="text-xs mt-1">JPG, PNG, WEBP supported</p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </Field>

            {/* Description / Notes */}
            <Field label="Description / Additional Notes" hint="Any extra info the receiver should know.">
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="e.g. Packed in separate containers, suitable for vegetarians…"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              />
            </Field>
          </div>
        </Section>

        {/* ── SECTION 2: Disposal Preference ─────────────────────────────── */}
        <Section icon={faRecycle} title="Disposal Preference" subtitle="How should this food be used if not claimed quickly?" step="2">
          <div className="space-y-3">
            {DISPOSAL_OPTIONS.map((opt) => {
              const colors = DISPOSAL_COLOR_MAP[opt.color];
              const selected = form.disposalPreference === opt.value;
              return (
                <label
                  key={opt.value}
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all select-none ${
                    selected
                      ? `${colors.border} ${colors.bg}`
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="disposal"
                    value={opt.value}
                    checked={selected}
                    onChange={() => set("disposalPreference", opt.value)}
                    className="hidden"
                  />
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      selected ? colors.bg + " " + colors.icon : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <FontAwesomeIcon icon={opt.icon} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${selected ? colors.label : "text-gray-800"}`}>
                      {opt.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{opt.description}</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                      selected ? `${colors.border} ${colors.bg}` : "border-gray-300"
                    }`}
                  >
                    {selected && (
                      <div className={`w-2.5 h-2.5 rounded-full ${opt.color === "green" ? "bg-green-600" : opt.color === "amber" ? "bg-amber-500" : opt.color === "lime" ? "bg-lime-600" : opt.color === "blue" ? "bg-blue-600" : "bg-purple-600"}`} />
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        </Section>

        {/* ── SECTION 3: Location ─────────────────────────────────────────── */}
        <Section icon={faMapMarkerAlt} title="Pickup Location" subtitle="Where should volunteers or recipients collect the food?" step="3">
          <LocationPicker
            value={form.location}
            onChange={(loc) => {
              set("location", loc);
              if (errors.address || errors.location) {
                setErrors((prev) => ({ ...prev, address: null, location: null }));
              }
            }}
          />
          {errors.address && (
            <p className="text-xs text-red-500 mt-2">{errors.address}</p>
          )}
          {errors.location && (
            <p className="text-xs text-red-500 mt-1">{errors.location}</p>
          )}
        </Section>

        {/* ── SECTION 4: Collection Window ────────────────────────────────── */}
        <Section icon={faClock} title="Collection Window" subtitle="When can the food be picked up?" step="4">
          <div className="space-y-5">
            {/* Time range */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Available From" hint="Earliest pickup time">
                <input
                  type="time"
                  value={form.availableFrom}
                  onChange={(e) => set("availableFrom", e.target.value)}
                  className={inputCls()}
                />
              </Field>
              <Field label="Available Until" hint="Latest pickup time">
                <input
                  type="time"
                  value={form.availableUntil}
                  onChange={(e) => set("availableUntil", e.target.value)}
                  className={inputCls()}
                />
              </Field>
            </div>

            {/* Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Contact Name" required>
                <div className="relative">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"
                  />
                  <input
                    type="text"
                    value={form.contactName}
                    onChange={(e) => set("contactName", e.target.value)}
                    placeholder="Your name"
                    className={`${inputCls(errors.contactName)} pl-8`}
                  />
                </div>
                {errors.contactName && (
                  <p className="text-xs text-red-500 mt-1">{errors.contactName}</p>
                )}
              </Field>

              <Field label="Contact Phone" required>
                <div className="relative">
                  <FontAwesomeIcon
                    icon={faPhone}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"
                  />
                  <input
                    type="tel"
                    value={form.contactPhone}
                    onChange={(e) => set("contactPhone", e.target.value)}
                    placeholder="+91 98765 43210"
                    className={`${inputCls(errors.contactPhone)} pl-8`}
                  />
                </div>
                {errors.contactPhone && (
                  <p className="text-xs text-red-500 mt-1">{errors.contactPhone}</p>
                )}
              </Field>
            </div>
          </div>
        </Section>

        {/* ── Submit ──────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-10">
          <button
            type="button"
            onClick={() => navigate("/donor/my-donations")}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-white font-semibold text-sm transition-colors shadow-md ${
              submitting
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {submitting ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Submitting…
              </>
            ) : (
              <>
                Submit Donation
                <FontAwesomeIcon icon={faChevronRight} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
