import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch, faFilter, faDrumstickBite, faWeightHanging, faClock,
  faUser, faTimes, faCheck, faLocationDot, faPhone, faWarehouse, faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import Toast from "../../components/Toast";
import StatusBadge from "../../components/StatusBadge";
import { useApp } from "../../context/AppContext";

const CATEGORIES = ["All", "Bakery", "Vegetables", "Cooked Meals", "Fruits", "Dairy", "Grains", "Other"];

const SUITABLE_FOOD = [
  { id: "AF-1", foodName: "Stale Bread Loaves", category: "Bakery", condition: "Suitable", donor: "City Bakery", donorType: "Bakery", qty: 15, unit: "kg", expiry: "27 Nov 2026", location: "Kochi, Kerala", distance: "1.5 km", allergens: ["Gluten"], storageReq: "Room temperature, dry place", description: "Day-old bread loaves suitable for animal consumption.", donorContact: "+91 98111 22233", status: "Available" },
  { id: "AF-2", foodName: "Vegetable Scraps", category: "Vegetables", condition: "Suitable", donor: "Green Garden Hotel", donorType: "Hotel", qty: 30, unit: "kg", expiry: "26 Nov 2026", location: "Ernakulam, Kerala", distance: "3.2 km", allergens: [], storageReq: "Cool, dry area", description: "Fresh vegetable peelings and scraps from hotel kitchen.", donorContact: "+91 94433 11122", status: "Available" },
  { id: "AF-3", foodName: "Cooked Rice Leftover", category: "Cooked Meals", condition: "Suitable", donor: "Rahul's Restaurant", donorType: "Restaurant", qty: 20, unit: "kg", expiry: "26 Nov 2026", location: "Thrissur, Kerala", distance: "5.7 km", allergens: [], storageReq: "Must be used within 4 hours", description: "Leftover cooked rice from today's lunch service.", donorContact: "+91 90012 34567", status: "Available" },
  { id: "AF-4", foodName: "Fruits Past Sell-by", category: "Fruits", condition: "Suitable", donor: "Fresh Mart", donorType: "Supermarket", qty: 10, unit: "kg", expiry: "26 Nov 2026", location: "Kochi, Kerala", distance: "2.8 km", allergens: [], storageReq: "Room temperature", description: "Mixed seasonal fruits past sell-by date but still suitable for animal feed.", donorContact: "+91 80001 55678", status: "Available" },
  { id: "AF-5", foodName: "Dairy Near Expiry", category: "Dairy", condition: "Moderate", donor: "Sunrise Dairy", donorType: "Dairy", qty: 8, unit: "litres", expiry: "26 Nov 2026", location: "Palakkad, Kerala", distance: "12 km", allergens: ["Dairy"], storageReq: "Refrigerate below 4°C", description: "Milk and buttermilk nearing expiry. Suitable for cattle and poultry.", donorContact: "+91 92200 44455", status: "Available" },
];

const conditionColor = {
  Suitable: "bg-green-100 text-green-700",
  Moderate: "bg-yellow-100 text-yellow-700",
  "Near Expiry": "bg-red-100 text-red-700",
};

