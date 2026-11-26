import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faUserCircle, faCheck, faCheckDouble } from "@fortawesome/free-solid-svg-icons";
import { useApp } from "../context/AppContext";

const Navbar = ({ role }) => {
  const { notifications, markAllRead, markRead } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const roleNotifs = notifications.filter((n) => n.role === role || n.role === "all");
  const unread = roleNotifs.filter((n) => !n.read).length;

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const roleName = role === "animalFeed"
    ? "Animal Feed"
    : role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <div>
        <h2 className="text-lg font-bold text-gray-800">{roleName} Dashboard</h2>
        <p className="text-sm text-gray-500">Welcome back to FoodBridge</p>
      </div>

      <div className="flex items-center gap-5">
        {/* Notification Bell */}
        <div className="relative" ref={ref}>
          <button
            onClick={() => { setOpen((o) => !o); }}
            className="relative text-gray-500 hover:text-green-600 transition"
            aria-label="Notifications"
          >
            <FontAwesomeIcon icon={faBell} className="text-xl" />
            {unread > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <span className="font-bold text-gray-800 text-sm">Notifications</span>
                {unread > 0 && (
                  <button
                    onClick={() => markAllRead(role)}
                    className="text-xs text-green-600 font-semibold flex items-center gap-1 hover:underline"
                  >
                    <FontAwesomeIcon icon={faCheckDouble} />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                {roleNotifs.length === 0 ? (
                  <p className="text-center text-gray-400 text-sm py-6">No notifications</p>
                ) : (
                  roleNotifs.slice(0, 15).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markRead(n.id)}
                      className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition ${
                        n.read ? "opacity-60" : "bg-green-50/40"
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.read ? "bg-gray-300" : "bg-green-500"}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-700 leading-relaxed">{n.text}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
                      </div>
                      {!n.read && (
                        <FontAwesomeIcon icon={faCheck} className="text-green-400 text-xs flex-shrink-0 mt-1" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faUserCircle} className="text-3xl text-green-600" />
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-800">Demo User</p>
            <p className="text-xs text-gray-500">{roleName}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
