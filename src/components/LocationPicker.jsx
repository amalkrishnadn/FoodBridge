import React, { useState, useEffect, useRef, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faCrosshairs,
  faSearch,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";

/* ─── Indian states list ─────────────────────────────────────────── */
const STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Andaman and Nicobar Islands","Chandigarh","Dadra and Nagar Haveli",
  "Daman and Diu","Delhi","Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry",
];

/* ─── Default center: India ──────────────────────────────────────── */
const DEFAULT_LAT = 20.5937;
const DEFAULT_LNG = 78.9629;
const DEFAULT_ZOOM = 5;

/* ─── Map implementation using raw Leaflet (loaded lazily) ──────── */
let L = null; // will hold the Leaflet lib after lazy import

function LeafletMap({ lat, lng, zoom, onLocationSelect }) {
  const mapRef = useRef(null);
  const instanceRef = useRef(null);
  const markerRef = useRef(null);
  const [ready, setReady] = useState(false);

  /* Lazy-load Leaflet */
  useEffect(() => {
    if (L) { setReady(true); return; }
    import("leaflet").then((mod) => {
      L = mod.default || mod;
      // Fix default icon URLs (Vite asset hashing removes them)
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
      setReady(true);
    });
  }, []);

  /* Create map once Leaflet is available */
  useEffect(() => {
    if (!ready || !mapRef.current || instanceRef.current) return;

    const map = L.map(mapRef.current, { zoomControl: true }).setView(
      [lat || DEFAULT_LAT, lng || DEFAULT_LNG],
      lat ? 13 : DEFAULT_ZOOM
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    instanceRef.current = map;

    // Place initial marker if coords exist
    if (lat && lng) {
      markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(map);
      markerRef.current.on("dragend", (e) => {
        const { lat: la, lng: lo } = e.target.getLatLng();
        onLocationSelect(parseFloat(la.toFixed(6)), parseFloat(lo.toFixed(6)));
      });
    }

    // Click to place / move marker
    map.on("click", (e) => {
      const { lat: la, lng: lo } = e.latlng;
      const rounded = [parseFloat(la.toFixed(6)), parseFloat(lo.toFixed(6))];
      if (markerRef.current) {
        markerRef.current.setLatLng(rounded);
      } else {
        markerRef.current = L.marker(rounded, { draggable: true }).addTo(map);
        markerRef.current.on("dragend", (ev) => {
          const p = ev.target.getLatLng();
          onLocationSelect(parseFloat(p.lat.toFixed(6)), parseFloat(p.lng.toFixed(6)));
        });
      }
      onLocationSelect(...rounded);
    });

    return () => {
      map.remove();
      instanceRef.current = null;
      markerRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  /* Keep marker in sync when parent coords change */
  useEffect(() => {
    if (!instanceRef.current || !L) return;
    if (lat && lng) {
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(instanceRef.current);
        markerRef.current.on("dragend", (e) => {
          const p = e.target.getLatLng();
          onLocationSelect(parseFloat(p.lat.toFixed(6)), parseFloat(p.lng.toFixed(6)));
        });
      }
      instanceRef.current.setView([lat, lng], 14);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng]);

  if (!ready) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-100 rounded-xl text-gray-500 text-sm">
        Loading map…
      </div>
    );
  }

  return <div ref={mapRef} className="h-64 w-full rounded-xl z-0" style={{ minHeight: 256 }} />;
}

/* ─── Main LocationPicker component ─────────────────────────────── */
const LocationPicker = ({ value, onChange }) => {
  const [geoLoading, setGeoLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const loc = value || {
    address: "", state: "", district: "", city: "", pincode: "",
    lat: null, lng: null,
  };

  const update = (patch) => onChange({ ...loc, ...patch });

  /* Use current location */
  const useMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        update({ lat: parseFloat(pos.coords.latitude.toFixed(6)), lng: parseFloat(pos.coords.longitude.toFixed(6)) });
        setGeoLoading(false);
      },
      () => {
        alert("Unable to retrieve your location. Please allow location access.");
        setGeoLoading(false);
      }
    );
  };

  /* Nominatim search */
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&countrycodes=in`,
        { headers: { "Accept-Language": "en" } }
      );
      const data = await res.json();
      if (data.length > 0) {
        const { lat, lon, display_name } = data[0];
        update({ lat: parseFloat(parseFloat(lat).toFixed(6)), lng: parseFloat(parseFloat(lon).toFixed(6)), address: display_name });
      } else {
        alert("No results found for that search.");
      }
    } catch {
      alert("Search failed. Please check your connection.");
    }
  };

  const onMapClick = useCallback(
    (la, lo) => update({ lat: la, lng: lo }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loc]
  );

  const field = (label, name, type = "text", placeholder = "") => (
    <div>
      <label className="block text-gray-700 font-medium mb-1 text-sm">{label}</label>
      <input
        type={type}
        value={loc[name] || ""}
        onChange={(e) => update({ [name]: e.target.value })}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>
  );

  return (
    <div className="space-y-4 p-5 bg-green-50 rounded-xl border border-green-200">
      <h3 className="font-semibold text-gray-800 flex items-center gap-2">
        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-green-600" />
        Location Details
      </h3>

      {/* Text fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          {field("Full Address", "address", "text", "Street / area / locality")}
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm">State</label>
          <select
            value={loc.state || ""}
            onChange={(e) => update({ state: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select state</option>
            {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        {field("District", "district", "text", "e.g., Ernakulam")}
        {field("City / Town", "city", "text", "e.g., Kochi")}
        {field("PIN Code", "pincode", "text", "e.g., 682001")}
      </div>

      {/* Map search + GPS */}
      <div className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search a location on the map…"
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          type="button"
          onClick={handleSearch}
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 flex items-center gap-1"
        >
          <FontAwesomeIcon icon={faSearch} />
        </button>
        <button
          type="button"
          onClick={useMyLocation}
          disabled={geoLoading}
          className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 flex items-center gap-1 disabled:opacity-60"
        >
          <FontAwesomeIcon icon={faCrosshairs} />
          {geoLoading ? " Locating…" : " My Location"}
        </button>
      </div>

      {/* Map */}
      <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
        <LeafletMap lat={loc.lat} lng={loc.lng} zoom={13} onLocationSelect={onMapClick} />
      </div>

      {/* Coord display */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm">Latitude</label>
          <input
            type="number"
            value={loc.lat ?? ""}
            onChange={(e) => update({ lat: parseFloat(e.target.value) || null })}
            placeholder="Click map to set"
            step="any"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm">Longitude</label>
          <input
            type="number"
            value={loc.lng ?? ""}
            onChange={(e) => update({ lng: parseFloat(e.target.value) || null })}
            placeholder="Click map to set"
            step="any"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {loc.lat && loc.lng && (
        <p className="text-xs text-green-700 flex items-center gap-1">
          <FontAwesomeIcon icon={faInfoCircle} />
          Location selected: {loc.lat}, {loc.lng}
        </p>
      )}

      {!loc.lat && (
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <FontAwesomeIcon icon={faInfoCircle} />
          Click anywhere on the map or use "My Location" to set coordinates.
        </p>
      )}
    </div>
  );
};

export default LocationPicker;
