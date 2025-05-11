"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
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
  inventoryCount?: number;
}

export default function LocationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [locationInventory, setLocationInventory] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch('/api/v1/locations');
        if (!response.ok) throw new Error('Failed to fetch locations');
        const data = await response.json();
        setLocations(data);

        // Fetch inventory counts for each location
        const inventoryCounts: Record<string, number> = {};
        await Promise.all(data.map(async (location: Location) => {
          const invResponse = await fetch(`/api/v1/locations/inventory?locationId=${location.id}`);
          if (invResponse.ok) {
            const invData = await invResponse.json();
            inventoryCounts[location.id] = invData.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0);
          }
        }));
        setLocationInventory(inventoryCounts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load locations');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, []);

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
        return <Warehouse className="h-5 w-5 text-blue-500" />;
      case "FACTORY":
        return <Building className="h-5 w-5 text-purple-500" />;
      case "STORE":
        return <Store className="h-5 w-5 text-green-500" />;
      default:
        return <MapPin className="h-5 w-5 text-gray-500" />;
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Error loading locations</h2>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-10 py-2 px-4 hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
        <div className="relative w-full sm:w-80">
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
                    <h3 className="text-lg font-medium ml-2">{location.name}</h3>
                  </div>
                  <Link
                    href={`/locations/${location.id}/edit`}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <MoreHorizontal size={16} />
                  </Link>
                </div>
                
                <div className="mt-4 space-y-2 text-sm">
                  <p>{location.address}</p>
                  <p>{location.city}, {location.state} {location.pincode}</p>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Inventory Items</span>
                    <span className="font-medium">{locationInventory[location.id] || 0}</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-auto p-4 bg-muted/40 border-t border-border">
                <Link
                  href={`/inventory/stock?location=${location.id}`}
                  className="text-sm text-primary hover:underline"
                >
                  View Inventory
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}