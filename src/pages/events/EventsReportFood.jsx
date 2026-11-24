import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const EventsReportFood = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    eventName: "",
    foodItem: "",
    quantity: "",
    unit: "meals",
    pickupAddress: "",
    pickupTime: "",
    notes: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Food report submitted successfully!");
    navigate("/events");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Report Surplus Food</h1>
      <p className="text-gray-500 mt-1 mb-8">
        Report leftover food from your event so it can be collected and redistributed.
      </p>

      <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Event Name</label>
            <input
              type="text"
              name="eventName"
              value={form.eventName}
              onChange={handleChange}
              required
              placeholder="e.g., Annual Gala Dinner"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Food Item</label>
            <input
              type="text"
              name="foodItem"
              value={form.foodItem}
              onChange={handleChange}
              required
              placeholder="e.g., Biryani, Sandwiches"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                required
                min="1"
                placeholder="e.g., 50"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Unit</label>
              <select
                name="unit"
                value={form.unit}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="meals">Meals</option>
                <option value="kg">Kilograms (kg)</option>
                <option value="pieces">Pieces</option>
                <option value="packs">Packs</option>
                <option value="boxes">Boxes</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Pickup Address</label>
            <input
              type="text"
              name="pickupAddress"
              value={form.pickupAddress}
              onChange={handleChange}
              required
              placeholder="Enter venue / pickup location"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Preferred Pickup Time</label>
            <input
              type="time"
              name="pickupTime"
              value={form.pickupTime}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Additional Notes</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Any special handling instructions..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Submit Report
            </button>
            <button
              type="button"
              onClick={() => navigate("/events")}
              className="border border-gray-300 text-gray-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventsReportFood;
