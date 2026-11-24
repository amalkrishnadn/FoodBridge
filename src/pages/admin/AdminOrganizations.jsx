import React from "react";
import StatusBadge from "../../components/StatusBadge";

const organizations = [
  { id: 1, name: "Hope NGO",         type: "NGO",              contact: "hope@ngo.org",      status: "Approved"  },
  { id: 2, name: "Green Events Co",  type: "Event Organizer",  contact: "green@events.com",  status: "Pending"   },
  { id: 3, name: "EcoRecovery Ltd",  type: "Recovery Facility", contact: "eco@recovery.in",  status: "Approved"  },
  { id: 4, name: "Care Centre NGO",  type: "NGO",              contact: "care@centre.org",   status: "Rejected"  },
];

const AdminOrganizations = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Organization Management</h1>
      <p className="text-gray-500 mt-1 mb-8">Review and manage all registered organizations.</p>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="p-4">#</th>
                <th className="p-4">Name</th>
                <th className="p-4">Type</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {organizations.map((org) => (
                <tr key={org.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 text-gray-400">{org.id}</td>
                  <td className="p-4 font-medium text-gray-800">{org.name}</td>
                  <td className="p-4">{org.type}</td>
                  <td className="p-4 text-gray-500">{org.contact}</td>
                  <td className="p-4"><StatusBadge status={org.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrganizations;
