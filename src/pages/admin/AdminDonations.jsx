import React, { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faFilter,
  faEye,
  faCheck,
  faTimes,
  faFlagCheckered,
  faDownload,
  faChevronLeft,
  faChevronRight,
  faXmark,
  faUtensils,
  faLocationDot,
  faCalendar,
  faUser,
  faBoxOpen,
} from "@fortawesome/free-solid-svg-icons";
import Toast from "../../components/Toast";
import GenericProgressTracker from "../../components/GenericProgressTracker";

const ADMIN_DONATION_STAGES = ["Pending", "Approved", "Completed"];

/* ─── Sample Data ─────────────────────────────────── */
const INITIAL_DONATIONS = [
  { id: "DON-001", foodName: "Vegetable Rice", category: "Cooked Meals", condition: "Fresh", donor: "Green Plate Catering", donorType: "Restaurant", qty: 50, unit: "kg", location: "Kochi, Kerala", createdAt: "2026-11-20", expiryDate: "2026-11-21", status: "Pending", disposalPref: "NGO Distribution" },
  { id: "DON-002", foodName: "Assorted Bread Loaves", category: "Bakery & Bread", condition: "Good", donor: "Sunrise Bakery", donorType: "Bakery", qty: 30, unit: "pcs", location: "Ernakulam, Kerala", createdAt: "2026-11-21", expiryDate: "2026-11-22", status: "Approved", disposalPref: "NGO Distribution" },
  { id: "DON-003", foodName: "Mixed Fruits Basket", category: "Fruits & Vegetables", condition: "Fresh", donor: "FreshMart Supermarket", donorType: "Retail", qty: 20, unit: "kg", location: "Thrissur, Kerala", createdAt: "2026-11-21", expiryDate: "2026-11-25", status: "Completed", disposalPref: "Animal Feed" },
  { id: "DON-004", foodName: "Paneer & Dairy Mix", category: "Dairy Products", condition: "Good", donor: "City Hotel Group", donorType: "Hotel", qty: 15, unit: "kg", location: "Trivandrum, Kerala", createdAt: "2026-11-22", expiryDate: "2026-11-23", status: "Pending", disposalPref: "Composting" },
  { id: "DON-005", foodName: "Biryani (Event Surplus)", category: "Cooked Meals", condition: "Fresh", donor: "Wedding Palace", donorType: "Events", qty: 80, unit: "kg", location: "Kottayam, Kerala", createdAt: "2026-11-22", expiryDate: "2026-11-22", status: "Rejected", disposalPref: "NGO Distribution" },
  { id: "DON-006", foodName: "Whole Wheat Rolls", category: "Bakery & Bread", condition: "Good", donor: "Artisan Bakers Co.", donorType: "Bakery", qty: 60, unit: "pcs", location: "Kozhikode, Kerala", createdAt: "2026-11-23", expiryDate: "2026-11-24", status: "Approved", disposalPref: "NGO Distribution" },
  { id: "DON-007", foodName: "Leafy Vegetables", category: "Fruits & Vegetables", condition: "Fresh", donor: "Green Farm Exports", donorType: "Farm", qty: 25, unit: "kg", location: "Palakkad, Kerala", createdAt: "2026-11-23", expiryDate: "2026-11-26", status: "Pending", disposalPref: "NGO Distribution" },
  { id: "DON-008", foodName: "Pastries & Muffins", category: "Bakery & Bread", condition: "Good", donor: "Café Delight", donorType: "Restaurant", qty: 45, unit: "pcs", location: "Kochi, Kerala", createdAt: "2026-11-24", expiryDate: "2026-11-25", status: "Completed", disposalPref: "NGO Distribution" },
  { id: "DON-009", foodName: "Idli & Sambar", category: "Cooked Meals", condition: "Fresh", donor: "Hotel Saravana Bhavan", donorType: "Hotel", qty: 40, unit: "kg", location: "Ernakulam, Kerala", createdAt: "2026-11-24", expiryDate: "2026-11-24", status: "Approved", disposalPref: "NGO Distribution" },
  { id: "DON-010", foodName: "Yogurt & Buttermilk", category: "Dairy Products", condition: "Good", donor: "Milky Way Dairy", donorType: "Retail", qty: 30, unit: "litres", location: "Thrissur, Kerala", createdAt: "2026-11-25", expiryDate: "2026-11-27", status: "Pending", disposalPref: "Animal Feed" },
  { id: "DON-011", foodName: "Leftover Snacks", category: "Other", condition: "Acceptable", donor: "Corporate Canteen Hub", donorType: "Corporate", qty: 10, unit: "kg", location: "Kochi, Kerala", createdAt: "2026-11-25", expiryDate: "2026-11-26", status: "Pending", disposalPref: "Composting" },
  { id: "DON-012", foodName: "Fruit Salad", category: "Fruits & Vegetables", condition: "Fresh", donor: "Juice Junction", donorType: "Restaurant", qty: 12, unit: "kg", location: "Kozhikode, Kerala", createdAt: "2026-11-25", expiryDate: "2026-11-26", status: "Approved", disposalPref: "NGO Distribution" },
  { id: "DON-013", foodName: "Rice & Dal", category: "Cooked Meals", condition: "Fresh", donor: "Community Kitchen", donorType: "NGO Kitchen", qty: 70, unit: "kg", location: "Kannur, Kerala", createdAt: "2026-11-26", expiryDate: "2026-11-26", status: "Completed", disposalPref: "NGO Distribution" },
  { id: "DON-014", foodName: "Cheese Blocks", category: "Dairy Products", condition: "Good", donor: "City Hotel Group", donorType: "Hotel", qty: 8, unit: "kg", location: "Trivandrum, Kerala", createdAt: "2026-11-26", expiryDate: "2026-11-30", status: "Pending", disposalPref: "NGO Distribution" },
  { id: "DON-015", foodName: "Seasonal Vegetables", category: "Fruits & Vegetables", condition: "Fresh", donor: "FreshMart Supermarket", donorType: "Retail", qty: 35, unit: "kg", location: "Ernakulam, Kerala", createdAt: "2026-11-26", expiryDate: "2026-11-29", status: "Pending", disposalPref: "Animal Feed" },
];

