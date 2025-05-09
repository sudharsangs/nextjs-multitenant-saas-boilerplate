"use client";

import React, { useState } from "react";
import {
  Search,
  Calendar,
  Filter,
  Plus,
  FileDown,
  Eye,
  MoreHorizontal,
  ClipboardList,
  Clock,
  CheckCircle,
  PlayCircle,
  PauseCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card";

// Mock production orders data
const mockProductionOrders = [
  {
    id: "po001",
    orderNo: "PO-20250509-001",
    productName: "Circuit Board Assembly",
    productCode: "CBX-001",
    quantity: 500,
    startDate: "2025-05-09",
    endDate: "2025-05-15",
    status: "In Progress",
    completion: 65,
    bomId: "bom1",
    priority: "High"
  },
  {
    id: "po002",
    orderNo: "PO-20250508-002",
    productName: "Power Supply Unit",
    productCode: "PSU-450",
    quantity: 300,
    startDate: "2025-05-08",
    endDate: "2025-05-14",
    status: "In Progress",
    completion: 40,
    bomId: "bom2",
    priority: "Medium"
  },
  {
    id: "po003",
    orderNo: "PO-20250507-003",
    productName: "LED Light Assembly",
    productCode: "LED-A20",
    quantity: 1000,
    startDate: "2025-05-07",
    endDate: "2025-05-11",
    status: "Completed",
    completion: 100,
    bomId: "bom3",
    priority: "Medium"
  },
  {
    id: "po004",
    orderNo: "PO-20250506-004",
    productName: "Control Panel",
    productCode: "CP-100",
    quantity: 250,
    startDate: "2025-05-06",
    endDate: "2025-05-11",
    status: "On Hold",
    completion: 30,
    bomId: "bom4",
    priority: "Low"
  },
  {
    id: "po005",
    orderNo: "PO-20250510-005",
    productName: "Enclosure Box",
    productCode: "EB-225",
    quantity: 800,
    startDate: "2025-05-10",
    endDate: "2025-05-18",
    status: "Scheduled",
    completion: 0,
    bomId: "bom5",
    priority: "High"
  }
];

export default function ProductionOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  // Filter production orders
  const filteredOrders = mockProductionOrders
    .filter((order) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        order.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.productCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.orderNo.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus =
        statusFilter === "all" || order.status.toLowerCase() === statusFilter.toLowerCase();

      // Priority filter
      const matchesPriority =
        priorityFilter === "all" || order.priority.toLowerCase() === priorityFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesPriority;
    });

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in progress":
        return <PlayCircle className="h-4 w-4 text-blue-500" />;
      case "on hold":
        return <PauseCircle className="h-4 w-4 text-amber-500" />;
      case "scheduled":
        return <Calendar className="h-4 w-4 text-purple-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500";
      case "in progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500";
      case "on hold":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500";
      case "scheduled":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-500";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-500";
    }
  };

  const getPriorityClass = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-amber-500";
      case "low":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Production Orders</h1>
        <Button
          className="flex items-center gap-1"
        >
          <Plus size={16} />
          Create Order
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
          <CardDescription>Search and filter your production orders</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search orders..."
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
              <option value="scheduled">Scheduled</option>
              <option value="in progress">In Progress</option>
              <option value="on hold">On Hold</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label htmlFor="priorityFilter" className="text-sm font-medium block mb-1">
              Priority
            </label>
            <select
              id="priorityFilter"
              className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
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

      {/* Production Orders Table */}
      {filteredOrders.length > 0 ? (
        <div className="rounded-md border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide">
                    Order No.
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide">
                    Product
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide">
                    Quantity
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide">
                    Timeline
                  </th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide">
                    Priority
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide">
                    Status
                  </th>
                  <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide">
                    Progress
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">
                      {order.orderNo}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium">{order.productName}</div>
                      <div className="text-xs text-muted-foreground">{order.productCode}</div>
                    </td>
                    <td className="py-3 px-4 text-right">{order.quantity.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <div className="text-xs text-muted-foreground">Start: {new Date(order.startDate).toLocaleDateString()}</div>
                      <div className="text-xs">End: {new Date(order.endDate).toLocaleDateString()}</div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-medium ${getPriorityClass(order.priority)}`}>
                        {order.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center">
                        <div className="w-full bg-muted rounded-full h-2 max-w-[120px]">
                          <div 
                            className={`${
                              order.status === "Completed" 
                                ? "bg-green-500" 
                                : order.status === "In Progress" 
                                ? "bg-blue-500" 
                                : order.status === "On Hold" 
                                ? "bg-amber-500"
                                : "bg-purple-500"
                            } h-2 rounded-full`}
                            style={{ width: `${order.completion}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-xs">{order.completion}%</span>
                      </div>
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
            <p className="mb-4">Manage your production orders here.</p>
            <div className="border rounded-md p-8 text-center">
              <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No production orders found</h3>
              <p className="text-muted-foreground mb-4">Get started by creating your first production order.</p>
              <Button 
                className="flex items-center mx-auto gap-1"
              >
                <Plus size={16} />
                Create Order
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}