import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LocationPicker from "../../components/LocationPicker";
import Toast from "../../components/Toast";
import { useApp } from "../../context/AppContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

const EventsReportFood = () => {
  const navigate = useNavigate();
  const { createEventReport } = useApp();
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    eventName: "",
    foodItem: "",
    quantity: "",
    unit: "meals",
    pickupTime: "",
    notes: "",
  });

  const [location, setLocation] = useState({
    address: "", state: "", district: "", city: "", pincode: "",
    lat: null, lng: null,
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!location.lat || !location.lng) {
      setToast({ msg: "Please select an event venue on the map.", type: "error" });
      return;
    }
    createEventReport({ ...form, foodName: form.foodItem, location });
    setToast({ msg: "Food report submitted successfully!", type: "success" });
    setTimeout(() => navigate("/events/my-reports"), 800);
  };

  const inputCls =
    "w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 text-sm";

  return (
    <div>
      {toast && (
        <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FontAwesomeIcon icon={faCalendarAlt} className="text-green-600" />
          Report Surplus Food
        </h1>
        <p className="text-gray-500 mt-1">
          Report leftover food from your event and select the venue location on the map.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        {/* ── Event & Food Details ── */}
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide border-b pb-2">
            Event & Food Information
          </h2>

          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm">
              Event Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="eventName"
              value={form.eventName}
              onChange={handleChange}
              required
              placeholder="e.g., Annual Gala Dinner"
              className={inputCls}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm">
              Food Item <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="foodItem"
              value={form.foodItem}
              onChange={handleChange}
              required
              placeholder="e.g., Biryani, Sandwiches"
              className={inputCls}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                required
                min="1"
                placeholder="e.g., 50"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">Unit</label>
              <select name="unit" value={form.unit} onChange={handleChange} className={inputCls}>
                <option value="meals">Meals</option>
                <option value="kg">Kilograms (kg)</option>
                <option value="pieces">Pieces</option>
                <option value="packs">Packs</option>
                <option value="boxes">Boxes</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm">
              Preferred Pickup Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              name="pickupTime"
              value={form.pickupTime}
              onChange={handleChange}
              required
              className={inputCls}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm">Additional Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Special handling, allergies, packaging details…"
              className={inputCls}
            />
          </div>
        </div>

        {/* ── Location ── */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wide border-b pb-2 mb-4 flex items-center gap-2">
            <FontAwesomeIcon icon={faMapMarkerAlt} className="text-green-600" />
            Event Venue / Pickup Location
          </h2>
          <LocationPicker value={location} onChange={setLocation} />
        </div>

        {/* ── Actions ── */}
        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition text-sm"
          >
            Submit Report
          </button>
          <button
            type="button"
            onClick={() => navigate("/events")}
            className="border border-gray-300 text-gray-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventsReportFood;
