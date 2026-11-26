import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHourglassHalf } from "@fortawesome/free-solid-svg-icons";

const VerificationPending = () => (
  <>
    <Header />
    <section className="min-h-[70vh] bg-yellow-50 flex items-center justify-center px-5 py-12">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4 animate-pulse">
          <FontAwesomeIcon icon={faHourglassHalf} className="text-yellow-500 text-3xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification Pending</h2>
        <p className="text-gray-500 text-sm mb-5">
          Your account is awaiting verification by our admin team. This usually takes 2–3 business days.
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-left mb-5 text-sm text-yellow-800">
          <p className="font-semibold">What happens next?</p>
          <ul className="mt-2 list-disc list-inside space-y-1 text-xs">
            <li>Admin reviews your submitted documents</li>
            <li>You will receive an email notification</li>
            <li>Once approved, you can access the full dashboard</li>
          </ul>
        </div>
        <Link to="/login" className="inline-block border border-gray-300 text-gray-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50">
          Back to Login
        </Link>
      </div>
    </section>
    <Footer />
  </>
);

export default VerificationPending;
