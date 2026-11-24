import React from "react";
import StatusBadge from "../../components/StatusBadge";

const users = [
  { id: 1, name: "Rahul Sharma",  email: "rahul@email.com",  role: "Donor",             joined: "01 Nov 2026", status: "Approved" },
  { id: 2, name: "Priya Nair",    email: "priya@ngo.org",    role: "NGO",               joined: "05 Nov 2026", status: "Approved" },
  { id: 3, name: "Amit Kumar",    email: "amit@vol.com",     role: "Volunteer",         joined: "10 Nov 2026", status: "Pending"  },
  { id: 4, name: "Sara Thomas",   email: "sara@events.com",  role: "Event Organizer",   joined: "15 Nov 2026", status: "Approved" },
  { id: 5, name: "John Alex",     email: "john@eco.in",      role: "Recovery Facility", joined: "18 Nov 2026", status: "Rejected" },
];

const AdminUsers = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
      <p className="text-gray-500 mt-1 mb-8">Review and manage all registered users.</p>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="p-4">#</th>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Joined</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 text-gray-400">{u.id}</td>
                  <td className="p-4 font-medium text-gray-800">{u.name}</td>
                  <td className="p-4 text-gray-500">{u.email}</td>
                  <td className="p-4">{u.role}</td>
                  <td className="p-4 text-gray-500">{u.joined}</td>
                  <td className="p-4"><StatusBadge status={u.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
