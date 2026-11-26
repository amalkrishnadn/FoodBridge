import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faFilter,
  faMapMarkerAlt,
  faClock,
  faWeightHanging,
  faUser,
  faTimes,
  faCheck,
  faLocationDot,
  faPhone,
  faWarehouse,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import Toast from "../../components/Toast";
import StatusBadge from "../../components/StatusBadge";
import { useApp } from "../../context/AppContext";

const INITIAL_FOOD = [
  {
    id: 1,
    foodName: "Vegetable Biryani",
    category: "Cooked Meals",
    condition: "Fresh",
    donor: "Rahul Sharma",
    donorType: "Restaurant",
    qty: 25,
    unit: "meals",
    expiry: "25 Nov 2026",
    location: "Kochi, Kerala",
    distance: "2.3 km",
    allergens: ["Gluten", "Dairy"],
    storageReq: "Keep warm, serve within 2 hrs",
    description: "Freshly prepared vegetable biryani from today's service. Packed in hygienic containers.",
    donorContact: "+91 98765 43210",
    status: "Available",
  },
  {
    id: 2,
    foodName: "Fresh Bread Loaves",
    category: "Bakery",
    condition: "Fresh",
    donor: "City Bakery",
    donorType: "Restaurant",
    qty: 40,
    unit: "pieces",
    expiry: "24 Nov 2026",
    location: "Ernakulam, Kerala",
    distance: "1.1 km",
    allergens: ["Gluten"],
    storageReq: "Room temperature, dry place",
    description: "Freshly baked bread loaves — white and whole wheat mix. Surplus from daily production.",
    donorContact: "+91 98111 22233",
    status: "Available",
  },
  {
    id: 3,
    foodName: "Assorted Fruit Packs",
    category: "Fruits & Veg",
    condition: "Good",
    donor: "Fresh Mart",
    donorType: "Supermarket",
    qty: 15,
    unit: "packs",
    expiry: "26 Nov 2026",
    location: "Thrissur, Kerala",
    distance: "5.7 km",
    allergens: [],
    storageReq: "Room temperature",
    description: "Pre-packed fruit assortments — bananas, apples, oranges. Near sell-by but perfectly fresh.",
    donorContact: "+91 94433 11122",
    status: "Available",
  },
  {
    id: 4,
    foodName: "Cooked Dal & Rice",
    category: "Cooked Meals",
    condition: "Fresh",
    donor: "Home Kitchen",
    donorType: "Individual",
    qty: 30,
    unit: "meals",
    expiry: "24 Nov 2026",
    location: "Palakkad, Kerala",
    distance: "8.2 km",
    allergens: [],
    storageReq: "Keep warm, consume within 3 hrs",
    description: "Home-cooked toor dal with rice — simple, nutritious, and freshly prepared.",
    donorContact: "+91 90012 34567",
    status: "Available",
  },
  {
    id: 5,
    foodName: "Packaged Biscuits & Snacks",
    category: "Packaged Food",
    condition: "Good",
    donor: "Metro Superstore",
    donorType: "Supermarket",
    qty: 60,
    unit: "packets",
    expiry: "15 Dec 2026",
    location: "Kochi, Kerala",
    distance: "3.8 km",
    allergens: ["Gluten", "Nuts"],
    storageReq: "Dry, sealed storage",
    description: "Assorted packaged biscuits and namkeen — slightly dented packaging but contents intact.",
    donorContact: "+91 95544 66677",
    status: "Available",
  },
  {
    id: 6,
    foodName: "Fresh Milk (Near Expiry)",
    category: "Dairy",
    condition: "Near Expiry",
    donor: "Sunrise Dairy",
    donorType: "Individual",
    qty: 20,
    unit: "litres",
    expiry: "24 Nov 2026",
    location: "Kozhikode, Kerala",
    distance: "12.4 km",
    allergens: ["Dairy"],
    storageReq: "Refrigerate below 4°C",
    description: "Fresh cow's milk — 1 day before expiry. Ideal for immediate distribution.",
    donorContact: "+91 94466 77788",
    status: "Available",
  },
  {
    id: 7,
    foodName: "Hotel Buffet Leftovers",
    category: "Cooked Meals",
    condition: "Day-Old",
    donor: "Grand Palace Hotel",
    donorType: "Hotel",
    qty: 50,
    unit: "meals",
    expiry: "24 Nov 2026",
    location: "Thrissur, Kerala",
    distance: "4.5 km",
    allergens: ["Gluten", "Dairy", "Eggs"],
    storageReq: "Reheat before serving",
    description: "Mixed buffet dishes — rice, curries, bread rolls, salad. Stored and packaged hygienically.",
    donorContact: "+91 92200 44455",
    status: "Available",
  },
  {
    id: 8,
    foodName: "Mixed Vegetables (Day-Old)",
    category: "Fruits & Veg",
    condition: "Day-Old",
    donor: "Green Kitchen Canteen",
    donorType: "Restaurant",
    qty: 20,
    unit: "kg",
    expiry: "24 Nov 2026",
    location: "Ernakulam, Kerala",
    distance: "2.9 km",
    allergens: [],
    storageReq: "Refrigerate, use within 12 hrs",
    description: "Day-old mixed vegetable subzi — potatoes, carrots, beans, peas. Cooked without preservatives.",
    donorContact: "+91 91122 33344",
    status: "Pending",
  },
  {
    id: 9,
    foodName: "Sandwiches & Wraps",
    category: "Bakery",
    condition: "Fresh",
    donor: "Campus Canteen CUSAT",
    donorType: "Restaurant",
    qty: 35,
    unit: "pieces",
    expiry: "24 Nov 2026",
    location: "Kochi, Kerala",
    distance: "1.6 km",
    allergens: ["Gluten", "Dairy"],
    storageReq: "Refrigerate, consume within 4 hrs",
    description: "Freshly made sandwiches and wraps — vegetable and paneer fillings.",
    donorContact: "+91 94455 66600",
    status: "Available",
  },
  {
    id: 10,
    foodName: "Idli & Sambar Packs",
    category: "Cooked Meals",
    condition: "Fresh",
    donor: "South Spice Restaurant",
    donorType: "Restaurant",
    qty: 40,
    unit: "meals",
    expiry: "24 Nov 2026",
    location: "Palakkad, Kerala",
    distance: "6.1 km",
    allergens: [],
    storageReq: "Keep warm, serve within 3 hrs",
    description: "Freshly steamed idlis with hot sambar and coconut chutney. Prepared this morning.",
    donorContact: "+91 98833 44400",
    status: "Available",
  },
  {
    id: 11,
    foodName: "Canned Goods (Near Expiry)",
    category: "Packaged Food",
    condition: "Near Expiry",
    donor: "ValueMart Supermarket",
    donorType: "Supermarket",
    qty: 45,
    unit: "cans",
    expiry: "30 Nov 2026",
    location: "Kochi, Kerala",
    distance: "3.3 km",
    allergens: [],
    storageReq: "Room temperature",
    description: "Mixed canned goods — beans, tomatoes, corn. Intact, no damage. Approaching best-by date.",
    donorContact: "+91 95511 22200",
    status: "Available",
  },
  {
    id: 12,
    foodName: "Paneer & Cheese",
    category: "Dairy",
    condition: "Good",
    donor: "Milky Way Dairy",
    donorType: "Individual",
    qty: 5,
    unit: "kg",
    expiry: "26 Nov 2026",
    location: "Thrissur, Kerala",
    distance: "7.8 km",
    allergens: ["Dairy"],
    storageReq: "Refrigerate below 4°C",
    description: "Fresh paneer blocks and cheese slices — excess production from local dairy.",
    donorContact: "+91 90099 11100",
    status: "Available",
  },
];

