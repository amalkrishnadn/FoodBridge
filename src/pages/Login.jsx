import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Toast from "../components/Toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLeaf,
  faShield,
  faCheckCircle,
  faTimesCircle,
  faHourglassHalf,
} from "@fortawesome/free-solid-svg-icons";

/* ── Sample user database ──────────────────────────────────────── */
const SAMPLE_USERS = [
  {
    email: "verified@ngo.org",
    password: "demo123",
    role: "ngo",
    verificationStatus: "Verified",
    name: "Hope NGO",
  },
  {
    email: "pending@ngo.org",
    password: "demo123",
    role: "ngo",
    verificationStatus: "Verification Pending",
    name: "Care Centre NGO",
  },
  {
    email: "rejected@ngo.org",
    password: "demo123",
    role: "ngo",
    verificationStatus: "Rejected",
    name: "Green Earth NGO",
  },
  {
    email: "donor@demo.com",
    password: "demo123",
    role: "donor",
    verificationStatus: "Verified",
    name: "Rahul Sharma",
  },
  {
    email: "volunteer@demo.com",
    password: "demo123",
    role: "volunteer",
    verificationStatus: "Verified",
    name: "Amit Kumar",
  },
  {
    email: "admin@demo.com",
    password: "demo123",
    role: "admin",
    verificationStatus: "Verified",
    name: "Admin User",
  },
  {
    email: "events@demo.com",
    password: "demo123",
    role: "events",
    verificationStatus: "Verified",
    name: "Sara Thomas",
  },
  {
    email: "events-pending@demo.com",
    password: "demo123",
    role: "events",
    verificationStatus: "Verification Pending",
    name: "City Events Co",
  },
  {
    email: "recovery@demo.com",
    password: "demo123",
    role: "recovery",
    verificationStatus: "Verified",
    name: "EcoRecovery Ltd",
  },
  {
    email: "feed@demo.com",
    password: "demo123",
    role: "animalFeed",
    verificationStatus: "Verified",
    name: "Sunrise Cattle Farm",
  },
];

const DemoCard = () => (
  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4 text-xs text-blue-800">
    <p className="font-bold mb-1">Demo Credentials</p>
    <div className="space-y-0.5 font-mono">
      <div>donor@demo.com / demo123 → Donor</div>
      <div>verified@ngo.org / demo123 → NGO (Verified)</div>
      <div>pending@ngo.org / demo123 → NGO (Pending)</div>
      <div>rejected@ngo.org / demo123 → NGO (Rejected)</div>
      <div>volunteer@demo.com / demo123 → Volunteer</div>
      <div>events@demo.com / demo123 → Events</div>
      <div>events-pending@demo.com / demo123 → Events (Pending)</div>
      <div>recovery@demo.com / demo123 → Recovery</div>
      <div>feed@demo.com / demo123 → Animal Feed</div>
      <div>admin@demo.com / demo123 → Admin</div>
    </div>
  </div>
);

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [toast, setToast] = useState(null);
  const [showDemo, setShowDemo] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = SAMPLE_USERS.find(
      (u) => u.email === formData.email && u.password === formData.password
    );

    if (!user) {
      setToast({ msg: "Invalid email or password. Try a demo credential below.", type: "error" });
      return;
    }

    /* Handle verification status for NGOs and Event Organizers */
    if (["ngo", "events"].includes(user.role)) {
      if (user.verificationStatus === "Verification Pending") {
        navigate("/verification-pending");
        return;
      }
      if (user.verificationStatus === "Rejected") {
        navigate("/verification-rejected");
        return;
      }
    }

    setToast({ msg: `Welcome back, ${user.name}!`, type: "success" });
    setTimeout(() => navigate(`/${user.role}`), 800);
  };

  return (
    <>
      <Header />
      {toast && (
        <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />
      )}
      <section className="min-h-[75vh] bg-green-50 flex items-center justify-center px-5 py-12">
        <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">
          <div className="text-center mb-8">
            <FontAwesomeIcon icon={faLeaf} className="text-green-600 text-3xl mb-2" />
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-500 mt-2">Login to your FoodBridge account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Login
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6 text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-green-600 font-semibold">Register</Link>
          </p>

          <button
            type="button"
            onClick={() => setShowDemo(!showDemo)}
            className="w-full mt-3 text-xs text-blue-600 hover:underline"
          >
            {showDemo ? "Hide" : "Show"} demo credentials
          </button>
          {showDemo && <DemoCard />}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Login;