const PAGE_SIZE = 8;
const STATUS_COLORS = {
  Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Approved: "bg-green-100 text-green-700 border-green-200",
  Rejected: "bg-red-100 text-red-700 border-red-200",
  Completed: "bg-blue-100 text-blue-700 border-blue-200",
};

export default function AdminDonations() {
  const [donations, setDonations] = useState(INITIAL_DONATIONS);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);
  const [viewItem, setViewItem] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "success" });

  const showToast = (message, type = "success") => setToast({ message, type });
  const closeToast = () => setToast({ message: "" });

  /* ── Filters ── */
  const categories = ["All", ...new Set(INITIAL_DONATIONS.map((d) => d.category))];
  const statuses = ["All", "Pending", "Approved", "Rejected", "Completed"];
  const donorTypes = ["All", ...new Set(INITIAL_DONATIONS.map((d) => d.donorType))];

  const filtered = useMemo(() => {
    return donations.filter((d) => {
      const q = search.toLowerCase();
      const matchSearch = !q || d.foodName.toLowerCase().includes(q) || d.donor.toLowerCase().includes(q) || d.id.toLowerCase().includes(q);
      const matchCat = catFilter === "All" || d.category === catFilter;
      const matchStatus = statusFilter === "All" || d.status === statusFilter;
      const matchType = typeFilter === "All" || d.donorType === typeFilter;
      return matchSearch && matchCat && matchStatus && matchType;
    });
  }, [donations, search, catFilter, statusFilter, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const updateStatus = (ids, newStatus) => {
    setDonations((prev) => prev.map((d) => (ids.includes(d.id) ? { ...d, status: newStatus } : d)));
    setSelected([]);
    showToast(`${ids.length} donation(s) marked as ${newStatus}.`, "success");
  };

  const toggleSelect = (id) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const toggleSelectAll = () =>
    setSelected((prev) => (prev.length === paged.length ? [] : paged.map((d) => d.id)));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Toast message={toast.message} type={toast.type} onClose={closeToast} />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Donation Management</h1>
          <p className="text-gray-500 text-sm mt-0.5">Review, approve, and manage all food donations</p>
        </div>
        <button
          onClick={() => showToast("Export functionality coming soon", "info")}
          className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold transition-colors"
        >
          <FontAwesomeIcon icon={faDownload} />
          Export
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by food, donor, ID…"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <FontAwesomeIcon icon={faFilter} className="text-gray-400" />
          {[
            { label: "Category", val: catFilter, set: setCatFilter, opts: categories },
            { label: "Status", val: statusFilter, set: setStatusFilter, opts: statuses },
            { label: "Donor Type", val: typeFilter, set: setTypeFilter, opts: donorTypes },
          ].map(({ label, val, set, opts }) => (
            <select
              key={label}
              value={val}
              onChange={(e) => { set(e.target.value); setPage(1); }}
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 bg-white"
            >
              {opts.map((o) => <option key={o}>{o}</option>)}
            </select>
          ))}
        </div>
      </div>

      {/* Bulk actions */}
      {selected.length > 0 && (
        <div className="mb-4 flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
          <span className="text-sm font-semibold text-green-700">{selected.length} selected</span>
          <button onClick={() => updateStatus(selected, "Approved")} className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700">Bulk Approve</button>
          <button onClick={() => updateStatus(selected, "Rejected")} className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-semibold hover:bg-red-600">Bulk Reject</button>
          <button onClick={() => setSelected([])} className="ml-auto text-green-600 text-sm"><FontAwesomeIcon icon={faXmark} /></button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input type="checkbox" checked={paged.length > 0 && selected.length === paged.length} onChange={toggleSelectAll} className="rounded" />
                </th>
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Food</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Donor</th>
                <th className="px-4 py-3 text-left">Qty</th>
                <th className="px-4 py-3 text-left">Location</th>
                <th className="px-4 py-3 text-left">Expiry</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paged.length === 0 ? (
                <tr><td colSpan={10} className="text-center py-16 text-gray-400">No donations found.</td></tr>
              ) : (
                paged.map((d) => (
                  <tr key={d.id} className={`hover:bg-green-50 transition-colors ${selected.includes(d.id) ? "bg-green-50" : ""}`}>
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selected.includes(d.id)} onChange={() => toggleSelect(d.id)} className="rounded" />
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{d.id}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-800">{d.foodName}</p>
                      <p className="text-xs text-gray-400">{d.condition}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{d.category}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-700">{d.donor}</p>
                      <p className="text-xs text-gray-400">{d.donorType}</p>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-700">{d.qty} {d.unit}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{d.location}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{d.expiryDate}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${STATUS_COLORS[d.status]}`}>{d.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5 flex-wrap">
                        <button onClick={() => setViewItem(d)} className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors" title="View"><FontAwesomeIcon icon={faEye} /></button>
                        {d.status === "Pending" && (
                          <>
                            <button onClick={() => updateStatus([d.id], "Approved")} className="p-1.5 bg-green-100 hover:bg-green-200 rounded-lg text-green-700 transition-colors" title="Approve"><FontAwesomeIcon icon={faCheck} /></button>
                            <button onClick={() => updateStatus([d.id], "Rejected")} className="p-1.5 bg-red-100 hover:bg-red-200 rounded-lg text-red-700 transition-colors" title="Reject"><FontAwesomeIcon icon={faTimes} /></button>
                          </>
                        )}
                        {d.status === "Approved" && (
                          <button onClick={() => updateStatus([d.id], "Completed")} className="p-1.5 bg-blue-100 hover:bg-blue-200 rounded-lg text-blue-700 transition-colors" title="Mark Completed"><FontAwesomeIcon icon={faFlagCheckered} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-sm text-gray-500">
          Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} donations
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium disabled:opacity-40 hover:bg-gray-50"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="mr-1" /> Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-xl text-sm font-semibold ${p === page ? "bg-green-600 text-white" : "border border-gray-200 hover:bg-gray-50 text-gray-600"}`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-2 rounded-xl border border-gray-200 text-sm font-medium disabled:opacity-40 hover:bg-gray-50"
          >
            Next <FontAwesomeIcon icon={faChevronRight} className="ml-1" />
          </button>
        </div>
      </div>

      {/* Detail Modal */}
      {viewItem && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setViewItem(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{viewItem.foodName}</h2>
                <p className="text-sm text-gray-400 font-mono">{viewItem.id}</p>
              </div>
              <button onClick={() => setViewItem(null)} className="text-gray-400 hover:text-gray-700 text-xl"><FontAwesomeIcon icon={faXmark} /></button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                { icon: faBoxOpen, label: "Category", val: viewItem.category },
                { icon: faBoxOpen, label: "Condition", val: viewItem.condition },
                { icon: faUser, label: "Donor", val: viewItem.donor },
                { icon: faUser, label: "Donor Type", val: viewItem.donorType },
                { icon: faUtensils, label: "Quantity", val: `${viewItem.qty} ${viewItem.unit}` },
                { icon: faLocationDot, label: "Location", val: viewItem.location },
                { icon: faCalendar, label: "Created", val: viewItem.createdAt },
                { icon: faCalendar, label: "Expiry", val: viewItem.expiryDate },
              ].map(({ label, val, icon }) => (
                <div key={label} className="flex items-start gap-2">
                  <FontAwesomeIcon icon={icon} className="text-green-500 mt-0.5 text-xs" />
                  <div>
                    <p className="text-gray-400 text-xs">{label}</p>
                    <p className="font-semibold text-gray-700">{val}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-400">Disposal Preference</p>
              <p className="font-semibold text-gray-700">{viewItem.disposalPref}</p>
            </div>
            <div className="mt-4">
              <GenericProgressTracker stages={ADMIN_DONATION_STAGES} current={viewItem.status} />
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className={`text-sm px-3 py-1.5 rounded-full font-semibold border ${STATUS_COLORS[viewItem.status]}`}>{viewItem.status}</span>
              <div className="flex gap-2">
                {viewItem.status === "Pending" && (
                  <>
                    <button onClick={() => { updateStatus([viewItem.id], "Approved"); setViewItem(null); }} className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700">Approve</button>
                    <button onClick={() => { updateStatus([viewItem.id], "Rejected"); setViewItem(null); }} className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600">Reject</button>
                  </>
                )}
                {viewItem.status === "Approved" && (
                  <button onClick={() => { updateStatus([viewItem.id], "Completed"); setViewItem(null); }} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700">Mark Completed</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
