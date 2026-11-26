/**
 * AppContext.jsx
 * Central shared state for the FoodBridge frontend prototype.
 * All CRUD operations, status updates and notifications live here.
 */
import React, { createContext, useContext, useState, useCallback, useRef } from "react";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const now = () => new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
const uid = (prefix) => `${prefix}-${Date.now().toString(36).toUpperCase()}`;

// ─── Seed data ────────────────────────────────────────────────────────────────
const SEED_DONATIONS = [
  {
    id: "DON-001", foodName: "Vegetable Rice", category: "Cooked Meals",
    condition: "Fresh (Same Day)", quantity: "25", unit: "meals",
    expiryDate: "2026-11-27", allergens: [], storage: "Keep cool",
    notes: "Freshly cooked biryani", images: [],
    location: { address: "Green Hotel, MG Road", city: "Kochi", state: "Kerala", lat: 9.9312, lng: 76.2673 },
    donorName: "Rahul Sharma", donorPhone: "+91 98765 43210",
    createdAt: "24 Nov 2026, 09:00 AM", status: "Available",
    timeline: [{ stage: "Available", time: "24 Nov 09:00 AM", note: "Donation listed" }],
  },
  {
    id: "DON-002", foodName: "Fresh Bread", category: "Bakery & Bread",
    condition: "Good (1-2 Days Old)", quantity: "40", unit: "pieces",
    expiryDate: "2026-11-26", allergens: ["Gluten"], storage: "Room temperature",
    notes: "Assorted loaves", images: [],
    location: { address: "City Bakery, Park Avenue", city: "Kochi", state: "Kerala", lat: 9.9850, lng: 76.2996 },
    donorName: "City Bakery", donorPhone: "+91 94455 12300",
    createdAt: "23 Nov 2026, 08:30 AM", status: "Completed",
    timeline: [
      { stage: "Available", time: "23 Nov 08:30 AM", note: "Donation listed" },
      { stage: "Requested", time: "23 Nov 10:00 AM", note: "NGO request received" },
      { stage: "Approved",  time: "23 Nov 10:15 AM", note: "Request approved" },
      { stage: "Collected", time: "23 Nov 02:00 PM", note: "Collected by volunteer" },
      { stage: "Completed", time: "23 Nov 04:00 PM", note: "Delivered to Hope NGO" },
    ],
  },
  {
    id: "DON-003", foodName: "Fruit Packs", category: "Fruits & Vegetables",
    condition: "Near Expiry", quantity: "15", unit: "packs",
    expiryDate: "2026-11-26", allergens: [], storage: "Refrigerate",
    notes: "Mixed seasonal fruits", images: [],
    location: { address: "Fresh Mart, Broadway", city: "Kochi", state: "Kerala", lat: 9.9673, lng: 76.2850 },
    donorName: "Fresh Mart", donorPhone: "+91 80001 55678",
    createdAt: "22 Nov 2026, 11:00 AM", status: "Requested",
    timeline: [
      { stage: "Available", time: "22 Nov 11:00 AM", note: "Donation listed" },
      { stage: "Requested", time: "22 Nov 02:00 PM", note: "NGO request received" },
    ],
  },
  {
    id: "DON-004", foodName: "Hotel Buffet Leftovers", category: "Surplus Event Food",
    condition: "Fresh (Same Day)", quantity: "80", unit: "meals",
    expiryDate: "2026-11-26", allergens: ["Dairy", "Gluten"], storage: "Keep warm",
    notes: "Wedding buffet surplus – rice, curries, desserts",
    images: [],
    location: { address: "Royal Grand Hotel, Vyttila", city: "Kochi", state: "Kerala", lat: 9.9617, lng: 76.3193 },
    donorName: "Royal Grand Hotel", donorPhone: "+91 97700 11234",
    createdAt: "26 Nov 2026, 06:00 PM", status: "Available",
    timeline: [{ stage: "Available", time: "26 Nov 06:00 PM", note: "Donation listed" }],
  },
];

const DONATION_STAGES = ["Available", "Requested", "Approved", "Collected", "Completed"];

