import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Toast from "../../components/Toast";
import LocationPicker from "../../components/LocationPicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLeaf,
  faUpload,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

/* Demo valid NGO codes */
const VALID_NGO_CODES = ["NGO-FB-2026-001", "NGO-FB-2026-002", "NGO-FB-2026-003"];

const inputCls =
  "w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 text-sm";

const NgoRegister = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const [step, setStep] = useState(1); // 1 = details, 2 = verify code, 3 = pending
  const [certFile, setCertFile] = useState(null);
  const [codeInput, setCodeInput] = useState("");
  const [codeError, setCodeError] = useState("");
  const [codeValid, setCodeValid] = useState(false);

  const [form, setForm] = useState({
    ngoName: "", regNumber: "", officialEmail: "", contactNumber: "",
    address: "", website: "",
  });
  const [location, setLocation] = useState({
    address: "", state: "", district: "", city: "", pincode: "",
    lat: null, lng: null,
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleStep1 = (e) => {
    e.preventDefault();
    if (!certFile) {
      setToast({ msg: "Please upload the registration certificate.", type: "error" });
      return;
    }
    if (!location.lat) {
      setToast({ msg: "Please select a location on the map.", type: "error" });
      return;
    }
    setStep(2);
  };

  const verifyCode = () => {
    setCodeError("");
    if (VALID_NGO_CODES.includes(codeInput.trim().toUpperCase())) {
      setCodeValid(true);
      setToast({ msg: "Verification code accepted!", type: "success" });
    } else {
      setCodeError("Invalid code. Please use one of the demo codes shown below.");
    }
  };

  const handleSubmit = () => {
    if (!codeValid) {
      setToast({ msg: "Please verify the NGO code first.", type: "error" });
      return;
    }
    setStep(3);
  };

  if (step === 3) {
    return (
      <>
        <Header />
        <section className="min-h-[70vh] bg-green-50 flex items-center justify-center px-5 py-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon icon={faCheckCircle} className="text-yellow-500 text-3xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Application Submitted</h2>
            <p className="text-gray-500 mb-4">
              Your NGO registration is under review. You will be notified once verified.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-left mb-5">
              <p className="text-sm font-semibold text-yellow-800">Verification Pending</p>
              <p className="text-xs text-yellow-700 mt-1">
                Our admin team will review your documents within 2–3 business days.
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

  return (
    <>
      <Header />
      {toast && (
        <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />
      )}
      <section className="bg-green-50 py-12 px-5">
        <div className="max-w-2xl mx-auto">
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8">
            {["NGO Details", "Verification Code"].map((label, i) => (
              <React.Fragment key={label}>
                <div className={`flex items-center gap-1.5 text-sm font-semibold ${step === i + 1 ? "text-green-600" : "text-gray-400"}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === i + 1 ? "bg-green-600 text-white" : "bg-gray-200 text-gray-500"}`}>{i + 1}</span>
                  {label}
                </div>
                {i < 1 && <div className="flex-1 h-px bg-gray-300" />}
              </React.Fragment>
            ))}
          </div>

          {step === 1 && (
            <form onSubmit={handleStep1} className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
                <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                  <FontAwesomeIcon icon={faLeaf} className="text-green-600" /> NGO Registration
                </h2>

                <div>
                  <label className="block text-gray-700 font-medium mb-1 text-sm">NGO Name <span className="text-red-500">*</span></label>
                  <input type="text" name="ngoName" value={form.ngoName} onChange={handleChange} required placeholder="Official NGO name" className={inputCls} />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1 text-sm">Registration Number <span className="text-red-500">*</span></label>
                  <input type="text" name="regNumber" value={form.regNumber} onChange={handleChange} required placeholder="e.g., NGO/REG/2024/001" className={inputCls} />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1 text-sm">Registration Certificate <span className="text-red-500">*</span></label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-green-400 transition" onClick={() => document.getElementById("ngoCert").click()}>
                    <FontAwesomeIcon icon={faUpload} className="text-gray-400 text-2xl mb-1" />
                    <p className="text-sm text-gray-500">
                      {certFile ? certFile.name : "Click to upload PDF or image"}
                    </p>
                    <input id="ngoCert" type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => setCertFile(e.target.files[0])} />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1 text-sm">Official Email <span className="text-red-500">*</span></label>
                  <input type="email" name="officialEmail" value={form.officialEmail} onChange={handleChange} required placeholder="ngo@example.org" className={inputCls} />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1 text-sm">Contact Number <span className="text-red-500">*</span></label>
                  <input type="tel" name="contactNumber" value={form.contactNumber} onChange={handleChange} required placeholder="+91 00000 00000" className={inputCls} />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1 text-sm">Address <span className="text-red-500">*</span></label>
                  <textarea name="address" value={form.address} onChange={handleChange} rows={2} required placeholder="Full registered address" className={inputCls} />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1 text-sm">Website (Optional)</label>
                  <input type="url" name="website" value={form.website} onChange={handleChange} placeholder="https://yourngo.org" className={inputCls} />
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-700 mb-4">NGO Location</h3>
                <LocationPicker value={location} onChange={setLocation} />
              </div>

              <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition">
                Continue to Verification →
              </button>
            </form>
          )}

          {step === 2 && (
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
              <h2 className="font-bold text-gray-800 text-lg">Enter NGO Verification Code</h2>
              <p className="text-gray-500 text-sm">
                Your NGO should have received a unique verification code from FoodBridge admin.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
                <strong>Demo codes (for prototype):</strong>
                <div className="mt-1 font-mono text-xs space-y-0.5">
                  {VALID_NGO_CODES.map((c) => <div key={c}>{c}</div>)}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1 text-sm">Verification Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={codeInput}
                    onChange={(e) => { setCodeInput(e.target.value); setCodeError(""); setCodeValid(false); }}
                    placeholder="e.g., NGO-FB-2026-001"
                    className={`${inputCls} ${codeValid ? "border-green-500 ring-2 ring-green-300" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={verifyCode}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 whitespace-nowrap"
                  >
                    Verify
                  </button>
                </div>
                {codeError && <p className="text-red-500 text-xs mt-1">{codeError}</p>}
                {codeValid && (
                  <p className="text-green-600 text-xs mt-1 flex items-center gap-1">
                    <FontAwesomeIcon icon={faCheckCircle} /> Code verified successfully!
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="border border-gray-300 text-gray-600 px-5 py-2.5 rounded-lg font-semibold hover:bg-gray-50 text-sm"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-green-700 text-sm"
                >
                  Submit Registration
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default NgoRegister;
