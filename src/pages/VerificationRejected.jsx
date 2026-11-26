import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";

const VerificationRejected = () => (
  <>
    <Header />
    <section className="min-h-[70vh] bg-red-50 flex items-center justify-center px-5 py-12">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <FontAwesomeIcon icon={faTimesCircle} className="text-red-500 text-3xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification Rejected</h2>
        <p className="text-gray-500 text-sm mb-4">
          Unfortunately, your verification application was rejected.
        </p>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-left mb-5 text-sm text-red-700">
          <p className="font-semibold">Reason for Rejection:</p>
          <p className="text-xs mt-1">
            The registration certificate uploaded was not legible. Please upload a clear, high-quality document.
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <Link
            to="/register"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700"
          >
            Resubmit Documents
          </Link>
          <Link
            to="/login"
            className="inline-block border border-gray-300 text-gray-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </section>
    <Footer />
  </>
);

export default VerificationRejected;
