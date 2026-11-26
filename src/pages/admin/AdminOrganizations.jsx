import React, { useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faFilter,
  faEye,
  faCheck,
  faTimes,
  faEdit,
  faTrash,
  faXmark,
  faBuilding,
  faPhone,
  faEnvelope,
  faLocationDot,
  faCalendar,
  faIdCard,
  faUsers,
  faFileAlt,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import Toast from "../../components/Toast";
import VerificationBadge from "../../components/VerificationBadge";

/* ─── Sample Data ─────────────────────────────────── */
const ORG_TYPES = ["NGO", "Events", "Recovery Facility", "Animal Feed Handler"];

const INITIAL_ORGS = [
  { id: "ORG-001", name: "Hope Foundation", type: "NGO", registrationNo: "NGO-KL-2019-001", email: "admin@hopefoundation.org", phone: "+91 9876543210", location: "Ernakulam, Kerala", verificationStatus: "Verified", membersCount: 24, totalDonations: 76, joinedDate: "2026-02-10" },
  { id: "ORG-002", name: "Wedding Palace Events", type: "Events", registrationNo: "EVT-KL-2021-045", email: "events@weddingpalace.in", phone: "+91 9988776655", location: "Kochi, Kerala", verificationStatus: "Verified", membersCount: 8, totalDonations: 24, joinedDate: "2026-03-20" },
  { id: "ORG-003", name: "EcoRecovery Hub", type: "Recovery Facility", registrationNo: "REC-KL-2022-012", email: "contact@ecorecovery.in", phone: "+91 9112233445", location: "Thrissur, Kerala", verificationStatus: "Verified", membersCount: 15, totalDonations: 30, joinedDate: "2026-04-15" },
  { id: "ORG-004", name: "Kerala Animal Welfare", type: "Animal Feed Handler", registrationNo: "AFH-KL-2023-003", email: "info@kaw.org", phone: "+91 9000112233", location: "Kozhikode, Kerala", verificationStatus: "Verification Pending", membersCount: 10, totalDonations: 15, joinedDate: "2026-04-01" },
  { id: "ORG-005", name: "Bright Futures NGO", type: "NGO", registrationNo: "NGO-KL-2020-034", email: "info@brightfutures.org", phone: "+91 9123456789", location: "Trivandrum, Kerala", verificationStatus: "Verified", membersCount: 32, totalDonations: 64, joinedDate: "2026-05-28" },
  { id: "ORG-006", name: "CityFest Organizers", type: "Events", registrationNo: "EVT-KL-2022-089", email: "admin@cityfest.in", phone: "+91 9988001122", location: "Palakkad, Kerala", verificationStatus: "Rejected", membersCount: 5, totalDonations: 5, joinedDate: "2026-07-14" },
  { id: "ORG-007", name: "GreenWaste Solutions", type: "Recovery Facility", registrationNo: "REC-KL-2023-028", email: "ops@greenwaste.in", phone: "+91 9876001234", location: "Kottayam, Kerala", verificationStatus: "Verification Pending", membersCount: 12, totalDonations: 18, joinedDate: "2026-08-18" },
  { id: "ORG-008", name: "PetCare Animal Shelter", type: "Animal Feed Handler", registrationNo: "AFH-KL-2022-011", email: "shelter@petcare.org", phone: "+91 9871234560", location: "Ernakulam, Kerala", verificationStatus: "Verified", membersCount: 7, totalDonations: 22, joinedDate: "2026-07-30" },
  { id: "ORG-009", name: "City Care Trust", type: "NGO", registrationNo: "NGO-KL-2018-007", email: "trust@citycare.org", phone: "+91 9000998877", location: "Kochi, Kerala", verificationStatus: "Verified", membersCount: 40, totalDonations: 58, joinedDate: "2026-01-25" },
  { id: "ORG-010", name: "Nourish Kerala", type: "NGO", registrationNo: "NGO-KL-2021-056", email: "info@nourishkerala.org", phone: "+91 9999001234", location: "Kannur, Kerala", verificationStatus: "Verified", membersCount: 18, totalDonations: 47, joinedDate: "2026-06-05" },
  { id: "ORG-011", name: "FoodFest Events", type: "Events", registrationNo: "EVT-KL-2023-102", email: "hello@foodfest.in", phone: "+91 9871112233", location: "Thrissur, Kerala", verificationStatus: "Verification Pending", membersCount: 6, totalDonations: 8, joinedDate: "2026-09-14" },
  { id: "ORG-012", name: "BioGas Kerala", type: "Recovery Facility", registrationNo: "REC-KL-2022-055", email: "admin@biogaskerala.in", phone: "+91 9123009988", location: "Ernakulam, Kerala", verificationStatus: "Verified", membersCount: 20, totalDonations: 40, joinedDate: "2026-05-01" },
];

const TYPE_COLORS = {
  "NGO": "bg-blue-100 text-blue-700 border-blue-200",
  "Events": "bg-orange-100 text-orange-700 border-orange-200",
  "Recovery Facility": "bg-teal-100 text-teal-700 border-teal-200",
  "Animal Feed Handler": "bg-amber-100 text-amber-700 border-amber-200",
};

const SAMPLE_DOCS = [
  { name: "Registration Certificate.pdf", size: "1.2 MB" },
  { name: "Tax Exemption Letter.pdf", size: "845 KB" },
  { name: "Organization Profile.pdf", size: "2.1 MB" },
];

export default function AdminOrganizations() {
  const [orgs, setOrgs] = useState(INITIAL_ORGS);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [verifyFilter, setVerifyFilter] = useState("All");
  const [viewOrg, setViewOrg] = useState(null);
  const [editOrg, setEditOrg] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "success" });

  const showToast = (message, type = "success") => setToast({ message, type });
  const closeToast = () => setToast({ message: "" });

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return orgs.filter((o) => {
      const matchSearch = !q || o.name.toLowerCase().includes(q) || o.email.toLowerCase().includes(q) || o.registrationNo.toLowerCase().includes(q);
      const matchType = typeFilter === "All" || o.type === typeFilter;
      const matchVerify = verifyFilter === "All" || o.verificationStatus === verifyFilter;
      return matchSearch && matchType && matchVerify;
    });
  }, [orgs, search, typeFilter, verifyFilter]);

  const updateVerification = (id, status) => {
    setOrgs((prev) => prev.map((o) => (o.id === id ? { ...o, verificationStatus: status } : o)));
    showToast(`Organization ${status.toLowerCase()}.`, status === "Verified" ? "success" : "error");
    setViewOrg(null);
  };

  const saveEdit = () => {
    setOrgs((prev) => prev.map((o) => (o.id === editOrg.id ? { ...editOrg } : o)));
    showToast("Organization details updated.", "success");
    setEditOrg(null);
  };

  const deleteOrg = (id) => {
    setOrgs((prev) => prev.filter((o) => o.id !== id));
    setDeleteConfirm(null);
    setViewOrg(null);
    showToast("Organization deleted.", "error");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Toast message={toast.message} type={toast.type} onClose={closeToast} />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Organization Management</h1>
        <p className="text-gray-500 text-sm mt-0.5">Manage NGOs, event organizers, recovery facilities, and animal feed handlers</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search organization, email, reg no…"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <FontAwesomeIcon icon={faFilter} className="text-gray-400" />
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 bg-white">
            {["All", ...ORG_TYPES].map((t) => <option key={t}>{t}</option>)}
          </select>
          <select value={verifyFilter} onChange={(e) => setVerifyFilter(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 bg-white">
            {["All", "Verified", "Verification Pending", "Rejected", "Not Verified"].map((v) => <option key={v}>{v}</option>)}
          </select>
        </div>
        <span className="text-xs text-gray-400 ml-auto">{filtered.length} organizations</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Organization</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Reg. No.</th>
                <th className="px-4 py-3 text-left">Location</th>
                <th className="px-4 py-3 text-left">Members</th>
                <th className="px-4 py-3 text-left">Donations</th>
                <th className="px-4 py-3 text-left">Verification</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-16 text-gray-400">No organizations found.</td></tr>
              ) : (
                filtered.map((o) => (
                  <tr key={o.id} className="hover:bg-green-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                          <FontAwesomeIcon icon={faBuilding} className="text-green-600 text-sm" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{o.name}</p>
                          <p className="text-xs text-gray-400">{o.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${TYPE_COLORS[o.type]}`}>{o.type}</span>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-gray-500">{o.registrationNo}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{o.location}</td>
                    <td className="px-4 py-3 text-center font-semibold text-gray-700">{o.membersCount}</td>
                    <td className="px-4 py-3 text-center font-semibold text-green-700">{o.totalDonations}</td>
                    <td className="px-4 py-3"><VerificationBadge status={o.verificationStatus} /></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button onClick={() => setViewOrg(o)} className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600" title="View"><FontAwesomeIcon icon={faEye} /></button>
                        <button onClick={() => setEditOrg({ ...o })} className="p-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-600" title="Edit"><FontAwesomeIcon icon={faEdit} /></button>
                        {o.verificationStatus === "Verification Pending" && (
                          <>
                            <button onClick={() => updateVerification(o.id, "Verified")} className="p-1.5 bg-green-100 hover:bg-green-200 rounded-lg text-green-700" title="Approve"><FontAwesomeIcon icon={faCheck} /></button>
                            <button onClick={() => updateVerification(o.id, "Rejected")} className="p-1.5 bg-red-100 hover:bg-red-200 rounded-lg text-red-700" title="Reject"><FontAwesomeIcon icon={faTimes} /></button>
                          </>
                        )}
                        <button onClick={() => setDeleteConfirm(o)} className="p-1.5 bg-red-50 hover:bg-red-100 rounded-lg text-red-500" title="Delete"><FontAwesomeIcon icon={faTrash} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {viewOrg && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setViewOrg(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{viewOrg.name}</h2>
                <p className="text-xs text-gray-400 font-mono">{viewOrg.id}</p>
              </div>
              <button onClick={() => setViewOrg(null)} className="text-gray-400 hover:text-gray-700 text-xl"><FontAwesomeIcon icon={faXmark} /></button>
            </div>

            <div className="flex items-center gap-3 mb-5">
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${TYPE_COLORS[viewOrg.type]}`}>{viewOrg.type}</span>
              <VerificationBadge status={viewOrg.verificationStatus} />
            </div>

            <div className="grid grid-cols-1 gap-3 text-sm mb-5">
              {[
                { icon: faIdCard, label: "Reg. No.", val: viewOrg.registrationNo },
                { icon: faEnvelope, label: "Email", val: viewOrg.email },
                { icon: faPhone, label: "Phone", val: viewOrg.phone },
                { icon: faLocationDot, label: "Location", val: viewOrg.location },
                { icon: faUsers, label: "Members", val: viewOrg.membersCount },
                { icon: faCalendar, label: "Joined", val: viewOrg.joinedDate },
              ].map(({ icon, label, val }) => (
                <div key={label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <FontAwesomeIcon icon={icon} className="text-green-500 w-4" />
                  <span className="text-gray-500 w-24 flex-shrink-0">{label}</span>
                  <span className="font-semibold text-gray-700">{val}</span>
                </div>
              ))}
            </div>

            {/* Documents */}
            <div className="mb-5">
              <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                <FontAwesomeIcon icon={faFileAlt} className="text-green-500" /> Submitted Documents
              </h3>
              <div className="space-y-2">
                {SAMPLE_DOCS.map((doc) => (
                  <div key={doc.name} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl bg-gray-50">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faFileAlt} className="text-blue-400" />
                      <span className="text-sm text-gray-700">{doc.name}</span>
                    </div>
                    <span className="text-xs text-gray-400">{doc.size}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            {viewOrg.verificationStatus === "Verification Pending" && (
              <div className="flex gap-3">
                <button onClick={() => updateVerification(viewOrg.id, "Verified")} className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold">
                  <FontAwesomeIcon icon={faCheck} className="mr-2" /> Approve Verification
                </button>
                <button onClick={() => updateVerification(viewOrg.id, "Rejected")} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold">
                  <FontAwesomeIcon icon={faTimes} className="mr-2" /> Reject
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editOrg && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setEditOrg(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-800">Edit Organization</h2>
              <button onClick={() => setEditOrg(null)} className="text-gray-400 hover:text-gray-700 text-xl"><FontAwesomeIcon icon={faXmark} /></button>
            </div>

            <div className="space-y-4 text-sm">
              {[
                { label: "Name", key: "name", type: "text" },
                { label: "Email", key: "email", type: "email" },
                { label: "Phone", key: "phone", type: "text" },
                { label: "Location", key: "location", type: "text" },
                { label: "Registration No.", key: "registrationNo", type: "text" },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
                  <input
                    type={type}
                    value={editOrg[key]}
                    onChange={(e) => setEditOrg((prev) => ({ ...prev, [key]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Type</label>
                <select
                  value={editOrg.type}
                  onChange={(e) => setEditOrg((prev) => ({ ...prev, type: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-300 bg-white"
                >
                  {ORG_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditOrg(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={saveEdit} className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold">
                <FontAwesomeIcon icon={faSave} className="mr-2" /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon icon={faTrash} className="text-red-500 text-2xl" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Organization?</h3>
            <p className="text-sm text-gray-500 mb-6">Are you sure you want to remove <strong>{deleteConfirm.name}</strong>? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={() => deleteOrg(deleteConfirm.id)} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
