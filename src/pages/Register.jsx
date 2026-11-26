import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeaf, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const ROLE_NOTES = {
  ngo: "NGOs require document verification. You'll go through a guided registration process.",
  eventOrganizer: "Event Organizers require document verification. You'll go through a guided process.",
};

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", password: "", confirmPassword: "", role: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    /* Redirect specialized roles to their guided registration */
    if (formData.role === "ngo") {
      navigate("/ngo-register");
      return;
    }
    if (formData.role === "eventOrganizer") {
      navigate("/event-organizer-register");
      return;
    }
    alert("Registration submitted. Backend integration is pending.");
  };

  const inputCls =
    "w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 text-sm";

  return (
    <>
      <Header />
      <section className="bg-green-50 min-h-screen flex items-center justify-center px-5 py-12">
        <div className="bg-white w-full max-w-lg p-8 rounded-2xl shadow-lg">
          <div className="text-center mb-8">
            <FontAwesomeIcon icon={faLeaf} className="text-green-600 text-3xl mb-2" />
            <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
            <p className="text-gray-500 mt-2">Join FoodBridge and make a difference</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your full name" required className={inputCls} />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" required className={inputCls} />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">Phone Number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter your phone number" required className={inputCls} />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">Account Type</label>
              <select name="role" value={formData.role} onChange={handleChange} required className={inputCls}>
                <option value="">Select account type</option>
                <option value="donor">Food Donor</option>
                <option value="ngo">NGO</option>
                <option value="volunteer">Volunteer</option>
                <option value="eventOrganizer">Event Organizer</option>
                <option value="animalFeedHandler">Animal Feed Handler</option>
                <option value="recoveryFacility">Recovery Facility</option>
              </select>
            </div>

            {/* Role-specific note */}
            {ROLE_NOTES[formData.role] && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-xs text-blue-800 flex items-start gap-2">
                <FontAwesomeIcon icon={faArrowRight} className="mt-0.5" />
                {ROLE_NOTES[formData.role]}
              </div>
            )}

            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Create a password" minLength="6" required className={inputCls} />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">Confirm Password</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your password" minLength="6" required className={inputCls} />
            </div>

            <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition">
              {formData.role === "ngo" || formData.role === "eventOrganizer"
                ? "Continue to Verification →"
                : "Create Account"}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-green-600 font-semibold">Login</Link>
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Register;
