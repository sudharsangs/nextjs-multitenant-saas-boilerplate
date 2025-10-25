import React from "react";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Users</h1>
        <button
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
        >
          Add User
        </button>
      </div>
      
      <div className="bg-card rounded-lg shadow p-6">
        <div className="text-card-foreground">
          <p className="mb-4">Manage users and their permissions here.</p>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4">Name</th>
                  <th className="text-left py-2 px-4">Email</th>
                  <th className="text-left py-2 px-4">Role</th>
                  <th className="text-left py-2 px-4">Department</th>
                  <th className="text-left py-2 px-4">Status</th>
                  <th className="text-left py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 px-4">Admin User</td>
                  <td className="py-2 px-4">admin@example.com</td>
                  <td className="py-2 px-4">
                    <span className="bg-primary/20 text-primary px-2 py-1 rounded-full text-xs">
                      Admin
                    </span>
                  </td>
                  <td className="py-2 px-4">Management</td>
                  <td className="py-2 px-4">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      Active
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">Edit</button>
                      <button className="text-red-600 hover:text-red-800">Deactivate</button>
                    </div>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-4">Staff User</td>
                  <td className="py-2 px-4">staff@example.com</td>
                  <td className="py-2 px-4">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      Staff
                    </span>
                  </td>
                  <td className="py-2 px-4">Operations</td>
                  <td className="py-2 px-4">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      Active
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">Edit</button>
                      <button className="text-red-600 hover:text-red-800">Deactivate</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
