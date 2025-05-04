"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  FileDown,
  Box,
  AlertCircle
} from "lucide-react";
import { Header } from "@/components/shared/header";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent
} from "@/components/ui/card";

// Mock inventory data
const mockInventory = [
  { 
    id: "inv1", 
    productId: "prod1",
    productName: "Steel Bolts (10mm)", 
    productCode: "STL-B10",
    category: "Raw Materials",
    locations: [
      { locationId: "loc1", locationName: "Main Warehouse", quantity: 1500 },
      { locationId: "loc2", locationName: "Factory Floor", quantity: 850 },
      { locationId: "loc3", locationName: "Assembly Area", quantity: 150 },
    ],
    totalStock: 2500,
    unit: "PIECE",
    reorderPoint: 500,
    costPrice: 1.50
  },
  { 
    id: "inv2", 
    productId: "prod2",
    productName: "Aluminum Sheet (2mm)", 
    productCode: "ALU-S2",
    category: "Raw Materials",
    locations: [
      { locationId: "loc1", locationName: "Main Warehouse", quantity: 150 },
    ],
    totalStock: 150,
    unit: "PIECE",
    reorderPoint: 50,
    costPrice: 35.75
  },
  { 
    id: "inv3", 
    productId: "prod3",
    productName: "Plastic Housing Type B", 
    productCode: "PLT-HB",
    category: "Packaging Materials",
    locations: [
      { locationId: "loc1", locationName: "Main Warehouse", quantity: 250 },
      { locationId: "loc4", locationName: "Packaging Station", quantity: 70 },
    ],
    totalStock: 320,
    unit: "PIECE",
    reorderPoint: 100,
    costPrice: 12.25
  },
  { 
    id: "inv4", 
    productId: "prod4",
    productName: "Circuit Board X1", 
    productCode: "CBX-001",
    category: "Electrical Components",
    locations: [
      { locationId: "loc1", locationName: "Main Warehouse", quantity: 25 },
      { locationId: "loc5", locationName: "Electronics Lab", quantity: 50 },
    ],
    totalStock: 75,
    unit: "PIECE",
    reorderPoint: 25,
    costPrice: 45.00
  },
  { 
    id: "inv5", 
    productId: "prod5",
    productName: "LED Bulbs 5W", 
    productCode: "LED-B5W",
    category: "Electrical Components",
    locations: [
      { locationId: "loc1", locationName: "Main Warehouse", quantity: 350 },
      { locationId: "loc5", locationName: "Electronics Lab", quantity: 100 },
    ],
    totalStock: 450,
    unit: "PIECE",
    reorderPoint: 100,
    costPrice: 3.25
  },
  { 
    id: "inv6", 
    productId: "prod6",
    productName: "Stainless Steel Screws", 
    productCode: "SSS-001",
    category: "Raw Materials",
    locations: [
      { locationId: "loc1", locationName: "Main Warehouse", quantity: 4000 },
      { locationId: "loc2", locationName: "Factory Floor", quantity: 800 },
      { locationId: "loc3", locationName: "Assembly Area", quantity: 200 },
    ],
    totalStock: 5000,
    unit: "PIECE",
    reorderPoint: 1000,
    costPrice: 0.25
  },
  { 
    id: "inv7", 
    productId: "prod7",
    productName: "Thermal Paste", 
    productCode: "TP-100",
    category: "Electrical Components",
    locations: [
      { locationId: "loc1", locationName: "Main Warehouse", quantity: 15 },
      { locationId: "loc5", locationName: "Electronics Lab", quantity: 30 },
    ],
    totalStock: 45,
    unit: "PIECE",
    reorderPoint: 20,
    costPrice: 8.00
  },
  { 
    id: "inv8", 
    productId: "prod8",
    productName: "Circuit Board X2", 
    productCode: "CBX-002",
    category: "Electrical Components",
    locations: [],
    totalStock: 0,
    unit: "PIECE",
    reorderPoint: 15,
    costPrice: 65.00
  },
];

// Filter options
const categoryFilters = [
  "All Categories",
  "Raw Materials",
  "Finished Goods",
  "Packaging Materials",
  "Electrical Components",
  "Mechanical Parts",
];

const locationFilters = [
  "All Locations",
  "Main Warehouse",
  "Factory Floor",
  "Assembly Area",
  "Packaging Station",
  "Electronics Lab",
];

const stockStatusFilters = [
  "All Statuses",
  "In Stock",
  "Low Stock",
  "Out of Stock",
];