const CATEGORIES = ["All Categories", "Cooked Meals", "Bakery", "Fruits & Veg", "Dairy", "Packaged Food"];
const CONDITIONS = ["All Conditions", "Fresh", "Good", "Near Expiry", "Day-Old"];
const SORTS = ["Newest", "Expiry Soon", "Quantity High to Low"];

const conditionColor = {
  Fresh: "bg-green-100 text-green-700",
  Good: "bg-blue-100 text-blue-700",
  "Near Expiry": "bg-red-100 text-red-700",
  "Day-Old": "bg-yellow-100 text-yellow-700",
};

const donorTypeColor = {
  Restaurant: "bg-purple-50 text-purple-600",
  Hotel: "bg-indigo-50 text-indigo-600",
  Individual: "bg-green-50 text-green-600",
  Supermarket: "bg-orange-50 text-orange-600",
};

const NgoAvailableFood = () => {
  const { createNgoRequest } = useApp();
  const [foodItems, setFoodItems] = useState(INITIAL_FOOD);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [condition, setCondition] = useState("All Conditions");
  const [sortBy, setSortBy] = useState("Newest");
  const [toast, setToast] = useState({ message: "", type: "success" });
  const [detailItem, setDetailItem] = useState(null);

  const showToast = (message, type = "success") => setToast({ message, type });
  const closeToast = () => setToast({ message: "", type: "success" });

  const handleRequest = (id) => {
    const item = foodItems.find((f) => f.id === id);
    if (!item || item.status !== "Available") return;
    createNgoRequest({
      donationId: `LIST-${item.id}`,
      foodName: item.foodName,
      source: item.donor,
      qty: `${item.qty} ${item.unit}`,
      requestedFor: `${item.location} · ${item.distance}`,
    });
    setFoodItems((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: "Pending" } : f))
    );
    showToast("Food request submitted. Track it under My Requests.");
  };

  let filtered = foodItems.filter((f) => {
    const matchSearch =
      f.foodName.toLowerCase().includes(search.toLowerCase()) ||
      f.donor.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All Categories" || f.category === category;
    const matchCond = condition === "All Conditions" || f.condition === condition;
    return matchSearch && matchCat && matchCond;
  });

  if (sortBy === "Expiry Soon") {
    filtered = [...filtered].sort((a, b) =>
      new Date(a.expiry) - new Date(b.expiry)
    );
  } else if (sortBy === "Quantity High to Low") {
    filtered = [...filtered].sort((a, b) => b.qty - a.qty);
  }

  return (
    <div>
      <Toast message={toast.message} type={toast.type} onClose={closeToast} />

      <h1 className="text-2xl font-bold text-gray-800">Available Food</h1>
      <p className="text-gray-500 mt-1 mb-6">
        Browse food donations available for NGO collection and distribution.
      </p>

      {/* Filter bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="flex-1 min-w-48 relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
            />
            <input
              type="text"
              placeholder="Search food name or donor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
            />
          </div>
          {/* Category */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-300 bg-white"
          >
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          {/* Condition */}
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-300 bg-white"
          >
            {CONDITIONS.map((c) => <option key={c}>{c}</option>)}
          </select>
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-300 bg-white"
          >
            {SORTS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-4">
        Showing <span className="font-semibold text-gray-700">{filtered.length}</span> of{" "}
        {foodItems.length} food items
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
          <FontAwesomeIcon icon={faFilter} className="text-4xl text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">No food items match your filters.</p>
          <button
            onClick={() => { setSearch(""); setCategory("All Categories"); setCondition("All Conditions"); setSortBy("Newest"); }}
            className="mt-3 text-green-600 text-sm hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={`https://picsum.photos/seed/${item.id * 13}/400/200`}
                  alt={item.foodName}
                  className="w-full h-40 object-cover"
                />
                <span className={`absolute top-2 right-2 text-xs font-semibold px-2.5 py-1 rounded-full ${conditionColor[item.condition]}`}>
                  {item.condition}
                </span>
              </div>

              <div className="p-4">
                {/* Badges row */}
                <div className="flex gap-2 flex-wrap mb-2">
                  <span className="text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full font-medium">
                    {item.category}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${donorTypeColor[item.donorType]}`}>
                    {item.donorType}
                  </span>
                </div>

                <h3 className="font-bold text-gray-800 mb-2">{item.foodName}</h3>

                <div className="space-y-1.5 text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faUser} className="w-3.5 text-gray-400" />
                    <span>{item.donor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faWeightHanging} className="w-3.5 text-gray-400" />
                    <span>{item.qty} {item.unit}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faClock} className="w-3.5 text-gray-400" />
                    <span>Expiry: {item.expiry}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faLocationDot} className="w-3.5 text-gray-400" />
                    <span>{item.location}</span>
                    <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                      {item.distance}
                    </span>
                  </div>
                </div>

                {/* Allergens */}
                {item.allergens.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.allergens.map((a) => (
                      <span key={a} className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">
                        ⚠ {a}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => setDetailItem(item)}
                    className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    View Details
                  </button>
                  {item.status === "Available" ? (
                    <button
                      onClick={() => handleRequest(item.id)}
                      className="flex-1 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
                    >
                      Request
                    </button>
                  ) : (
                    <span className="flex-1 py-2 text-center bg-yellow-50 text-yellow-700 rounded-lg text-sm font-semibold flex items-center justify-center gap-1">
                      <FontAwesomeIcon icon={faCheck} className="text-xs" /> Requested
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {detailItem && (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto">
            <img
              src={`https://picsum.photos/seed/${detailItem.id * 13}/800/300`}
              alt={detailItem.foodName}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex gap-2 flex-wrap mb-2">
                    <span className="text-xs text-green-700 bg-green-50 px-2.5 py-1 rounded-full font-semibold">
                      {detailItem.category}
                    </span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${conditionColor[detailItem.condition]}`}>
                      {detailItem.condition}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">{detailItem.foodName}</h2>
                </div>
                <button
                  onClick={() => setDetailItem(null)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>

              <p className="text-sm text-gray-500 mb-5">{detailItem.description}</p>

              <div className="grid grid-cols-2 gap-4 text-sm mb-5">
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Donor</p>
                  <p className="font-medium text-gray-700">{detailItem.donor}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${donorTypeColor[detailItem.donorType]}`}>
                    {detailItem.donorType}
                  </span>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Contact</p>
                  <p className="font-medium text-gray-700 flex items-center gap-1">
                    <FontAwesomeIcon icon={faPhone} className="text-xs text-gray-400" />
                    {detailItem.donorContact}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Quantity</p>
                  <p className="font-medium text-gray-700">{detailItem.qty} {detailItem.unit}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Expiry</p>
                  <p className="font-medium text-gray-700">{detailItem.expiry}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Location</p>
                  <p className="font-medium text-gray-700 flex items-center gap-1">
                    <FontAwesomeIcon icon={faLocationDot} className="text-xs text-gray-400" />
                    {detailItem.location} ({detailItem.distance})
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Storage</p>
                  <p className="font-medium text-gray-700 flex items-center gap-1">
                    <FontAwesomeIcon icon={faWarehouse} className="text-xs text-gray-400" />
                    {detailItem.storageReq}
                  </p>
                </div>
              </div>

              {detailItem.allergens.length > 0 && (
                <div className="mb-5">
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-2 flex items-center gap-1">
                    <FontAwesomeIcon icon={faTriangleExclamation} className="text-amber-400" />
                    Allergens
                  </p>
                  <div className="flex gap-1 flex-wrap">
                    {detailItem.allergens.map((a) => (
                      <span key={a} className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setDetailItem(null)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50"
                >
                  Close
                </button>
                {detailItem.status === "Available" ? (
                  <button
                    onClick={() => { handleRequest(detailItem.id); setDetailItem(null); }}
                    className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700"
                  >
                    Request Collection
                  </button>
                ) : (
                  <span className="flex-1 py-2.5 text-center bg-yellow-50 text-yellow-700 rounded-xl text-sm font-semibold">
                    Already Requested
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NgoAvailableFood;
