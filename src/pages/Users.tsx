import React, { useState } from "react";
import { Pencil, XCircle } from "lucide-react";

type User = {
  id: number;
  photo: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
  about: string;
  address: string;
};

const initialUsers: User[] = [
  {
    id: 1,
    photo: "john.jpg",
    name: "John Doe",
    email: "john@example.com",
    phone: "+123456789",
    status: "active",
    about: "Admin of the resort",
    address: "123 Resort Street, Paradise",
  },
  {
    id: 2,
    photo: "jane.jpg",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+987654321",
    status: "inactive",
    about: "Handles bookings",
    address: "456 Villa Avenue, Seaside",
  },
];

const Users = () => {
  const [users, setUsers] = useState(initialUsers);
  const [editUser, setEditUser] = useState<User | null>(null);

  const handleEditClick = (user: User) => {
    setEditUser(user);
  };

  const handleSaveChanges = () => {
    setUsers((prev) =>
      prev.map((usr) => (usr.id === editUser?.id ? editUser : usr))
    );
    setEditUser(null);
  };

  return (
    <div className="space-y-6 pb-16">
      <h1 className="text-2xl font-bold text-gray-900">Users</h1>
      <p className="text-sm text-gray-500">
        Manage admin users and their roles in the system.
      </p>

      {/* Users Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <img src={user.photo} alt={user.name} className="h-10 w-10 rounded-full" />
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.phone}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block h-3 w-3 rounded-full ${
                    user.status === "active" ? "bg-green-500" : "bg-red-500"
                  }`} />
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => handleEditClick(user)} className="text-blue-600 hover:text-blue-800">
                    <Pencil className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit User Modal */}
      {editUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Edit User</h2>
              <button onClick={() => setEditUser(null)} className="text-red-500 hover:text-red-700">
                <XCircle className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="text-gray-700">Name</span>
                <input
                  type="text"
                  value={editUser.name}
                  onChange={(e) =>
                    setEditUser({ ...editUser, name: e.target.value })
                  }
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Email</span>
                <input
                  type="text"
                  value={editUser.email}
                  onChange={(e) =>
                    setEditUser({ ...editUser, email: e.target.value })
                  }
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Phone</span>
                <input
                  type="text"
                  value={editUser.phone}
                  onChange={(e) =>
                    setEditUser({ ...editUser, phone: e.target.value })
                  }
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">About</span>
                <textarea
                  value={editUser.about}
                  onChange={(e) =>
                    setEditUser({ ...editUser, about: e.target.value })
                  }
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
                />
              </label>
              <label className="block">
                <span className="text-gray-700">Address</span>
                <input
                  type="text"
                  value={editUser.address}
                  onChange={(e) =>
                    setEditUser({ ...editUser, address: e.target.value })
                  }
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm"
                />
              </label>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleSaveChanges}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;