const AnimalFeedAvailableFood = () => {
  const { createAnimalFeedReq } = useApp();

  const [food, setFood] = useState(SUITABLE_FOOD);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [detailItem, setDetailItem] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "success" });

  const closeToast = () => setToast({ message: "", type: "success" });

  const handleRequest = (item) => {
    createAnimalFeedReq({
      foodName: item.foodName,
      foodItem: item.foodName,
      source: item.donor,
      donor: item.donor,
      qty: `${item.qty} ${item.unit}`,
      farmDestination: "My Farm",
      pickupTime: "Tomorrow 9:00 AM",
      notes: "",
      requestedOn: new Date().toLocaleDateString("en-IN"),
    });
    setFood((f) => f.map((i) => i.id === item.id ? { ...i, status: "Requested" } : i));
    setToast({ message: `Request submitted for ${item.foodName}!`, type: "success" });
  };

  const filtered = food.filter((f) => {
    const matchSearch = f.foodName.toLowerCase().includes(search.toLowerCase()) || f.donor.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || f.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div>
      {toast.message && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Available Food for Animal Feed</h1>
        <p className="text-gray-500 mt-1">Browse food suitable for animal consumption and farm use.</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-wrap gap-3">
        <div className="flex-1 min-w-48 relative">
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3.5 text-gray-400 text-sm" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search food or donor..."
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300 bg-white"
        >
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-5">
              <div className="flex gap-2 mb-2 flex-wrap">
                <span className="text-xs text-orange-700 bg-orange-50 px-2.5 py-1 rounded-full font-semibold">{item.category}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${conditionColor[item.condition] || "bg-gray-100 text-gray-700"}`}>{item.condition}</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{item.foodName}</h3>
              <div className="space-y-1 text-sm text-gray-500">
                <p className="flex items-center gap-1.5"><FontAwesomeIcon icon={faUser} className="text-xs text-gray-400" /> {item.donor}</p>
                <p className="flex items-center gap-1.5"><FontAwesomeIcon icon={faWeightHanging} className="text-xs text-gray-400" /> {item.qty} {item.unit}</p>
                <p className="flex items-center gap-1.5"><FontAwesomeIcon icon={faClock} className="text-xs text-gray-400" /> Expires: {item.expiry}</p>
                <p className="flex items-center gap-1.5"><FontAwesomeIcon icon={faLocationDot} className="text-xs text-gray-400" /> {item.location} · {item.distance}</p>
              </div>
              <div className="mt-4 flex gap-2">
                <button onClick={() => setDetailItem(item)} className="flex-1 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
                  View Details
                </button>
                {item.status === "Available" ? (
                  <button onClick={() => handleRequest(item)} className="flex-1 py-2 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700">
                    Request
                  </button>
                ) : (
                  <span className="flex-1 py-2 text-center bg-yellow-50 text-yellow-700 rounded-xl text-sm font-semibold">Requested</span>
                )}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-400">
            <FontAwesomeIcon icon={faDrumstickBite} className="text-4xl mb-3 text-gray-300" />
            <p>No food found matching your filters.</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {detailItem && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setDetailItem(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{detailItem.foodName}</h2>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${conditionColor[detailItem.condition]}`}>{detailItem.condition}</span>
              </div>
              <button onClick={() => setDetailItem(null)} className="text-gray-400 hover:text-gray-600 p-1"><FontAwesomeIcon icon={faTimes} /></button>
            </div>
            <p className="text-sm text-gray-500 mb-4">{detailItem.description}</p>
            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              {[
                ["Donor", detailItem.donor],
                ["Contact", detailItem.donorContact],
                ["Quantity", `${detailItem.qty} ${detailItem.unit}`],
                ["Expiry", detailItem.expiry],
                ["Location", detailItem.location],
                ["Storage", detailItem.storageReq],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">{label}</p>
                  <p className="font-medium text-gray-700">{value}</p>
                </div>
              ))}
            </div>
            {detailItem.allergens.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-gray-400 uppercase mb-1 flex items-center gap-1"><FontAwesomeIcon icon={faTriangleExclamation} className="text-amber-400" /> Allergens</p>
                <div className="flex gap-1 flex-wrap">
                  {detailItem.allergens.map((a) => <span key={a} className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">{a}</span>)}
                </div>
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => setDetailItem(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Close</button>
              {detailItem.status === "Available" ? (
                <button onClick={() => { handleRequest(detailItem); setDetailItem(null); }} className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700">
                  Request Collection
                </button>
              ) : (
                <span className="flex-1 py-2.5 text-center bg-yellow-50 text-yellow-700 rounded-xl text-sm font-semibold">Already Requested</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimalFeedAvailableFood;
