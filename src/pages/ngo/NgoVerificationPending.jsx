import React from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHourglassHalf, faEnvelope, faFileAlt } from "@fortawesome/free-solid-svg-icons";

/* Simulate different states: "pending" | "rejected" */
const DEMO_STATUS = "pending"; // change to "rejected" to test rejection screen

const NgoVerificationPending = () => {
  if (DEMO_STATUS === "rejected") {
    return (
      <>
        <Header />
        <section className="min-h-[70vh] bg-red-50 flex items-center justify-center px-5 py-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-3xl">✕</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification Rejected</h2>
            <p className="text-gray-500 text-sm mb-4">
              Unfortunately, your NGO verification was rejected. Please review the reasons below and resubmit.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-left mb-5">
              <p className="text-sm font-semibold text-red-700">Reason:</p>
              <p className="text-xs text-red-600 mt-1">
                The registration certificate uploaded was not legible. Please upload a clear, high-quality document.
              </p>
            </div>
            <Link
              to="/ngo-register"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700"
            >
              Resubmit Documents
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
      <section className="min-h-[70vh] bg-yellow-50 flex items-center justify-center px-5 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <FontAwesomeIcon icon={faHourglassHalf} className="text-yellow-500 text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification Pending</h2>
          <p className="text-gray-500 text-sm mb-5">
            Your NGO registration is currently under review. Our admin team will verify your documents within 2–3 business days.
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-left mb-5 space-y-2">
            <div className="flex items-center gap-2 text-sm text-yellow-800">
              <FontAwesomeIcon icon={faFileAlt} />
              <span>Documents submitted and under review</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-yellow-800">
              <FontAwesomeIcon icon={faEnvelope} />
              <span>You will be notified at your registered email</span>
            </div>
          </div>

          <Link
            to="/login"
            className="inline-block border border-gray-300 text-gray-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50"
          >
            Back to Login
          </Link>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default NgoVerificationPending;
