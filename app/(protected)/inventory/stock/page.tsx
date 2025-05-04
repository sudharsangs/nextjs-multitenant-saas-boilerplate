"use client";

import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  ArrowUpDown, 
  MoreHorizontal, 
  AlertCircle,
  ArrowRightLeft,
  FileDown,
  Boxes,
  PackageCheck,
  Clock,
  PackageX,
  Edit3,
  Warehouse
} from "lucide-react";
import Link from "next/link";

interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  productCode: string;
  locationId: string;
  locationName: string;
  locationType: 'WAREHOUSE' | 'FACTORY' | 'STORE';
  quantity: number;
  unit: 'PIECE' | 'KG' | 'LITER' | 'METER' | 'SQUARE_METER' | 'CUBIC_METER';
  status: 'AVAILABLE' | 'RESERVED' | 'DAMAGED' | 'QUARANTINED';
  lastMovedAt: string;
  lastCountedAt: string;
  expiryDate?: string;
}

export default function StockManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Dummy data for inventory
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: "1",
      productId: "1",
      productName: "Steel Bolts (10mm)",
      productCode: "SB-10MM",
      locationId: "1",
      locationName: "Main Warehouse",
      locationType: "WAREHOUSE",
      quantity: 5200,
      unit: "PIECE",
      status: "AVAILABLE",
      lastMovedAt: "2025-04-01T10:30:00Z",
      lastCountedAt: "2025-03-15T09:00:00Z"
    },
    {
      id: "2",
      productId: "2",
      productName: "Aluminum Sheet (2mm)",
      productCode: "AL-S2MM",
      locationId: "1",
      locationName: "Main Warehouse",
      locationType: "WAREHOUSE",
      quantity: 157,
      unit: "PIECE",
      status: "AVAILABLE",
      lastMovedAt: "2025-04-02T14:15:00Z",
      lastCountedAt: "2025-03-15T09:15:00Z"
    },
    {
      id: "3",
      productId: "3",
      productName: "Plastic Housing Type B",
      productCode: "PH-TYPB",
      locationId: "2",
      locationName: "Factory Floor",
      locationType: "FACTORY",
      quantity: 352,
      unit: "PIECE",
      status: "RESERVED",
      lastMovedAt: "2025-03-28T16:40:00Z",
      lastCountedAt: "2025-03-15T09:30:00Z"
    },
    {
      id: "4",
      productId: "4",
      productName: "Copper Wire (1.5mm)",
      productCode: "CW-1.5MM",
      locationId: "1",
      locationName: "Main Warehouse",
      locationType: "WAREHOUSE",
      quantity: 1500,
      unit: "METER",
      status: "AVAILABLE",
      lastMovedAt: "2025-03-25T11:20:00Z",
      lastCountedAt: "2025-03-15T09:45:00Z"
    },
    {
      id: "5",
      productId: "3",
      productName: "Plastic Housing Type B",
      productCode: "PH-TYPB",
      locationId: "3",
      locationName: "Retail Store",
      locationType: "STORE",
      quantity: 58,
      unit: "PIECE",
      status: "AVAILABLE",
      lastMovedAt: "2025-04-03T09:10:00Z",
      lastCountedAt: "2025-03-15T10:00:00Z"
    },
    {
      id: "6",
      productId: "5",
      productName: "Motor Assembly XL-5",
      productCode: "MA-XL5",
      locationId: "2",
      locationName: "Factory Floor",
      locationType: "FACTORY",
      quantity: 42,
      unit: "PIECE",
      status: "DAMAGED",
      lastMovedAt: "2025-03-29T08:45:00Z",
      lastCountedAt: "2025-03-15T10:15:00Z"
    },
  ]);

  // Dummy data for locations
  const locations = [
    { id: "1", name: "Main Warehouse", type: "WAREHOUSE" },
    { id: "2", name: "Factory Floor", type: "FACTORY" },
    { id: "3", name: "Retail Store", type: "STORE" },
  ];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleLocationFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLocation(e.target.value);
  };

  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
  };

  // Filter inventory based on filters
  const filteredInventory = inventory.filter((item) => {
    // Search term filter
    const matchesSearch = 
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.locationName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Location filter
    const matchesLocation = selectedLocation ? item.locationId === selectedLocation : true;
    
    // Status filter
    const matchesStatus = selectedStatus ? item.status === selectedStatus : true;
    
    return matchesSearch && matchesLocation && matchesStatus;
  });

  // Get inventory status counts
  const availableCount = inventory.filter(item => item.status === "AVAILABLE").length;
  const reservedCount = inventory.filter(item => item.status === "RESERVED").length;
  const damagedCount = inventory.filter(item => item.status === "DAMAGED").length;
  const quarantinedCount = inventory.filter(item => item.status === "QUARANTINED").length;

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  // Format unit for display
  const formatUnit = (unit: string) => {
    return unit.replace("_", " ").toLowerCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Stock Management</h2>
        <div className="flex items-center gap-2">
          <Link 
            href="/inventory/stock/transfer" 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background px-4 py-2 shadow-sm hover:bg-accent"
          >
            <ArrowRightLeft size={16} className="mr-2" />
            Transfer Stock
          </Link>
          <Link 
            href="/inventory/stock/count" 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background px-4 py-2 shadow-sm hover:bg-accent"
          >
            <PackageCheck size={16} className="mr-2" />
            Stock Count
          </Link>
          <Link 
            href="/inventory/stock/adjust" 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-10 py-2 px-4 hover:bg-primary/90"
          >
            <Edit3 size={16} className="mr-2" />
            Adjust Stock
          </Link>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search inventory..."
            className="w-full rounded-md border border-input bg-background pl-8 p-2 text-sm shadow-sm outline-none focus:border-primary"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            className="w-full sm:w-auto rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus:border-primary"
            value={selectedLocation}
            onChange={handleLocationFilter}
          >
            <option value="">All Locations</option>
            {locations.map(location => (
              <option key={location.id} value={location.id}>{location.name}</option>
            ))}
          </select>
          <select
            className="w-full sm:w-auto rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm outline-none focus:border-primary"
            value={selectedStatus}
            onChange={handleStatusFilter}
          >
            <option value="">All Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="RESERVED">Reserved</option>
            <option value="DAMAGED">Damaged</option>
            <option value="QUARANTINED">Quarantined</option>
          </select>
          <button className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm">
            <FileDown size={16} className="mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg shadow-sm p-4 border border-border">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Available</p>
            <Boxes size={18} className="text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-500">{availableCount}</p>
        </div>
        <div className="bg-card rounded-lg shadow-sm p-4 border border-border">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Reserved</p>
            <Clock size={18} className="text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-blue-500">{reservedCount}</p>
        </div>
        <div className="bg-card rounded-lg shadow-sm p-4 border border-border">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Damaged</p>
            <PackageX size={18} className="text-red-500" />
          </div>
          <p className="text-2xl font-bold text-red-500">{damagedCount}</p>
        </div>
        <div className="bg-card rounded-lg shadow-sm p-4 border border-border">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Quarantined</p>
            <AlertCircle size={18} className="text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-500">{quarantinedCount}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading inventory data...</p>
          </div>
        </div>
      ) : inventory.length === 0 ? (
        <div className="bg-card rounded-lg shadow-sm p-6 border border-border flex flex-col items-center justify-center text-center h-64">
          <AlertCircle size={40} className="text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No inventory found</h3>
          <p className="text-muted-foreground mb-4 max-w-md">Start by adding products to your inventory or create a new product.</p>
          <div className="flex gap-3">
            <Link 
              href="/inventory/stock/adjust"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground h-10 py-2 px-4 hover:bg-primary/90"
            >
              <Plus size={16} className="mr-2" />
              Add Inventory
            </Link>
            <Link 
              href="/inventory/products/new"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background px-4 py-2 shadow-sm hover:bg-accent"
            >
              <Plus size={16} className="mr-2" />
              Add Product
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    <div className="flex items-center">
                      Product
                      <button className="ml-1">
                        <ArrowUpDown size={14} />
                      </button>
                    </div>
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    <div className="flex items-center">
                      Location
                      <button className="ml-1">
                        <ArrowUpDown size={14} />
                      </button>
                    </div>
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    <div className="flex items-center">
                      Status
                      <button className="ml-1">
                        <ArrowUpDown size={14} />
                      </button>
                    </div>
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    <div className="flex items-center">
                      Quantity
                      <button className="ml-1">
                        <ArrowUpDown size={14} />
                      </button>
                    </div>
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    <div className="flex items-center">
                      Last Moved
                      <button className="ml-1">
                        <ArrowUpDown size={14} />
                      </button>
                    </div>
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    <div className="flex items-center">
                      Last Counted
                      <button className="ml-1">
                        <ArrowUpDown size={14} />
                      </button>
                    </div>
                  </th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => (
                  <tr key={item.id} className="border-t border-border hover:bg-muted/50">
                    <td className="p-4 text-sm">
                      <div className="flex items-center">
                        <Link 
                          href={`/inventory/products/${item.productId}`} 
                          className="font-medium text-foreground hover:underline"
                        >
                          {item.productName}
                        </Link>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{item.productCode}</p>
                    </td>
                    <td className="p-4 text-sm">
                      <Link 
                        href={`/locations/${item.locationId}`}
                        className="flex items-center text-muted-foreground hover:text-foreground"
                      >
                        <Warehouse size={14} className="mr-1" />
                        {item.locationName}
                        <span className="ml-1.5 px-1.5 py-0.5 text-xs bg-muted-foreground/20 rounded">
                          {item.locationType}
                        </span>
                      </Link>
                    </td>
                    <td className="p-4 text-sm">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                        ${item.status === 'AVAILABLE' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
                        ${item.status === 'RESERVED' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                        ${item.status === 'DAMAGED' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : ''}
                        ${item.status === 'QUARANTINED' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' : ''}
                      `}>
                        {item.status === 'AVAILABLE' && <Boxes size={12} className="mr-1" />}
                        {item.status === 'RESERVED' && <Clock size={12} className="mr-1" />}
                        {item.status === 'DAMAGED' && <PackageX size={12} className="mr-1" />}
                        {item.status === 'QUARANTINED' && <AlertCircle size={12} className="mr-1" />}
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm">
                      <span className="font-medium">
                        {item.quantity} {formatUnit(item.unit)}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {formatDate(item.lastMovedAt)}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {formatDate(item.lastCountedAt)}
                    </td>
                    <td className="p-4 text-sm text-right">
                      <div className="flex justify-end">
                        <Link 
                          href={`/inventory/stock/edit/${item.id}`}
                          className="text-muted-foreground hover:text-foreground mr-4"
                        >
                          Edit
                        </Link>
                        <button className="text-muted-foreground hover:text-foreground">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Showing <strong>{filteredInventory.length}</strong> of{" "}
              <strong>{inventory.length}</strong> inventory records
            </p>
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm" disabled>
                Previous
              </button>
              <button className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm" disabled>
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}