const SEED_NGO_REQUESTS = [
  {
    id: "REQ-001", donationId: "DON-001", foodName: "Vegetable Rice", source: "Rahul Sharma",
    qty: "25 meals", requestedFor: "50 families at shelter", requestedAt: "24 Nov 2026, 10:00 AM",
    status: "Approved",
    timeline: [
      { stage: "Submitted",  time: "24 Nov 10:00 AM", note: "Request submitted by NGO" },
      { stage: "Under Review", time: "24 Nov 10:30 AM", note: "Donor reviewing request" },
      { stage: "Approved",   time: "24 Nov 11:00 AM", note: "Donor approved the request" },
    ],
  },
  {
    id: "REQ-002", donationId: "DON-003", foodName: "Fruit Packs", source: "Fresh Mart",
    qty: "15 packs", requestedFor: "Children at care centre", requestedAt: "22 Nov 2026, 03:00 PM",
    status: "Submitted",
    timeline: [
      { stage: "Submitted", time: "22 Nov 03:00 PM", note: "Request submitted" },
    ],
  },
];

const NGO_REQUEST_STAGES = ["Submitted", "Under Review", "Approved", "Collected", "Completed"];

const SEED_RECOVERY_MATERIALS = [
  {
    id: "REC-001", name: "Vegetable Waste", type: "Composting", qty: "40 kg",
    source: "Fresh Mart", reportedOn: "24 Nov 2026", status: "Processing",
    condition: "Mostly leafy greens and peels", urgency: "Within 24 hours",
    location: { address: "Fresh Mart, Broadway", city: "Kochi", state: "Kerala" },
    notes: "Mostly leafy greens and peels.",
    timeline: [
      { stage: "Reported",   note: "Reported by Fresh Mart",          time: "24 Nov 09:00 AM" },
      { stage: "Assigned",   note: "Assigned to GreenCompost Ltd",    time: "24 Nov 10:30 AM" },
      { stage: "Collected",  note: "Collected from source",           time: "24 Nov 02:00 PM" },
      { stage: "Processing", note: "Processing started at facility",  time: "25 Nov 08:00 AM" },
    ],
  },
  {
    id: "REC-002", name: "Expired Bread", type: "Animal Feed", qty: "20 kg",
    source: "City Bakery", reportedOn: "22 Nov 2026", status: "Closed",
    condition: "Sealed bags, slight mold on edges", urgency: "Within 48 hours",
    location: { address: "City Bakery, Park Avenue", city: "Kochi", state: "Kerala" },
    notes: "Sealed bags, slight mold on edges.",
    timeline: [
      { stage: "Reported",   note: "Reported by City Bakery",   time: "22 Nov 08:00 AM" },
      { stage: "Assigned",   note: "Assigned to FarmFeeds Co.", time: "22 Nov 09:15 AM" },
      { stage: "Collected",  note: "Collected",                 time: "22 Nov 12:00 PM" },
      { stage: "Processing", note: "Processing started",        time: "22 Nov 03:00 PM" },
      { stage: "Processed",  note: "Successfully processed",    time: "23 Nov 10:00 AM" },
      { stage: "Closed",     note: "Record closed",             time: "23 Nov 11:30 AM" },
    ],
  },
  {
    id: "REC-003", name: "Food Processing Waste", type: "Composting", qty: "60 kg",
    source: "GrainWorks Factory", reportedOn: "25 Nov 2026", status: "Assigned",
    condition: "Wheat bran and husks", urgency: "Within 72 hours",
    location: { address: "GrainWorks Industrial Area", city: "Thrissur", state: "Kerala" },
    notes: "Wheat bran and husks.",
    timeline: [
      { stage: "Reported", note: "Reported by GrainWorks Factory", time: "25 Nov 07:30 AM" },
      { stage: "Assigned", note: "Assigned to EcoHarvest",         time: "25 Nov 09:00 AM" },
    ],
  },
  {
    id: "REC-004", name: "Restaurant Scraps", type: "Biogas", qty: "35 kg",
    source: "The Grand Hotel", reportedOn: "23 Nov 2026", status: "Collected",
    condition: "Mixed kitchen waste", urgency: "Within 24 hours",
    location: { address: "The Grand Hotel, MG Road", city: "Kochi", state: "Kerala" },
    notes: "Mixed kitchen waste.",
    timeline: [
      { stage: "Reported",  note: "Reported by The Grand Hotel",  time: "23 Nov 10:00 AM" },
      { stage: "Assigned",  note: "Assigned to BioPower Systems", time: "23 Nov 11:00 AM" },
      { stage: "Collected", note: "Collected from hotel",         time: "23 Nov 04:00 PM" },
    ],
  },
  {
    id: "REC-005", name: "Dairy Waste", type: "Biogas", qty: "25 L",
    source: "Sunrise Dairy", reportedOn: "21 Nov 2026", status: "Processed",
    condition: "Whey and rinse water", urgency: "Within 48 hours",
    location: { address: "Sunrise Dairy, Kalamassery", city: "Kochi", state: "Kerala" },
    notes: "Whey and rinse water.",
    timeline: [
      { stage: "Reported", note: "Reported by Sunrise Dairy", time: "21 Nov 08:00 AM" },
      { stage: "Assigned", note: "Assigned to BioPower Systems", time: "21 Nov 09:00 AM" },
      { stage: "Collected", note: "Collected", time: "21 Nov 01:00 PM" },
      { stage: "Processing", note: "Processing started", time: "22 Nov 09:00 AM" },
      { stage: "Processed", note: "Gas generation complete", time: "23 Nov 02:00 PM" },
    ],
  },
  {
    id: "REC-006", name: "Fruit Pulp", type: "Composting", qty: "80 kg",
    source: "JuiceZone Factory", reportedOn: "26 Nov 2026", status: "Reported",
    condition: "High moisture", urgency: "Within 24 hours",
    location: { address: "JuiceZone, Eloor", city: "Kochi", state: "Kerala" },
    notes: "High moisture. Collect within 24 hrs.",
    timeline: [{ stage: "Reported", note: "Reported by JuiceZone Factory", time: "26 Nov 06:00 AM" }],
  },
];

