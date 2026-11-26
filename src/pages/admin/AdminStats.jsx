import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUtensils,
  faRecycle,
  faHandHoldingHeart,
  faBuilding,
  faPeopleCarry,
  faCalendarCheck,
  faChartBar,
  faLeaf,
  faTrophy,
  faTable,
  faArrowTrendUp,
  faFlask,
  faPaw,
  faEllipsisH,
  faFire,
} from "@fortawesome/free-solid-svg-icons";

/* ─── Helpers ─────────────────────────────────────── */
const StatCard = ({ icon, label, value, sub, color }) => (
  <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-start gap-4`}>
    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${color} flex-shrink-0`}>
      <FontAwesomeIcon icon={icon} className="text-white text-xl" />
    </div>
    <div>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
      <p className="text-sm font-semibold text-gray-600 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  </div>
);

const HBar = ({ label, pct, color, icon }) => (
  <div className="flex items-center gap-4">
    <div className="w-44 flex-shrink-0 flex items-center gap-2">
      {icon && <FontAwesomeIcon icon={icon} className={`${color.replace("bg-", "text-")} text-sm`} />}
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </div>
    <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
      <div
        className={`h-5 rounded-full ${color} transition-all duration-700 flex items-center justify-end pr-2`}
        style={{ width: `${pct}%` }}
      >
        <span className="text-white text-xs font-bold">{pct}%</span>
      </div>
    </div>
  </div>
);

/* ─── Data ────────────────────────────────────────── */
const monthlyData = [
  { month: "Jun 2026", donations: 142, meals: 1480, waste: 612, ngos: 42 },
  { month: "Jul 2026", donations: 168, meals: 1720, waste: 710, ngos: 48 },
  { month: "Aug 2026", donations: 155, meals: 1600, waste: 660, ngos: 45 },
  { month: "Sep 2026", donations: 189, meals: 1950, waste: 804, ngos: 55 },
  { month: "Oct 2026", donations: 212, meals: 2180, waste: 900, ngos: 61 },
  { month: "Nov 2026", donations: 237, meals: 2440, waste: 982, ngos: 67 },
];

const topDonors = [
  { rank: 1, name: "Green Plate Catering", type: "Restaurant", count: 48, meals: 1240, status: "Active" },
  { rank: 2, name: "City Hotel Group", type: "Hotel", count: 39, meals: 980, status: "Active" },
  { rank: 3, name: "FreshMart Supermarket", type: "Retail", count: 34, meals: 870, status: "Active" },
  { rank: 4, name: "Sunrise Bakery", type: "Bakery", count: 27, meals: 620, status: "Active" },
  { rank: 5, name: "Corporate Canteen Hub", type: "Corporate", count: 22, meals: 540, status: "Inactive" },
];

const topNgos = [
  { name: "Hope Foundation", requests: 76, meals: 1840, families: 368 },
  { name: "Bright Futures NGO", requests: 64, meals: 1520, families: 304 },
  { name: "City Care Trust", requests: 58, meals: 1380, families: 276 },
  { name: "Nourish Kerala", requests: 47, meals: 1100, families: 220 },
  { name: "Annadana Samithi", requests: 39, meals: 920, families: 184 },
];

const pipelineStages = [
  { label: "Reported", count: 12, color: "bg-blue-500" },
  { label: "Assigned", count: 8, color: "bg-indigo-500" },
  { label: "Collected", count: 6, color: "bg-purple-500" },
  { label: "Processing", count: 4, color: "bg-yellow-500" },
  { label: "Processed", count: 15, color: "bg-green-500" },
  { label: "Closed", count: 45, color: "bg-gray-400" },
];

