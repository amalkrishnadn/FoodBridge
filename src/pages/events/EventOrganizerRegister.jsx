import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Toast from "../../components/Toast";
import LocationPicker from "../../components/LocationPicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faUpload,
  faCheckCircle,
  faGlobe,
  faBuilding,
} from "@fortawesome/free-solid-svg-icons";

const ORGANIZER_TYPES = [
  "Event Management Company",
  "Wedding Planner",
  "Corporate Event Organizer",
  "NGO / Non-Profit",
  "Educational Institution",
  "Religious Organization",
  "Individual Organizer",
  "Other",
];

const inputCls =
  "w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 text-sm";

const EventOrganizerRegister = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    orgName: "",
    orgType: "",
    regNumber: "",
    officialEmail: "",
    contactNumber: "",
    orgAddress: "",
    website: "",
    previousEvents: "",
  });

  const [location, setLocation] = useState({
    address: "", state: "", district: "", city: "", pincode: "",
    lat: null, lng: null,
  });

  const [docs, setDocs] = useState({
    regCert: null,
    businessDoc: null,
    eventPhotos: null,
    permissionLetter: null,
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = (name) => (e) =>
    setDocs({ ...docs, [name]: e.target.files[0] });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!docs.regCert && !docs.businessDoc) {
      setToast({ msg: "Please upload at least one verification document.", type: "error" });
      return;
    }
    if (!location.lat) {
      setToast({ msg: "Please select your organization location on the map.", type: "error" });
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <>
        <Header />
        <section className="min-h-[70vh] bg-green-50 flex items-center justify-center px-5 py-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon icon={faCheckCircle} className="text-yellow-500 text-3xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Application Submitted</h2>
            <p className="text-gray-500 text-sm mb-4">
              Your Event Organizer verification application has been submitted. Our admin will review your documents within 3–5 business days.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-left mb-5 text-sm text-yellow-800 space-y-1">
              <p><strong>Organization:</strong> {form.orgName}</p>
              <p><strong>Type:</strong> {form.orgType}</p>
              <p><strong>Status:</strong> Verification Pending</p>
              <p><strong>Documents:</strong>{" "}
                {Object.entries(docs)
                  .filter(([, v]) => v)
                  .map(([k]) => k)
                  .join(", ") || "None"}
              </p>
            </div>
            <Link
              to="/login"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700"
            >
              Back to Login
            </Link>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  const FileInput = ({ label, name, accept = ".pdf,.jpg,.jpeg,.png" }) => (
    <div>
      <label className="block text-gray-700 font-medium mb-1 text-sm">{label}</label>
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center cursor-pointer hover:border-green-400 transition"
        onClick={() => document.getElementById(`file-${name}`).click()}
      >
        <FontAwesomeIcon icon={faUpload} className="text-gray-400 mb-1" />
        <p className="text-xs text-gray-500">
          {docs[name] ? docs[name].name : "Click to upload"}
        </p>
        <input
          id={`file-${name}`}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleFile(name)}
        />
      </div>
    </div>
  );

  return (
    <>
      <Header />
      {toast && (
        <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />
      )}
      <section className="bg-green-50 py-12 px-5">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-green-600" />
              Event Organizer Registration
            </h1>
            <p className="text-gray-500 mt-2">Submit your details for verification to access the platform.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ── Organization Details ── */}
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
              <h2 className="font-semibold text-gray-700 uppercase text-sm tracking-wide border-b pb-2 flex items-center gap-2">
                <FontAwesomeIcon icon={faBuilding} className="text-green-600" /> Organization Details
              </h2>

              <div>
                <label className="block text-gray-700 font-medium mb-1 text-sm">Organizer / Organization Name <span className="text-red-500">*</span></label>
                <input type="text" name="orgName" value={form.orgName} onChange={handleChange} required placeholder="Official name" className={inputCls} />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1 text-sm">Organizer Type <span className="text-red-500">*</span></label>
                <select name="orgType" value={form.orgType} onChange={handleChange} required className={inputCls}>
                  <option value="">Select organizer type</option>
                  {ORGANIZER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1 text-sm">Event Management Registration Number (if applicable)</label>
                <input type="text" name="regNumber" value={form.regNumber} onChange={handleChange} placeholder="Registration number" className={inputCls} />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1 text-sm">Official Email <span className="text-red-500">*</span></label>
                <input type="email" name="officialEmail" value={form.officialEmail} onChange={handleChange} required placeholder="official@organization.com" className={inputCls} />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1 text-sm">Contact Number <span className="text-red-500">*</span></label>
                <input type="tel" name="contactNumber" value={form.contactNumber} onChange={handleChange} required placeholder="+91 00000 00000" className={inputCls} />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1 text-sm">Organization Address <span className="text-red-500">*</span></label>
                <textarea name="orgAddress" value={form.orgAddress} onChange={handleChange} rows={2} required placeholder="Full registered address" className={inputCls} />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1 text-sm flex items-center gap-1">
                  <FontAwesomeIcon icon={faGlobe} className="text-green-500" /> Website or Social Media Page
                </label>
                <input type="text" name="website" value={form.website} onChange={handleChange} placeholder="https:// or @handle" className={inputCls} />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1 text-sm">Previous Event Details</label>
                <textarea name="previousEvents" value={form.previousEvents} onChange={handleChange} rows={3} placeholder="Briefly describe 2–3 past events you organized…" className={inputCls} />
              </div>
            </div>

            {/* ── Documents ── */}
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
              <h2 className="font-semibold text-gray-700 uppercase text-sm tracking-wide border-b pb-2">
                Supporting Documents
              </h2>
              <p className="text-xs text-gray-500">Upload at least one document to verify your organization.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FileInput label="Organization Registration Certificate" name="regCert" />
                <FileInput label="Business Registration Document" name="businessDoc" />
                <FileInput label="Previous Event Photographs" name="eventPhotos" accept=".jpg,.jpeg,.png" />
                <FileInput label="Event Permission Letter" name="permissionLetter" />
              </div>
            </div>

            {/* ── Location ── */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-semibold text-gray-700 uppercase text-sm tracking-wide border-b pb-2 mb-4">
                Organization Location
              </h2>
              <LocationPicker value={location} onChange={setLocation} />
            </div>

            <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition">
              Submit for Verification
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default EventOrganizerRegister;