const RECOVERY_STAGES = ["Reported", "Assigned", "Collected", "Processing", "Processed", "Closed"];

const SEED_AVAILABLE_WASTE = [
  {
    id: "WST-001", name: "Market Floor Sweepings", type: "Composting", qty: "110 kg",
    source: "Ernakulam Vegetable Market", distance: "2.4 km", suitability: "Unsuitable for people or animals",
    condition: "Wet trimmings and spoiled produce",
    location: { address: "Broadway Market", city: "Kochi", state: "Kerala" },
  },
  {
    id: "WST-002", name: "Used Cooking Oil", type: "Biogas", qty: "40 L",
    source: "Spice Route Restaurant", distance: "4.1 km", suitability: "Biogas only",
    condition: "Sealed drums, no food contact reuse",
    location: { address: "Marine Drive", city: "Kochi", state: "Kerala" },
  },
  {
    id: "WST-003", name: "Stale Bakery Returns", type: "Animal Feed", qty: "28 kg",
    source: "Morning Oven", distance: "1.8 km", suitability: "Suitable for approved farms",
    condition: "Dry loaves, no visible mold",
    location: { address: "Kadavanthra", city: "Kochi", state: "Kerala" },
  },
];

const SEED_VOLUNTEER_TASKS = [
  {
    id: "TASK-001", donationId: "DON-001", foodName: "Vegetable Rice", quantity: "25 meals",
    donorName: "Rahul Sharma", donorPhone: "+91 98765 43210",
    pickupLocation: "Green Hotel, MG Road, Kochi, Kerala",
    deliveryLocation: "Hope NGO, Ernakulam North, Kochi",
    scheduledTime: "10:30 AM, 25 Nov 2026", status: "Pending",
    timeline: [{ stage: "Pending", time: "09:00 AM", note: "Task assigned to volunteer" }],
  },
  {
    id: "TASK-002", donationId: "DON-002", foodName: "Fresh Bread", quantity: "40 pieces",
    donorName: "City Bakery", donorPhone: "+91 94455 12300",
    pickupLocation: "City Bakery, Park Avenue, Kochi",
    deliveryLocation: "Care Centre NGO, Kaloor, Kochi",
    scheduledTime: "12:00 PM, 25 Nov 2026", status: "Food Collected",
    timeline: [
      { stage: "Pending", time: "10:00 AM", note: "Task assigned" },
      { stage: "Accepted", time: "10:10 AM", note: "Task accepted by volunteer" },
      { stage: "Pickup In Progress", time: "11:30 AM", note: "Volunteer en route to pickup" },
      { stage: "Food Collected", time: "12:00 PM", note: "Food collected from donor" },
    ],
  },
  {
    id: "TASK-003", donationId: "DON-003", foodName: "Fruit Packs", quantity: "15 packs",
    donorName: "Fresh Mart", donorPhone: "+91 80001 55678",
    pickupLocation: "Fresh Mart, Broadway, Kochi",
    deliveryLocation: "Helping Hands NGO, Vytilla, Kochi",
    scheduledTime: "2:00 PM, 24 Nov 2026", status: "Completed",
    timeline: [
      { stage: "Pending", time: "08:00 AM", note: "Task assigned" },
      { stage: "Accepted", time: "08:15 AM", note: "Task accepted" },
      { stage: "Pickup In Progress", time: "09:30 AM", note: "En route to pickup" },
      { stage: "Food Collected", time: "10:00 AM", note: "Food collected" },
      { stage: "Out for Delivery", time: "10:15 AM", note: "Heading to NGO" },
      { stage: "Delivered", time: "11:00 AM", note: "Food delivered to NGO" },
      { stage: "Completed", time: "11:05 AM", note: "Task completed successfully" },
    ],
  },
];