/* ─── Component ───────────────────────────────────── */
export default function AdminStats() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "distribution", label: "Distribution" },
    { id: "monthly", label: "Monthly Impact" },
    { id: "leaderboard", label: "Leaderboard" },
    { id: "pipeline", label: "Pipeline" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <FontAwesomeIcon icon={faChartBar} className="text-green-600" />
          Platform Statistics & Analytics
        </h1>
        <p className="text-gray-500 mt-1">Comprehensive overview of FoodBridge platform performance</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === t.id
                ? "bg-green-600 text-white shadow-md shadow-green-200"
                : "bg-white text-gray-600 hover:bg-green-50 border border-gray-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            <StatCard icon={faUtensils} label="Total Meals Shared" value="10,432" sub="+237 this month" color="bg-green-500" />
            <StatCard icon={faRecycle} label="Waste Recovered" value="4,280 kg" sub="+982 kg this month" color="bg-emerald-600" />
            <StatCard icon={faHandHoldingHeart} label="Active Donors" value="342" sub="Across 6 categories" color="bg-teal-500" />
            <StatCard icon={faBuilding} label="NGOs Served" value="67" sub="Verified & Active" color="bg-cyan-600" />
            <StatCard icon={faPeopleCarry} label="Active Volunteers" value="89" sub="Tasks completed: 412" color="bg-blue-500" />
            <StatCard icon={faCalendarCheck} label="Events Processed" value="124" sub="Food surplus handled" color="bg-indigo-500" />
          </div>

          {/* Quick Insight Strip */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl p-6 text-white">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <FontAwesomeIcon icon={faArrowTrendUp} /> Platform Health at a Glance
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Avg Meals / Donation", val: "69" },
                { label: "Avg Waste / Event", val: "34.5 kg" },
                { label: "NGO Satisfaction", val: "94%" },
                { label: "Donor Retention", val: "78%" },
              ].map((item) => (
                <div key={item.label} className="bg-white/20 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold">{item.val}</p>
                  <p className="text-xs text-green-100 mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── DISTRIBUTION ── */}
      {activeTab === "distribution" && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Food by Category */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FontAwesomeIcon icon={faUtensils} className="text-green-600" />
              Food Distribution by Category
            </h2>
            <div className="space-y-5">
              <HBar label="Cooked Meals" pct={38} color="bg-green-500" />
              <HBar label="Bakery & Bread" pct={22} color="bg-yellow-500" />
              <HBar label="Fruits & Vegetables" pct={18} color="bg-emerald-500" />
              <HBar label="Dairy Products" pct={12} color="bg-blue-400" />
              <HBar label="Other" pct={10} color="bg-gray-400" />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              {[
                { label: "Cooked Meals", color: "bg-green-500" },
                { label: "Bakery & Bread", color: "bg-yellow-500" },
                { label: "Fruits & Vegetables", color: "bg-emerald-500" },
                { label: "Dairy Products", color: "bg-blue-400" },
                { label: "Other", color: "bg-gray-400" },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5 text-xs text-gray-600">
                  <span className={`w-3 h-3 rounded-full ${l.color}`}></span>
                  {l.label}
                </div>
              ))}
            </div>
          </div>

          {/* Recovery Breakdown */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FontAwesomeIcon icon={faLeaf} className="text-green-600" />
              Recovery Breakdown by Type
            </h2>
            <div className="space-y-5">
              <HBar label="Composting" pct={45} color="bg-green-600" icon={faLeaf} />
              <HBar label="Biogas" pct={25} color="bg-orange-500" icon={faFire} />
              <HBar label="Animal Feed" pct={20} color="bg-amber-500" icon={faPaw} />
              <HBar label="Other" pct={10} color="bg-gray-400" icon={faEllipsisH} />
            </div>

            {/* Circular-ish visual */}
            <div className="mt-8 grid grid-cols-2 gap-3">
              {[
                { label: "Composting", pct: 45, color: "bg-green-100 text-green-700 border-green-200" },
                { label: "Biogas", pct: 25, color: "bg-orange-100 text-orange-700 border-orange-200" },
                { label: "Animal Feed", pct: 20, color: "bg-amber-100 text-amber-700 border-amber-200" },
                { label: "Other", pct: 10, color: "bg-gray-100 text-gray-700 border-gray-200" },
              ].map((item) => (
                <div key={item.label} className={`border rounded-xl p-3 text-center ${item.color}`}>
                  <p className="text-2xl font-bold">{item.pct}%</p>
                  <p className="text-xs font-semibold mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── MONTHLY ── */}
      {activeTab === "monthly" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FontAwesomeIcon icon={faTable} className="text-green-600" />
            Monthly Impact — Last 6 Months
          </h2>

          {/* Bar visualization */}
          <div className="mb-8">
            <p className="text-sm font-semibold text-gray-500 mb-3">Meals Shared per Month</p>
            <div className="flex items-end gap-4 h-40">
              {monthlyData.map((m) => {
                const maxMeals = 2440;
                const heightPct = Math.round((m.meals / maxMeals) * 100);
                return (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs font-bold text-green-700">{m.meals}</span>
                    <div
                      className="w-full bg-green-500 rounded-t-lg hover:bg-green-600 transition-all"
                      style={{ height: `${heightPct}%` }}
                    ></div>
                    <span className="text-xs text-gray-500 text-center leading-tight">{m.month.replace(" 2026", "")}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-600">
                  <th className="text-left px-4 py-3 rounded-l-xl font-semibold">Month</th>
                  <th className="text-right px-4 py-3 font-semibold">Donations</th>
                  <th className="text-right px-4 py-3 font-semibold">Meals Shared</th>
                  <th className="text-right px-4 py-3 font-semibold">Waste Recovered (kg)</th>
                  <th className="text-right px-4 py-3 rounded-r-xl font-semibold">NGOs Served</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {monthlyData.map((row, i) => (
                  <tr key={row.month} className={`hover:bg-green-50 transition-colors ${i === monthlyData.length - 1 ? "font-semibold text-green-700" : ""}`}>
                    <td className="px-4 py-3">{row.month}</td>
                    <td className="px-4 py-3 text-right">{row.donations}</td>
                    <td className="px-4 py-3 text-right">{row.meals.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">{row.waste}</td>
                    <td className="px-4 py-3 text-right">{row.ngos}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-green-50 font-bold text-green-800">
                  <td className="px-4 py-3 rounded-l-xl">Total</td>
                  <td className="px-4 py-3 text-right">{monthlyData.reduce((s, r) => s + r.donations, 0)}</td>
                  <td className="px-4 py-3 text-right">{monthlyData.reduce((s, r) => s + r.meals, 0).toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">{monthlyData.reduce((s, r) => s + r.waste, 0)}</td>
                  <td className="px-4 py-3 text-right rounded-r-xl">—</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* ── LEADERBOARD ── */}
      {activeTab === "leaderboard" && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Top Donors */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
              <FontAwesomeIcon icon={faTrophy} className="text-yellow-500" />
              Top Donors
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 text-xs uppercase tracking-wide">
                    <th className="text-left pb-3">Rank</th>
                    <th className="text-left pb-3">Donor</th>
                    <th className="text-right pb-3">Donations</th>
                    <th className="text-right pb-3">Meals</th>
                    <th className="text-right pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {topDonors.map((d) => (
                    <tr key={d.rank} className="hover:bg-green-50 transition-colors">
                      <td className="py-3 pr-2">
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                            d.rank === 1 ? "bg-yellow-400" : d.rank === 2 ? "bg-gray-400" : d.rank === 3 ? "bg-amber-600" : "bg-green-200 text-green-700"
                          }`}
                        >
                          {d.rank}
                        </span>
                      </td>
                      <td className="py-3">
                        <p className="font-semibold text-gray-800">{d.name}</p>
                        <p className="text-xs text-gray-400">{d.type}</p>
                      </td>
                      <td className="py-3 text-right font-semibold">{d.count}</td>
                      <td className="py-3 text-right">{d.meals}</td>
                      <td className="py-3 text-right">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${d.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {d.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top NGOs */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
              <FontAwesomeIcon icon={faBuilding} className="text-blue-500" />
              Top NGOs
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 text-xs uppercase tracking-wide">
                    <th className="text-left pb-3">NGO</th>
                    <th className="text-right pb-3">Requests</th>
                    <th className="text-right pb-3">Meals Received</th>
                    <th className="text-right pb-3">Families</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {topNgos.map((n, i) => (
                    <tr key={n.name} className="hover:bg-blue-50 transition-colors">
                      <td className="py-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                        <span className="font-semibold text-gray-800">{n.name}</span>
                      </td>
                      <td className="py-3 text-right">{n.requests}</td>
                      <td className="py-3 text-right font-semibold">{n.meals}</td>
                      <td className="py-3 text-right text-green-700 font-semibold">{n.families}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── PIPELINE ── */}
      {activeTab === "pipeline" && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
            <FontAwesomeIcon icon={faFlask} className="text-green-600" />
            Waste Recovery Pipeline
          </h2>
          <p className="text-sm text-gray-400 mb-10">Current stage counts across all active recovery batches</p>

          {/* Step counter visual */}
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-8 left-0 right-0 h-1 bg-gray-100 mx-16 z-0"></div>

            <div className="relative z-10 grid grid-cols-3 md:grid-cols-6 gap-4">
              {pipelineStages.map((stage, i) => (
                <div key={stage.label} className="flex flex-col items-center gap-3">
                  <div className={`w-16 h-16 rounded-full ${stage.color} flex items-center justify-center shadow-lg`}>
                    <span className="text-white text-xl font-bold">{stage.count}</span>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-700">{stage.label}</p>
                    <p className="text-xs text-gray-400">batches</p>
                  </div>
                  {i < pipelineStages.length - 1 && (
                    <div className="hidden md:block absolute" style={{ display: "none" }}></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Horizontal bars for pipeline */}
          <div className="mt-10 space-y-4">
            <p className="text-sm font-semibold text-gray-600 mb-4">Volume by Stage</p>
            {pipelineStages.map((stage) => {
              const total = pipelineStages.reduce((s, x) => s + x.count, 0);
              const pct = Math.round((stage.count / total) * 100);
              return (
                <div key={stage.label} className="flex items-center gap-4">
                  <span className="w-28 text-sm font-medium text-gray-700 flex-shrink-0">{stage.label}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
                    <div
                      className={`h-6 rounded-full ${stage.color} flex items-center justify-end pr-2 transition-all duration-700`}
                      style={{ width: `${pct}%` }}
                    >
                      <span className="text-white text-xs font-bold">{stage.count}</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 w-10 text-right">{pct}%</span>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-100">
              <p className="text-2xl font-bold text-blue-700">{pipelineStages.slice(0, 2).reduce((s, x) => s + x.count, 0)}</p>
              <p className="text-xs text-blue-500 font-semibold mt-1">In Queue</p>
            </div>
            <div className="bg-yellow-50 rounded-xl p-4 text-center border border-yellow-100">
              <p className="text-2xl font-bold text-yellow-700">{pipelineStages.slice(2, 4).reduce((s, x) => s + x.count, 0)}</p>
              <p className="text-xs text-yellow-500 font-semibold mt-1">In Progress</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center border border-green-100">
              <p className="text-2xl font-bold text-green-700">{pipelineStages.slice(4).reduce((s, x) => s + x.count, 0)}</p>
              <p className="text-xs text-green-500 font-semibold mt-1">Completed</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
