"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  Plus,
  FileDown,
  Eye,
  MoreHorizontal,
  ClipboardList,
  ArrowUpDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card";

// Mock BOMs data
const mockBOMs = [
  {
    id: "bom1",
    productName: "Circuit Board Assembly",
    productCode: "CBX-001",
    version: "1.0",
    components: 8,
    createdAt: "2025-04-10",
    lastUpdated: "2025-05-02",
    status: "Active"
  },
  {
    id: "bom2",
    productName: "Power Supply Unit",
    productCode: "PSU-450",
    version: "2.3",
    components: 14,
    createdAt: "2025-03-15",
    lastUpdated: "2025-04-28",
    status: "Active"
  },
  {
    id: "bom3",
    productName: "LED Light Assembly",
    productCode: "LED-A20",
    version: "1.5",
    components: 6,
    createdAt: "2025-04-22",
    lastUpdated: "2025-04-22",
    status: "Active"
  },
  {
    id: "bom4",
    productName: "Control Panel",
    productCode: "CP-100",
    version: "3.0",
    components: 12,
    createdAt: "2025-02-10",
    lastUpdated: "2025-05-01",
    status: "Obsolete"
  },
  {
    id: "bom5",
    productName: "Enclosure Box",
    productCode: "EB-225",
    version: "1.2",
    components: 5,
    createdAt: "2025-04-18",
    lastUpdated: "2025-04-18",
    status: "Active"
  }
];

export default function BOMsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("productName");
  const [sortDirection, setSortDirection] = useState("asc");

  // Filter and sort BOMs
  const filteredBOMs = mockBOMs
    .filter((bom) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        bom.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bom.productCode.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus =
        statusFilter === "all" || bom.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const aValue = a[sortField as keyof typeof a];
      const bValue = b[sortField as keyof typeof b];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const renderSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return (
      <ArrowUpDown size={14} className={`ml-1 ${sortDirection === "desc" ? "transform rotate-180" : ""}`} />
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Bill of Materials</h1>
        <Button
          className="flex items-center gap-1"
          onClick={() => router.push("/manufacturing/boms/new")}
        >
          <Plus size={16} />
          Create BOM
        </Button>
      </div>
      
      {/* Filters */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter size={16} />
              Filters
            </CardTitle>
          </div>
          <CardDescription>Search and filter your bill of materials</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search BOMs..."
              className="w-full rounded-md border border-input bg-background pl-8 pr-3 py-2 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Status Filter */}
          <div>
            <label htmlFor="statusFilter" className="text-sm font-medium block mb-1">
              Status
            </label>
            <select
              id="statusFilter"
              className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="obsolete">Obsolete</option>
              <option value="draft">Draft</option>
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

      {/* BOMs Table */}
      {filteredBOMs.length > 0 ? (
        <div className="rounded-md border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr className="border-b">
                  <th 
                    className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide cursor-pointer"
                    onClick={() => handleSort("productName")}
                  >
                    <div className="flex items-center gap-1">
                      Product
                      {renderSortIcon("productName")}
                    </div>
                  </th>
                  <th 
                    className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide cursor-pointer"
                    onClick={() => handleSort("version")}
                  >
                    <div className="flex items-center gap-1">
                      Version
                      {renderSortIcon("version")}
                    </div>
                  </th>
                  <th 
                    className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide cursor-pointer"
                    onClick={() => handleSort("components")}
                  >
                    <div className="flex items-center gap-1">
                      Components
                      {renderSortIcon("components")}
                    </div>
                  </th>
                  <th 
                    className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide cursor-pointer"
                    onClick={() => handleSort("lastUpdated")}
                  >
                    <div className="flex items-center gap-1">
                      Last Updated
                      {renderSortIcon("lastUpdated")}
                    </div>
                  </th>
                  <th 
                    className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide"
                  >
                    Status
                  </th>
                  <th 
                    className="text-right py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBOMs.map((bom) => (
                  <tr key={bom.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="font-medium">{bom.productName}</div>
                      <div className="text-xs text-muted-foreground">{bom.productCode}</div>
                    </td>
                    <td className="py-3 px-4">{bom.version}</td>
                    <td className="py-3 px-4">{bom.components}</td>
                    <td className="py-3 px-4">
                      {new Date(bom.lastUpdated).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        bom.status === "Active" 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500'
                          : bom.status === "Obsolete"
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500'
                      }`}>
                        {bom.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => router.push(`/manufacturing/boms/${bom.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-lg shadow p-6">
          <div className="text-card-foreground">
            <p className="mb-4">Manage your bill of materials (BOMs) here.</p>
            <div className="border rounded-md p-8 text-center">
              <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No BOMs found</h3>
              <p className="text-muted-foreground mb-4">Get started by creating your first bill of materials.</p>
              <Button 
                onClick={() => router.push("/manufacturing/boms/new")}
                className="flex items-center mx-auto gap-1"
              >
                <Plus size={16} />
                Create BOM
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}