const VOLUNTEER_STAGES = ["Pending", "Accepted", "Pickup In Progress", "Food Collected", "Out for Delivery", "Delivered", "Completed"];

const SEED_ANIMAL_FEED_REQUESTS = [
  {
    id: "AFR-001", foodName: "Stale Bread Loaves", donor: "City Bakery",
    qty: "15 kg", requestedAt: "25 Nov 2026, 09:00 AM",
    farm: "Sunrise Cattle Farm", farmContact: "+91 94400 11200",
    status: "Collected",
    timeline: [
      { stage: "Submitted",    time: "25 Nov 09:00 AM", note: "Request submitted" },
      { stage: "Approved",     time: "25 Nov 10:00 AM", note: "Donor approved" },
      { stage: "Scheduled",    time: "25 Nov 11:00 AM", note: "Collection scheduled" },
      { stage: "Collected",    time: "25 Nov 03:00 PM", note: "Collected from donor" },
    ],
  },
  {
    id: "AFR-002", foodName: "Vegetable Scraps", donor: "Fresh Mart",
    qty: "30 kg", requestedAt: "24 Nov 2026, 02:00 PM",
    farm: "GreenFarm Goats", farmContact: "+91 97700 55300",
    status: "Submitted",
    timeline: [
      { stage: "Submitted", time: "24 Nov 02:00 PM", note: "Request submitted" },
    ],
  },
];

const ANIMAL_FEED_STAGES = ["Submitted", "Approved", "Scheduled", "Collected", "Delivered", "Completed"];

const SEED_EVENT_REPORTS = [
  {
    id: "EVT-RPT-001", eventName: "Annual Gala Dinner", foodItem: "Biryani",
    quantity: "50", unit: "meals", pickupTime: "21:00",
    status: "Collected",
    location: { address: "Hotel Meridian, Kaloor", city: "Kochi", state: "Kerala" },
    notes: "Vegetarian biryani, still hot", reportedAt: "24 Nov 2026, 09:00 PM",
    timeline: [
      { stage: "Reported",  time: "24 Nov 09:00 PM", note: "Food reported" },
      { stage: "Matched",   time: "24 Nov 09:15 PM", note: "Matched with Hope NGO" },
      { stage: "Scheduled", time: "24 Nov 09:30 PM", note: "Volunteer assigned" },
      { stage: "Collected", time: "24 Nov 10:00 PM", note: "Food collected" },
    ],
  },
  {
    id: "EVT-RPT-002", eventName: "Wedding Reception", foodItem: "Mixed Sweets",
    quantity: "80", unit: "boxes", pickupTime: "23:00",
    status: "Reported",
    location: { address: "Royal Gardens, Edapally", city: "Kochi", state: "Kerala" },
    notes: "Assorted Indian sweets, sealed boxes", reportedAt: "25 Nov 2026, 11:00 PM",
    timeline: [
      { stage: "Reported", time: "25 Nov 11:00 PM", note: "Food reported by organizer" },
    ],
  },
];

const EVENT_REPORT_STAGES = ["Reported", "Matched", "Scheduled", "Collected", "Delivered", "Completed"];

