import React, { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faFilter,
  faEye,
  faBan,
  faCheckCircle,
  faTrash,
  faXmark,
  faUser,
  faEnvelope,
  faCalendar,
  faShieldAlt,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import Toast from "../../components/Toast";

/* ─── Role config ─────────────────────────────────── */
const ROLE_STYLES = {
  donor: "bg-green-100 text-green-700 border-green-200",
  ngo: "bg-blue-100 text-blue-700 border-blue-200",
  volunteer: "bg-purple-100 text-purple-700 border-purple-200",
  events: "bg-orange-100 text-orange-700 border-orange-200",
  animalFeed: "bg-amber-100 text-amber-700 border-amber-200",
  recovery: "bg-teal-100 text-teal-700 border-teal-200",
  admin: "bg-red-100 text-red-700 border-red-200",
};

const ALL_ROLES = ["donor", "ngo", "volunteer", "events", "animalFeed", "recovery", "admin"];

const VERIFY_STYLES = {
  Verified: "bg-green-100 text-green-700 border-green-200",
  Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Rejected: "bg-red-100 text-red-700 border-red-200",
  "Not Required": "bg-gray-100 text-gray-500 border-gray-200",
};

/* ─── Sample Data ─────────────────────────────────── */
const INITIAL_USERS = [
  { id: "USR-001", name: "Arjun Nair", email: "arjun.nair@email.com", role: "donor", verificationStatus: "Verified", joinedDate: "2026-01-15", lastActive: "2026-11-25", donationCount: 48, requestCount: 0, status: "Active" },
  { id: "USR-002", name: "Hope Foundation", email: "admin@hopefoundation.org", role: "ngo", verificationStatus: "Verified", joinedDate: "2026-02-10", lastActive: "2026-11-26", donationCount: 0, requestCount: 76, status: "Active" },
  { id: "USR-003", name: "Riya Menon", email: "riya.menon@gmail.com", role: "volunteer", verificationStatus: "Not Required", joinedDate: "2026-03-05", lastActive: "2026-11-24", donationCount: 0, requestCount: 0, status: "Active" },
  { id: "USR-004", name: "Wedding Palace Events", email: "events@weddingpalace.in", role: "events", verificationStatus: "Verified", joinedDate: "2026-03-20", lastActive: "2026-11-22", donationCount: 24, requestCount: 0, status: "Active" },
  { id: "USR-005", name: "Kerala Animal Welfare", email: "info@kaw.org", role: "animalFeed", verificationStatus: "Pending", joinedDate: "2026-04-01", lastActive: "2026-11-20", donationCount: 0, requestCount: 15, status: "Active" },
  { id: "USR-006", name: "EcoRecovery Hub", email: "contact@ecorecovery.in", role: "recovery", verificationStatus: "Verified", joinedDate: "2026-04-15", lastActive: "2026-11-25", donationCount: 0, requestCount: 30, status: "Active" },
  { id: "USR-007", name: "Priya Suresh", email: "priya.suresh@foodbridge.com", role: "admin", verificationStatus: "Not Required", joinedDate: "2026-01-01", lastActive: "2026-11-26", donationCount: 0, requestCount: 0, status: "Active" },
  { id: "USR-008", name: "FreshMart Supermarket", email: "csr@freshmart.com", role: "donor", verificationStatus: "Verified", joinedDate: "2026-05-12", lastActive: "2026-11-23", donationCount: 34, requestCount: 0, status: "Active" },
  { id: "USR-009", name: "Bright Futures NGO", email: "info@brightfutures.org", role: "ngo", verificationStatus: "Verified", joinedDate: "2026-05-28", lastActive: "2026-11-26", donationCount: 0, requestCount: 64, status: "Active" },
  { id: "USR-010", name: "Suresh Kumar", email: "suresh.vol@gmail.com", role: "volunteer", verificationStatus: "Not Required", joinedDate: "2026-06-10", lastActive: "2026-11-21", donationCount: 0, requestCount: 0, status: "Suspended" },
  { id: "USR-011", name: "Sunrise Bakery", email: "owner@sunrisebakery.com", role: "donor", verificationStatus: "Verified", joinedDate: "2026-06-22", lastActive: "2026-11-25", donationCount: 27, requestCount: 0, status: "Active" },
  { id: "USR-012", name: "CityFest Organizers", email: "admin@cityfest.in", role: "events", verificationStatus: "Rejected", joinedDate: "2026-07-14", lastActive: "2026-10-30", donationCount: 5, requestCount: 0, status: "Suspended" },
  { id: "USR-013", name: "PetCare Animal Shelter", email: "shelter@petcare.org", role: "animalFeed", verificationStatus: "Verified", joinedDate: "2026-07-30", lastActive: "2026-11-24", donationCount: 0, requestCount: 22, status: "Active" },
  { id: "USR-014", name: "GreenWaste Solutions", email: "ops@greenwaste.in", role: "recovery", verificationStatus: "Pending", joinedDate: "2026-08-18", lastActive: "2026-11-19", donationCount: 0, requestCount: 18, status: "Active" },
  { id: "USR-015", name: "Ananya Krishnan", email: "ananya.k@email.com", role: "donor", verificationStatus: "Verified", joinedDate: "2026-09-05", lastActive: "2026-11-26", donationCount: 12, requestCount: 0, status: "Active" },
];

export default function AdminUsers() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [verifyFilter, setVerifyFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewUser, setViewUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editRole, setEditRole] = useState("");
  const [toast, setToast] = useState({ message: "", type: "success" });

  const showToast = (message, type = "success") => setToast({ message, type });
  const closeToast = () => setToast({ message: "" });

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter((u) => {
      const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.id.toLowerCase().includes(q);
      const matchRole = roleFilter === "All" || u.role === roleFilter;
      const matchVerify = verifyFilter === "All" || u.verificationStatus === verifyFilter;
      const matchStatus = statusFilter === "All" || u.status === statusFilter;
      return matchSearch && matchRole && matchVerify && matchStatus;
    });
  }, [users, search, roleFilter, verifyFilter, statusFilter]);

  const toggleStatus = (id) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== id) return u;
        const next = u.status === "Active" ? "Suspended" : "Active";
        showToast(`User ${next === "Suspended" ? "suspended" : "activated"} successfully.`, next === "Suspended" ? "error" : "success");
        return { ...u, status: next };
      })
    );
  };

  const changeRole = (id, role) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    showToast(`Role updated to "${role}".`, "success");
  };

  const deleteUser = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setDeleteConfirm(null);
    setViewUser(null);
    showToast("User deleted successfully.", "error");
  };

  const openView = (u) => { setViewUser(u); setEditRole(u.role); };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Toast message={toast.message} type={toast.type} onClose={closeToast} />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <p className="text-gray-500 text-sm mt-0.5">Manage user accounts, roles, and verification</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, ID…"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <FontAwesomeIcon icon={faFilter} className="text-gray-400" />
          {[
            { label: "Role", val: roleFilter, set: setRoleFilter, opts: ["All", ...ALL_ROLES] },
            { label: "Verification", val: verifyFilter, set: setVerifyFilter, opts: ["All", "Verified", "Pending", "Rejected", "Not Required"] },
            { label: "Status", val: statusFilter, set: setStatusFilter, opts: ["All", "Active", "Suspended"] },
          ].map(({ label, val, set, opts }) => (
            <select key={label} value={val} onChange={(e) => set(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 bg-white">
              {opts.map((o) => <option key={o}>{o}</option>)}
            </select>
          ))}
        </div>
        <span className="text-xs text-gray-400 ml-auto">{filtered.length} users</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Verification</th>
                <th className="px-4 py-3 text-left">Activity</th>
                <th className="px-4 py-3 text-left">Joined</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-16 text-gray-400">No users found.</td></tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-green-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {u.name[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{u.name}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border capitalize ${ROLE_STYLES[u.role]}`}>{u.role}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${VERIFY_STYLES[u.verificationStatus]}`}>{u.verificationStatus}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {u.donationCount > 0 && <p>{u.donationCount} donations</p>}
                      {u.requestCount > 0 && <p>{u.requestCount} requests</p>}
                      {u.donationCount === 0 && u.requestCount === 0 && <p>—</p>}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{u.joinedDate}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${u.status === "Active" ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200"}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button onClick={() => openView(u)} className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600" title="View Profile"><FontAwesomeIcon icon={faEye} /></button>
                        <button onClick={() => toggleStatus(u.id)} className={`p-1.5 rounded-lg transition-colors ${u.status === "Active" ? "bg-red-100 hover:bg-red-200 text-red-600" : "bg-green-100 hover:bg-green-200 text-green-600"}`} title={u.status === "Active" ? "Suspend" : "Activate"}>
                          <FontAwesomeIcon icon={u.status === "Active" ? faBan : faCheckCircle} />
                        </button>
                        <button onClick={() => setDeleteConfirm(u)} className="p-1.5 bg-red-50 hover:bg-red-100 rounded-lg text-red-500" title="Delete"><FontAwesomeIcon icon={faTrash} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Profile Modal */}
      {viewUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setViewUser(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-800">User Profile</h2>
              <button onClick={() => setViewUser(null)} className="text-gray-400 hover:text-gray-700 text-xl"><FontAwesomeIcon icon={faXmark} /></button>
            </div>

            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold text-2xl">
                {viewUser.name[0]}
              </div>
              <div>
                <p className="text-xl font-bold text-gray-800">{viewUser.name}</p>
                <p className="text-sm text-gray-400">{viewUser.id}</p>
              </div>
            </div>

            <div className="space-y-3 text-sm mb-5">
              {[
                { icon: faEnvelope, label: "Email", val: viewUser.email },
                { icon: faCalendar, label: "Joined", val: viewUser.joinedDate },
                { icon: faCalendar, label: "Last Active", val: viewUser.lastActive },
                { icon: faShieldAlt, label: "Verification", val: viewUser.verificationStatus },
              ].map(({ icon, label, val }) => (
                <div key={label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <FontAwesomeIcon icon={icon} className="text-green-500 w-4" />
                  <span className="text-gray-500 w-24 flex-shrink-0">{label}</span>
                  <span className="font-semibold text-gray-700">{val}</span>
                </div>
              ))}
            </div>

            {/* Change Role */}
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <FontAwesomeIcon icon={faUser} className="text-green-500" /> Change Role
              </label>
              <div className="relative">
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 bg-white appearance-none capitalize"
                >
                  {ALL_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
                <FontAwesomeIcon icon={faChevronDown} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
              </div>
              {editRole !== viewUser.role && (
                <button
                  onClick={() => { changeRole(viewUser.id, editRole); setViewUser((u) => ({ ...u, role: editRole })); }}
                  className="mt-2 w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold transition-colors"
                >
                  Save Role Change
                </button>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { toggleStatus(viewUser.id); setViewUser(null); }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${viewUser.status === "Active" ? "bg-red-500 hover:bg-red-600 text-white" : "bg-green-600 hover:bg-green-700 text-white"}`}
              >
                <FontAwesomeIcon icon={viewUser.status === "Active" ? faBan : faCheckCircle} className="mr-2" />
                {viewUser.status === "Active" ? "Suspend" : "Activate"}
              </button>
              <button onClick={() => { setViewUser(null); setDeleteConfirm(viewUser); }} className="flex-1 py-2.5 rounded-xl bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors">
                <FontAwesomeIcon icon={faTrash} className="mr-2" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon icon={faTrash} className="text-red-500 text-2xl" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Delete User?</h3>
            <p className="text-sm text-gray-500 mb-6">Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={() => deleteUser(deleteConfirm.id)} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
