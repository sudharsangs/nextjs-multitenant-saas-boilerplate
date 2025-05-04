"use client";

import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown, 
  MoreHorizontal, 
  AlertCircle, 
  MapPin,
  FileDown,
  Building,
  Warehouse,
  Store
} from "lucide-react";
import Link from "next/link";

interface Location {
  id: string;
  name: string;
  type: 'WAREHOUSE' | 'FACTORY' | 'STORE';
  address: string;
  city: string;
  state: string;
  pincode: string;
  inventoryCount: number;
}

export default function LocationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Dummy data for locations
  const [locations, setLocations] = useState<Location[]>([
    { 
      id: "1", 
      name: "Main Warehouse", 
      type: "WAREHOUSE",
      address: "123 Storage Lane",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      inventoryCount: 32
    },
    { 
      id: "2", 
      name: "Factory Floor", 
      type: "FACTORY",
      address: "456 Production Road",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411001",
      inventoryCount: 18
    },
    { 
      id: "3", 
      name: "Warehouse B", 
      type: "WAREHOUSE",
      address: "789 Distribution Blvd",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001",
      inventoryCount: 26
    },
    { 
      id: "4", 
      name: "Retail Store", 
      type: "STORE",
      address: "101 Main Street",
      city: "Delhi",
      state: "Delhi",
      pincode: "110001",
      inventoryCount: 8
    },
  ]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Filter locations based on search term
  const filteredLocations = locations.filter((location) => 
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.pincode.includes(searchTerm)
  );

  // Get location type icon
  const getLocationIcon = (type: string) => {
    switch(type) {
      case "WAREHOUSE":
        return <Warehouse size={16} className="mr-2 text-blue-600" />;
      case "FACTORY":
        return <Building size={16} className="mr-2 text-amber-600" />;
      case "STORE":
        return <Store size={16} className="mr-2 text-green-600" />;
      default:
        return <MapPin size={16} className="mr-2 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Locations</h2>
        <div className="flex items-center gap-2">
          <Link 
            href="/locations/new" 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-10 py-2 px-4 hover:bg-primary/90"
          >
            <Plus size={16} className="mr-2" />
            Add Location
          </Link>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search locations..."
            className="w-full rounded-md border border-input bg-background pl-8 p-2 text-sm shadow-sm outline-none focus:border-primary"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm">
            <Filter size={16} className="mr-2" />
            Filter
          </button>
          <button className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm">
            <FileDown size={16} className="mr-2" />
            Export
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading locations...</p>
          </div>
        </div>
      ) : locations.length === 0 ? (
        <div className="bg-card rounded-lg shadow-sm p-6 border border-border flex flex-col items-center justify-center text-center h-64">
          <AlertCircle size={40} className="text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No locations found</h3>
          <p className="text-muted-foreground mb-4 max-w-md">Start by adding warehouses, factories, or retail stores.</p>
          <Link 
            href="/locations/new"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-10 py-2 px-4 hover:bg-primary/90"
          >
            <Plus size={16} className="mr-2" />
            Add Your First Location
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLocations.map((location) => (
            <div 
              key={location.id} 
              className="bg-card rounded-lg shadow-sm border border-border overflow-hidden flex flex-col h-full"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getLocationIcon(location.type)}
                    <h3 className="text-lg font-medium">{location.name}</h3>
                  </div>
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-foreground">
                      {location.type}
                    </span>
                  </div>
                </div>
                <div className="mt-4 text-sm">
                  <p className="text-muted-foreground">{location.address}</p>
                  <p className="text-muted-foreground">
                    {location.city}, {location.state} - {location.pincode}
                  </p>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Inventory Items</span>
                    <Link 
                      href={`/inventory/stock?locationId=${location.id}`}
                      className="text-sm text-primary hover:underline"
                    >
                      {location.inventoryCount} items
                    </Link>
                  </div>
                </div>
              </div>
              <div className="mt-auto p-4 border-t border-border bg-muted/50">
                <div className="flex items-center justify-between">
                  <Link 
                    href={`/locations/${location.id}`}
                    className="text-sm text-primary hover:underline"
                  >
                    View Details
                  </Link>
                  <div className="flex items-center space-x-2">
                    <Link 
                      href={`/locations/${location.id}/edit`}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      Edit
                    </Link>
                    <button className="text-sm text-muted-foreground hover:text-foreground">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Map View */}
      <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="text-lg font-medium">Location Map</h3>
          <button className="text-sm text-muted-foreground hover:text-foreground">
            Expand View
          </button>
        </div>
        <div className="h-96 bg-muted flex items-center justify-center">
          <div className="text-center">
            <MapPin size={32} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Map view is not available in this demo</p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
          <div className="flex items-center">
            <Warehouse size={18} className="mr-2 text-blue-600" />
            <h3 className="text-lg font-medium">Warehouses</h3>
          </div>
          <p className="text-3xl font-bold mt-2">
            {locations.filter(loc => loc.type === 'WAREHOUSE').length}
          </p>
          <p className="text-sm text-muted-foreground mt-1">Storage locations</p>
        </div>
        <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
          <div className="flex items-center">
            <Building size={18} className="mr-2 text-amber-600" />
            <h3 className="text-lg font-medium">Factories</h3>
          </div>
          <p className="text-3xl font-bold mt-2">
            {locations.filter(loc => loc.type === 'FACTORY').length}
          </p>
          <p className="text-sm text-muted-foreground mt-1">Manufacturing units</p>
        </div>
        <div className="bg-card rounded-lg shadow-sm p-6 border border-border">
          <div className="flex items-center">
            <Store size={18} className="mr-2 text-green-600" />
            <h3 className="text-lg font-medium">Stores</h3>
          </div>
          <p className="text-3xl font-bold mt-2">
            {locations.filter(loc => loc.type === 'STORE').length}
          </p>
          <p className="text-sm text-muted-foreground mt-1">Retail locations</p>
        </div>
      </div>
    </div>
  );
}