const SEED_NOTIFICATIONS = [
  { id: "N-001", role: "donor",    text: "Your donation DON-001 has a new request from Hope NGO", time: "10 mins ago", read: false },
  { id: "N-002", role: "ngo",      text: "Your request REQ-001 was approved by the donor", time: "30 mins ago", read: false },
  { id: "N-003", role: "volunteer",text: "New task TASK-004 assigned to you for pickup at 2 PM", time: "1 hr ago",  read: false },
  { id: "N-004", role: "recovery", text: "Recovery material REC-003 is ready for collection", time: "2 hrs ago", read: true  },
  { id: "N-005", role: "admin",    text: "New NGO verification application from Green Earth NGO", time: "3 hrs ago", read: false },
  { id: "N-006", role: "events",   text: "Your food report EVT-RPT-002 has been matched with a volunteer", time: "5 hrs ago", read: true },
  { id: "N-007", role: "donor",    text: "DON-002 has been successfully delivered to Hope NGO", time: "Yesterday", read: true },
  { id: "N-008", role: "animalFeed", text: "Your request AFR-001 food has been collected", time: "2 hrs ago", read: false },
];

// ─── Context ──────────────────────────────────────────────────────────────────
const NGO_TO_DONATION = {
  Submitted: "Requested",
  "Under Review": "Requested",
  Approved: "Approved",
  Collected: "Collected",
  Completed: "Completed",
};

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [donations, setDonations]           = useState(SEED_DONATIONS);
  const [ngoRequests, setNgoRequests]       = useState(SEED_NGO_REQUESTS);
  const [recoveryMaterials, setRecovery]    = useState(SEED_RECOVERY_MATERIALS);
  const [availableWaste, setAvailableWaste] = useState(SEED_AVAILABLE_WASTE);
  const [animalFeedReqs, setAnimalFeed]     = useState(SEED_ANIMAL_FEED_REQUESTS);
  const [eventReports, setEventReports]     = useState(SEED_EVENT_REPORTS);
  const [volunteerTasks, setVolunteerTasks] = useState(SEED_VOLUNTEER_TASKS);
  const [notifications, setNotifications]   = useState(SEED_NOTIFICATIONS);

  const ngoRef = useRef(ngoRequests);
  ngoRef.current = ngoRequests;

  const addTimeline = (arr, id, stage, note) =>
    arr.map((item) =>
      item.id === id
        ? { ...item, timeline: [...item.timeline, { stage, time: now(), note }] }
        : item
    );

  // ── Donations (Donor CRUD) ───────────────────────────────────────────────
  const createDonation = useCallback((data) => {
    const d = { ...data, id: uid("DON"), createdAt: now(), status: "Available",
      timeline: [{ stage: "Available", time: now(), note: "Donation listed" }] };
    setDonations((p) => [d, ...p]);
    addNotification("donor", `Donation ${d.id} listed successfully`);
    return d.id;
  }, []);

  const updateDonation = useCallback((id, patch) => {
    setDonations((p) => p.map((d) => d.id === id ? { ...d, ...patch } : d));
  }, []);

  const deleteDonation = useCallback((id) => {
    setDonations((p) => p.filter((d) => d.id !== id));
  }, []);

  const advanceDonation = useCallback((id, nextStage, note = "") => {
    setDonations((p) =>
      addTimeline(p, id, nextStage, note || `Status updated to ${nextStage}`)
        .map((d) => d.id === id ? { ...d, status: nextStage } : d)
    );
    addNotification("donor", `Donation ${id} status changed to ${nextStage}`);
  }, []);

  // ── NGO Requests ────────────────────────────────────────────────────────
  const createNgoRequest = useCallback((data) => {
    const r = { ...data, id: uid("REQ"), requestedAt: now(), status: "Submitted",
      timeline: [{ stage: "Submitted", time: now(), note: "Request submitted by NGO" }] };
    setNgoRequests((p) => [r, ...p]);
    addNotification("ngo",   `Request ${r.id} submitted`);
    addNotification("donor", `New request for ${data.foodName} from NGO`);
    return r.id;
  }, []);

  const advanceNgoRequest = useCallback((id, nextStage, note = "") => {
    const donationId = ngoRef.current.find((r) => r.id === id)?.donationId;
    setNgoRequests((p) =>
      addTimeline(p, id, nextStage, note || `Updated to ${nextStage}`)
        .map((r) => r.id === id ? { ...r, status: nextStage } : r)
    );
    const donationStage = NGO_TO_DONATION[nextStage];
    if (donationId && donationStage) {
      setDonations((p) =>
        addTimeline(p, donationId, donationStage, `Synced from request ${id}`)
          .map((d) => d.id === donationId ? { ...d, status: donationStage } : d)
      );
      addNotification("donor", `Donation ${donationId} moved to ${donationStage}`);
    }
    addNotification("ngo", `Request ${id} updated to ${nextStage}`);
  }, []);

  const cancelNgoRequest = useCallback((id) => {
    setNgoRequests((p) =>
      addTimeline(p, id, "Cancelled", "Request cancelled by NGO")
        .map((r) => r.id === id ? { ...r, status: "Cancelled" } : r)
    );
    addNotification("ngo", `Request ${id} was cancelled`);
  }, []);

  const deleteNgoRequest = useCallback((id) => {
    setNgoRequests((p) => p.filter((r) => r.id !== id));
  }, []);

  // ── Recovery Materials (CRUD + Status) ──────────────────────────────────
  const createRecoveryMaterial = useCallback((data) => {
    const m = { ...data, id: uid("REC"), reportedOn: now().split(",")[0], status: "Reported",
      timeline: [{ stage: "Reported", time: now(), note: "Material reported" }] };
    setRecovery((p) => [m, ...p]);
    addNotification("recovery", `Recovery material ${m.id} listed`);
    return m.id;
  }, []);

  const updateRecoveryMaterial = useCallback((id, patch) => {
    setRecovery((p) => p.map((m) => m.id === id ? { ...m, ...patch } : m));
  }, []);

  const deleteRecoveryMaterial = useCallback((id) => {
    setRecovery((p) => p.filter((m) => m.id !== id));
  }, []);

  const advanceRecovery = useCallback((id, nextStage, note = "") => {
    setRecovery((p) =>
      addTimeline(p, id, nextStage, note || `Status updated to ${nextStage}`)
        .map((m) => m.id === id ? { ...m, status: nextStage } : m)
    );
    addNotification("recovery", `Material ${id} moved to ${nextStage}`);
  }, []);

  const claimAvailableWaste = useCallback((wasteId) => {
    let item = null;
    setAvailableWaste((prev) => {
      item = prev.find((w) => w.id === wasteId) || null;
      return item ? prev.filter((w) => w.id !== wasteId) : prev;
    });
    if (!item) return null;
    const m = {
      id: uid("REC"),
      name: item.name,
      type: item.type,
      qty: item.qty,
      source: item.source,
      reportedOn: now().split(",")[0],
      status: "Assigned",
      condition: item.condition,
      urgency: "Within 24 hours",
      location: item.location,
      notes: item.suitability,
      timeline: [
        { stage: "Reported", time: now(), note: `Listed by ${item.source}` },
        { stage: "Assigned", time: now(), note: "Claimed by recovery facility" },
      ],
    };
    setRecovery((p) => [m, ...p]);
    addNotification("recovery", `${item.name} claimed and set to Assigned`);
    return m.id;
  }, []);

  // ── Animal Feed Requests ─────────────────────────────────────────────────
  const createAnimalFeedReq = useCallback((data) => {
    const r = { ...data, id: uid("AFR"), requestedAt: now(), status: "Submitted",
      timeline: [{ stage: "Submitted", time: now(), note: "Request submitted" }] };
    setAnimalFeed((p) => [r, ...p]);
    addNotification("animalFeed", `Animal-feed request ${r.id} submitted`);
    return r.id;
  }, []);

  const advanceAnimalFeed = useCallback((id, nextStage, note = "") => {
    setAnimalFeed((p) =>
      addTimeline(p, id, nextStage, note || `Updated to ${nextStage}`)
        .map((r) => r.id === id ? { ...r, status: nextStage } : r)
    );
    addNotification("animalFeed", `Request ${id} updated to ${nextStage}`);
  }, []);

  const updateAnimalFeedReq = useCallback((id, patch) => {
    setAnimalFeed((p) => p.map((r) => r.id === id ? { ...r, ...patch } : r));
  }, []);

  const cancelAnimalFeedReq = useCallback((id) => {
    setAnimalFeed((p) =>
      addTimeline(p, id, "Cancelled", "Request cancelled by handler")
        .map((r) => r.id === id ? { ...r, status: "Cancelled" } : r)
    );
    addNotification("animalFeed", `Request ${id} was cancelled`);
  }, []);

  const deleteAnimalFeedReq = useCallback((id) => {
    setAnimalFeed((p) => p.filter((r) => r.id !== id));
  }, []);

  // ── Event Food Reports ───────────────────────────────────────────────────
  const createEventReport = useCallback((data) => {
    const r = { ...data, id: uid("EVT-RPT"), reportedAt: now(), status: "Reported",
      timeline: [{ stage: "Reported", time: now(), note: "Food reported by organizer" }] };
    setEventReports((p) => [r, ...p]);
    addNotification("events", `Event food report ${r.id} submitted`);
    return r.id;
  }, []);

  const updateEventReport = useCallback((id, patch) => {
    setEventReports((p) => p.map((r) => r.id === id ? { ...r, ...patch } : r));
  }, []);

  const deleteEventReport = useCallback((id) => {
    setEventReports((p) => p.filter((r) => r.id !== id));
  }, []);

  const advanceEventReport = useCallback((id, nextStage, note = "") => {
    setEventReports((p) =>
      addTimeline(p, id, nextStage, note || `Updated to ${nextStage}`)
        .map((r) => r.id === id ? { ...r, status: nextStage } : r)
    );
    addNotification("events", `Report ${id} updated to ${nextStage}`);
  }, []);

  const advanceVolunteerTask = useCallback((id, nextStage, note = "") => {
    setVolunteerTasks((p) =>
      addTimeline(p, id, nextStage, note || `Status updated to ${nextStage}`)
        .map((t) => t.id === id ? { ...t, status: nextStage } : t)
    );
    addNotification("volunteer", `Task ${id} updated to ${nextStage}`);
  }, []);

  const cancelVolunteerTask = useCallback((id) => {
    setVolunteerTasks((p) =>
      addTimeline(p, id, "Cancelled", "Task cancelled by volunteer")
        .map((t) => t.id === id ? { ...t, status: "Cancelled" } : t)
    );
    addNotification("volunteer", `Task ${id} was cancelled`);
  }, []);

  // ── Notifications ────────────────────────────────────────────────────────
  const addNotification = useCallback((role, text) => {
    const n = { id: uid("N"), role, text, time: "Just now", read: false };
    setNotifications((p) => [n, ...p.slice(0, 49)]);
  }, []);

  const markAllRead = useCallback((role) => {
    setNotifications((p) => p.map((n) => n.role === role ? { ...n, read: true } : n));
  }, []);

  const markRead = useCallback((id) => {
    setNotifications((p) => p.map((n) => n.id === id ? { ...n, read: true } : n));
  }, []);

  return (
    <AppContext.Provider value={{
      // data
      donations, ngoRequests, recoveryMaterials, availableWaste, animalFeedReqs, eventReports, volunteerTasks, notifications,
      // donation actions
      createDonation, updateDonation, deleteDonation, advanceDonation,
      DONATION_STAGES,
      // ngo request actions
      createNgoRequest, advanceNgoRequest, cancelNgoRequest, deleteNgoRequest,
      NGO_REQUEST_STAGES,
      // recovery actions
      createRecoveryMaterial, updateRecoveryMaterial, deleteRecoveryMaterial, advanceRecovery, claimAvailableWaste,
      RECOVERY_STAGES,
      // animal feed actions
      createAnimalFeedReq, updateAnimalFeedReq, advanceAnimalFeed, cancelAnimalFeedReq, deleteAnimalFeedReq,
      ANIMAL_FEED_STAGES,
      // event report actions
      createEventReport, updateEventReport, deleteEventReport, advanceEventReport,
      EVENT_REPORT_STAGES,
      // volunteer actions
      advanceVolunteerTask, cancelVolunteerTask,
      VOLUNTEER_STAGES,
      // notification actions
      addNotification, markAllRead, markRead,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
};

// ─── Reusable progress stepper (generic, works for any stage array) ──────────
export { DONATION_STAGES, NGO_REQUEST_STAGES, ANIMAL_FEED_STAGES, EVENT_REPORT_STAGES, RECOVERY_STAGES, VOLUNTEER_STAGES };
