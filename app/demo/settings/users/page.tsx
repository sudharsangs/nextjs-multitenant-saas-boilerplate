"use client";

import React, { useState } from "react";
import { 
  UserPlus,
  Edit,
  UserMinus,
  AlertCircle
} from "lucide-react";

export default function UsersPage() {
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    message: string;
    type: 'success' | 'warning' | 'info';
  } | null>(null);
  
  // Mock function to add a new user (in a real app, this would call an API)
  const handleAddUser = () => {
    setModalContent({
      title: "Demo Mode",
      message: "In a real application, this would open a form to add a new user.",
      type: "info"
    });
    setShowModal(true);
  };

  // Mock function to edit a user (in a real app, this would navigate to an edit form)
  const handleEdit = (email: string) => {
    setModalContent({
      title: "Demo Mode",
      message: `In a real application, this would open an edit form for user: ${email}`,
      type: "info"
    });
    setShowModal(true);
  };
  
  // Mock function to deactivate a user (in a real app, this would call an API)
  const handleDeactivate = (email: string) => {
    setModalContent({
      title: "Demo Mode",
      message: `In a real application, this would deactivate the user: ${email}`,
      type: "warning"
    });
    setShowModal(true);
  };

  // Close modal handler
  const closeModal = () => {
    setShowModal(false);
    setModalContent(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Users</h1>
        <button
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 flex items-center gap-2"
          onClick={handleAddUser}
        >
          <UserPlus size={16} />
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
                      <button 
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        onClick={() => handleEdit("admin@example.com")}
                      >
                        <Edit size={14} />
                        Edit
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-800 flex items-center gap-1"
                        onClick={() => handleDeactivate("admin@example.com")}
                      >
                        <UserMinus size={14} />
                        Deactivate
                      </button>
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
                  <td className="py-2 px-4">Inventory</td>
                  <td className="py-2 px-4">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      Active
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        onClick={() => handleEdit("staff@example.com")}
                      >
                        <Edit size={14} />
                        Edit
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-800 flex items-center gap-1"
                        onClick={() => handleDeactivate("staff@example.com")}
                      >
                        <UserMinus size={14} />
                        Deactivate
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Demo Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 max-w-md w-full shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className={
                modalContent?.type === 'warning' ? 'text-amber-500' : 
                modalContent?.type === 'success' ? 'text-green-500' : 
                'text-blue-500'
              } />
              <h3 className="text-lg font-medium">{modalContent?.title}</h3>
            </div>
            <p className="mb-6">{modalContent?.message}</p>
            <div className="flex justify-end">
              <button
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}