export default function InventoryStockPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedStockStatus, setSelectedStockStatus] = useState("All Statuses");
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState("productName");
  const [sortDirection, setSortDirection] = useState("asc");
  
  // Calculate total inventory value
  const totalInventoryValue = mockInventory.reduce((sum, item) => {
    return sum + (item.totalStock * item.costPrice);
  }, 0);

  // Calculate counts for KPI cards
  const lowStockCount = mockInventory.filter(item => 
    item.totalStock > 0 && item.totalStock <= item.reorderPoint
  ).length;
  
  const outOfStockCount = mockInventory.filter(item => 
    item.totalStock === 0
  ).length;

  // Filter and sort inventory
  const filteredInventory = mockInventory
    .filter((item) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.productCode.toLowerCase().includes(searchQuery.toLowerCase());

      // Category filter
      const matchesCategory =
        selectedCategory === "All Categories" || item.category === selectedCategory;
      
      // Location filter
      const matchesLocation =
        selectedLocation === "All Locations" || 
        item.locations.some(loc => loc.locationName === selectedLocation);
      
      // Stock status filter
      const matchesStockStatus =
        selectedStockStatus === "All Statuses" ||
        (selectedStockStatus === "In Stock" && item.totalStock > item.reorderPoint) ||
        (selectedStockStatus === "Low Stock" && item.totalStock > 0 && item.totalStock <= item.reorderPoint) ||
        (selectedStockStatus === "Out of Stock" && item.totalStock === 0);

      return matchesSearch && matchesCategory && matchesLocation && matchesStockStatus;
    })
    .sort((a, b) => {
      // Sort by selected field
      if (sortField === "totalStock" || sortField === "reorderPoint" || sortField === "costPrice") {
        return sortDirection === "asc" 
          ? a[sortField] - b[sortField] 
          : b[sortField] - a[sortField];
      } else {
        // Sort alphabetically for other fields
        const valueA = String(a[sortField]).toLowerCase();
        const valueB = String(b[sortField]).toLowerCase();
        return sortDirection === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
    });

  const handleSort = (field: string) => {
    if (sortField === field) {
      // Toggle sort direction if clicking the same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new sort field and reset direction to ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const renderSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown size={14} />;
    return sortDirection === "asc" ? (
      <ArrowUpDown size={14} className="text-primary" />
    ) : (
      <ArrowUpDown size={14} className="text-primary rotate-180" />
    );
  };

  const toggleRowExpansion = (productId: string) => {
    const newExpandedProducts = new Set(expandedProducts);
    
    if (newExpandedProducts.has(productId)) {
      newExpandedProducts.delete(productId);
    } else {
      newExpandedProducts.add(productId);
    }
    
    setExpandedProducts(newExpandedProducts);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold">Inventory Stock</h1>
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search products..."
                className="w-full rounded-md border border-input bg-background pl-8 pr-3 py-2 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="flex gap-1"
              onClick={() => router.push("/inventory/stock/count")}
            >
              <Box size={16} />
              Stock Count
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <CardTitle className="text-sm font-medium">Total Inventory Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹ {totalInventoryValue.toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Based on cost price
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-500">{lowStockCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Items below reorder point
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <CardTitle className="text-sm font-medium">Out of Stock Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{outOfStockCount}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Items with zero stock
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Filter size={16} />
                Filters
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedCategory("All Categories");
                  setSelectedLocation("All Locations");
                  setSelectedStockStatus("All Statuses");
                  setSearchQuery("");
                }}
              >
                Reset
              </Button>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label htmlFor="categoryFilter" className="text-sm font-medium block mb-1">
                Category
              </label>
              <select
                id="categoryFilter"
                className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categoryFilters.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Location Filter */}
            <div>
              <label htmlFor="locationFilter" className="text-sm font-medium block mb-1">
                Location
              </label>
              <select
                id="locationFilter"
                className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                {locationFilters.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            {/* Stock Status Filter */}
            <div>
              <label htmlFor="stockStatusFilter" className="text-sm font-medium block mb-1">
                Stock Status
              </label>
              <select
                id="stockStatusFilter"
                className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm"
                value={selectedStockStatus}
                onChange={(e) => setSelectedStockStatus(e.target.value)}
              >
                {stockStatusFilters.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Export Button */}
            <div className="flex items-end gap-2 justify-end">
              <Button variant="outline" size="sm" className="flex gap-1">
                <FileDown size={14} />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Table */}
        <div className="rounded-md border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr className="border-b">
                  <th className="w-10 p-3"></th>
                  <th 
                    className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide cursor-pointer"
                    onClick={() => handleSort("productName")}
                  >
                    <div className="flex items-center gap-1">
                      Product Name
                      {renderSortIcon("productName")}
                    </div>
                  </th>
                  <th 
                    className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide cursor-pointer"
                    onClick={() => handleSort("productCode")}
                  >
                    <div className="flex items-center gap-1">
                      SKU/Code
                      {renderSortIcon("productCode")}
                    </div>
                  </th>
                  <th 
                    className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide cursor-pointer"
                    onClick={() => handleSort("category")}
                  >
                    <div className="flex items-center gap-1">
                      Category
                      {renderSortIcon("category")}
                    </div>
                  </th>
                  <th 
                    className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide cursor-pointer"
                    onClick={() => handleSort("totalStock")}
                  >
                    <div className="flex items-center gap-1">
                      Total Stock
                      {renderSortIcon("totalStock")}
                    </div>
                  </th>
                  <th 
                    className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide cursor-pointer"
                    onClick={() => handleSort("reorderPoint")}
                  >
                    <div className="flex items-center gap-1">
                      Reorder Point
                      {renderSortIcon("reorderPoint")}
                    </div>
                  </th>
                  <th 
                    className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide cursor-pointer"
                    onClick={() => handleSort("unit")}
                  >
                    <div className="flex items-center gap-1">
                      Unit
                      {renderSortIcon("unit")}
                    </div>
                  </th>
                  <th 
                    className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide cursor-pointer"
                    onClick={() => handleSort("costPrice")}
                  >
                    <div className="flex items-center gap-1">
                      Cost Price
                      {renderSortIcon("costPrice")}
                    </div>
                  </th>
                  <th 
                    className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide"
                  >
                    Value
                  </th>
                  <th 
                    className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center py-8 text-muted-foreground">
                      <div className="flex flex-col items-center justify-center">
                        <Box size={40} className="mb-2 text-muted-foreground" />
                        <p>No inventory items found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredInventory.map((item) => {
                    const isExpanded = expandedProducts.has(item.productId);
                    const locationRows = isExpanded ? item.locations : [];
                    const isLowStock = item.totalStock > 0 && item.totalStock <= item.reorderPoint;
                    const isOutOfStock = item.totalStock === 0;
                    
                    return (
                      <React.Fragment key={item.productId}>
                        <tr className={`border-b ${isExpanded ? "bg-muted/30" : "hover:bg-muted/50"}`}>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => toggleRowExpansion(item.productId)}
                              className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
                            >
                              <span className="sr-only">Toggle locations</span>
                              {isExpanded ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M5 12h14"></path>
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M5 12h14"></path>
                                  <path d="M12 5v14"></path>
                                </svg>
                              )}
                            </button>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium">
                              {isLowStock || isOutOfStock ? (
                                <div className="flex items-center gap-1">
                                  {item.productName}
                                  <AlertCircle
                                    size={16}
                                    className={isOutOfStock ? "text-destructive" : "text-amber-500"}
                                  />
                                </div>
                              ) : (
                                item.productName
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {item.productCode}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {item.category}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <div className={
                              isOutOfStock
                                ? "text-destructive font-medium"
                                : isLowStock
                                ? "text-amber-500 font-medium"
                                : ""
                            }>
                              {item.totalStock.toLocaleString()}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {item.reorderPoint.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {item.unit === "PIECE" ? "Piece" : item.unit}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            ₹ {item.costPrice.toLocaleString('en-IN', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            ₹ {(item.totalStock * item.costPrice).toLocaleString('en-IN', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}
                          </td>
                          <td className="py-3 px-4">
                            <div className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                              ${!isLowStock && !isOutOfStock ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400" : ""}
                              ${isLowStock ? "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400" : ""}
                              ${isOutOfStock ? "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400" : ""}
                            `}>
                              {isOutOfStock ? "Out of Stock" : isLowStock ? "Low Stock" : "In Stock"}
                            </div>
                          </td>
                        </tr>
                        {isExpanded && locationRows.map((location) => (
                          <tr 
                            key={`${item.productId}-${location.locationId}`}
                            className="border-b bg-muted/10"
                          >
                            <td className="p-3"></td>
                            <td colSpan={3} className="py-2 px-4">
                              <div className="text-sm text-muted-foreground pl-4 border-l-2 border-border">
                                {location.locationName}
                              </div>
                            </td>
                            <td className="py-2 px-4 text-sm">
                              {location.quantity.toLocaleString()}
                            </td>
                            <td colSpan={5}></td>
                          </tr>
                        ))}
                      </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          
          {/* Simple Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {filteredInventory.length} of {mockInventory.length} items
            </div>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}