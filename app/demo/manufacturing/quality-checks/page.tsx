"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  CheckCircle,
  XCircle, 
  AlertTriangle,
  FileDown,
  Eye,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card";

// Mock quality checks data
const mockQualityChecks = [
  {
    id: "qc001",
    productName: "Circuit Board Assembly",
    productCode: "CBX-001",
    batchNo: "B20250509-01",
    checkedOn: "2025-05-08",
    checkedBy: "John Smith",
    status: "Passed",
    remarks: "All tests passed within tolerance range"
  },
  {
    id: "qc002",
    productName: "Power Supply Unit",
    productCode: "PSU-450",
    batchNo: "B20250508-03",
    checkedOn: "2025-05-08",
    checkedBy: "Sarah Johnson",
    status: "Failed",
    remarks: "Output voltage inconsistent, thermal test failed"
  },
  {
    id: "qc003",
    productName: "LED Light Assembly",
    productCode: "LED-A20",
    batchNo: "B20250508-02",
    checkedOn: "2025-05-07",
    checkedBy: "Mike Chen",
    status: "Passed",
    remarks: "All tests passed, brightness within specifications"
  },
  {
    id: "qc004",
    productName: "Control Panel",
    productCode: "CP-100",
    batchNo: "B20250507-01",
    checkedOn: "2025-05-07",
    checkedBy: "Sarah Johnson",
    status: "Warning",
    remarks: "Touch sensitivity slightly below standard, but within acceptable range"
  },
  {
    id: "qc005",
    productName: "Circuit Board Assembly",
    productCode: "CBX-001",
    batchNo: "B20250507-02",
    checkedOn: "2025-05-06",
    checkedBy: "John Smith",
    status: "Passed",
    remarks: "All tests passed within tolerance range"
  }
];

export default function QualityChecksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter quality checks
  const filteredQualityChecks = mockQualityChecks
    .filter((check) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        check.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        check.productCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        check.batchNo.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus =
        statusFilter === "all" || check.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "passed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      default:
        return null;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "passed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500";
      case "warning":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Quality Checks</h1>
        <Button
          className="flex items-center gap-1"
        >
          <Plus size={16} />
          New Quality Check
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
          <CardDescription>Search and filter your quality checks</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search checks..."
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
              <option value="passed">Passed</option>
              <option value="failed">Failed</option>
              <option value="warning">Warning</option>
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

      {/* Quality Checks Table */}
      {filteredQualityChecks.length > 0 ? (
        <div className="rounded-md border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide">
                    Product
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide">
                    Batch No.
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide">
                    Checked On
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide">
                    Checked By
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide">
                    Status
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredQualityChecks.map((check) => (
                  <tr key={check.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="font-medium">{check.productName}</div>
                      <div className="text-xs text-muted-foreground">{check.productCode}</div>
                    </td>
                    <td className="py-3 px-4">{check.batchNo}</td>
                    <td className="py-3 px-4">
                      {new Date(check.checkedOn).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">{check.checkedBy}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(check.status)}`}>
                        {getStatusIcon(check.status)}
                        {check.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          title="More Options"
                        >
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
            <p className="mb-4">Manage product quality checks here.</p>
            <div className="border rounded-md p-8 text-center">
              <h3 className="text-lg font-medium mb-2">No quality checks found</h3>
              <p className="text-muted-foreground mb-4">Get started by creating your first quality check.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}