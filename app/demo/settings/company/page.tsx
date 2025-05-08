import React from "react";

export default function CompanySettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Company Settings</h1>
        <button
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
        >
          Save Changes
        </button>
      </div>
      
      <div className="bg-card rounded-lg shadow p-6">
        <div className="text-card-foreground">
          <p className="mb-4">Manage your company details and preferences.</p>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Company Name</label>
                <input 
                  type="text" 
                  id="name" 
                  className="w-full border border-input rounded-md p-2" 
                  placeholder="Enter company name"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="gstin" className="text-sm font-medium">GSTIN</label>
                <input 
                  type="text" 
                  id="gstin" 
                  className="w-full border border-input rounded-md p-2" 
                  placeholder="Enter GSTIN"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-medium">Address</label>
              <textarea 
                id="address" 
                className="w-full border border-input rounded-md p-2" 
                placeholder="Enter company address"
                rows={3}
              ></textarea>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label htmlFor="city" className="text-sm font-medium">City</label>
                <input 
                  type="text" 
                  id="city" 
                  className="w-full border border-input rounded-md p-2" 
                  placeholder="Enter city"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="state" className="text-sm font-medium">State</label>
                <input 
                  type="text" 
                  id="state" 
                  className="w-full border border-input rounded-md p-2" 
                  placeholder="Enter state"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="pincode" className="text-sm font-medium">Pincode</label>
                <input 
                  type="text" 
                  id="pincode" 
                  className="w-full border border-input rounded-md p-2" 
                  placeholder="Enter pincode"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full border border-input rounded-md p-2" 
                  placeholder="Enter email"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                <input 
                  type="text" 
                  id="phone" 
                  className="w-full border border-input rounded-md p-2" 
                  placeholder="Enter phone"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}