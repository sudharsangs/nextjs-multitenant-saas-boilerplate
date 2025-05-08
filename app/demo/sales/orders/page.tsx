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
  TruckIcon,
  ArrowUpDown,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";

// Mock orders data
const mockOrders = [
  {
    id: "ord1",
    orderNumber: "ORD-2025-0001",
    customer: "Acme Corporation",
    date: "2025-05-01",
    amount: 12450.00,
    status: "DELIVERED",
  },
  {
    id: "ord2",
    orderNumber: "ORD-2025-0002",
    customer: "TechSolutions Inc",
    date: "2025-05-03",
    amount: 5680.25,
    status: "CONFIRMED",
  },
  {
    id: "ord3",
    orderNumber: "ORD-2025-0003",
    customer: "Global Manufacturing Ltd",
    date: "2025-05-04",
    amount: 8970.50,
    status: "PACKED",
  },
  {
    id: "ord4",
    orderNumber: "ORD-2025-0004",
    customer: "XYZ Industries",
    date: "2025-05-06",
    amount: 3245.75,
    status: "SHIPPED",
  },
  {
    id: "ord5",
    orderNumber: "ORD-2025-0005",
    customer: "ABC Enterprises",
    date: "2025-05-07",
    amount: 6780.00,
    status: "DRAFT",
  }
];

// Status filter options
const statusFilters = [
  "All Statuses",
  "DRAFT",
  "CONFIRMED",
  "PICKING",
  "PACKED",
  "SHIPPED", 
  "DELIVERED",
  "CANCELLED"
];

export default function SalesOrdersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [sortField, setSortField] = useState<string>("orderNumber");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    message: string;
    type: 'success' | 'warning' | 'info';
  } | null>(null);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  // Filter and sort orders
  const filteredOrders = mockOrders
    .filter((order) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus =
        selectedStatus === "All Statuses" || order.status === selectedStatus;

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

  const handleExport = () => {
    setModalContent({
      title: "Demo Mode",
      message: "In a real application, this would export the orders to a CSV or Excel file.",
      type: "info"
    });
    setShowModal(true);
  };

  const handleMoreActions = (orderId: string) => {
    if (showActionMenu === orderId) {
      setShowActionMenu(null);
    } else {
      setShowActionMenu(orderId);
      setActiveOrderId(orderId);
    }
  };

  const handleActionClick = (action: string) => {
    const order = mockOrders.find(o => o.id === activeOrderId);
    
    setModalContent({
      title: "Demo Mode",
      message: `In a real application, this would ${action} the order ${order?.orderNumber}.`,
      type: "info"
    });
    setShowModal(true);
    setShowActionMenu(null);
  };

  // Close modal handler
  const closeModal = () => {
    setShowModal(false);
    setModalContent(null);
  };

  const renderSortIcon = (field: string) => {
    if (sortField !== field) return null;
    return (
      <ArrowUpDown size={14} className={`ml-1 ${sortDirection === "desc" ? "transform rotate-180" : ""}`} />
    );
  };

  // Function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500";
      case "SHIPPED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500";
      case "PACKED":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-500";
      case "PICKING":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500";
      case "CONFIRMED":
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-500";
      case "DRAFT":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400";
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Sales Orders</h1>
        <Button
          className="flex items-center gap-1"
          onClick={() => router.push("/sales/orders/new")}
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
          <CardDescription>Filter orders by status, customer, or date</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {statusFilters.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Export Button */}
          <div className="flex items-end gap-2 justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex gap-1"
              onClick={handleExport}
            >
              <FileDown size={14} />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      {filteredOrders.length > 0 ? (
        <div className="rounded-md border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr className="border-b">
                  <th 
                    className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide cursor-pointer"
                    onClick={() => handleSort("orderNumber")}
                  >
                    <div className="flex items-center gap-1">
                      Order #
                      {renderSortIcon("orderNumber")}
                    </div>
                  </th>
                  <th 
                    className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide cursor-pointer"
                    onClick={() => handleSort("customer")}
                  >
                    <div className="flex items-center gap-1">
                      Customer
                      {renderSortIcon("customer")}
                    </div>
                  </th>
                  <th 
                    className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide cursor-pointer"
                    onClick={() => handleSort("date")}
                  >
                    <div className="flex items-center gap-1">
                      Date
                      {renderSortIcon("date")}
                    </div>
                  </th>
                  <th 
                    className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide cursor-pointer"
                    onClick={() => handleSort("amount")}
                  >
                    <div className="flex items-center gap-1">
                      Amount
                      {renderSortIcon("amount")}
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
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <span className="font-medium">{order.orderNumber}</span>
                    </td>
                    <td className="py-3 px-4">{order.customer}</td>
                    <td className="py-3 px-4">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4">₹{order.amount.toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => router.push(`/sales/orders/${order.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <div className="relative">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleMoreActions(order.id)}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                          {showActionMenu === order.id && (
                            <div className="absolute right-0 mt-1 w-40 bg-background border border-border rounded-md shadow-md z-10">
                              <div className="py-1">
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm hover:bg-muted"
                                  onClick={() => handleActionClick("print")}
                                >
                                  Print
                                </button>
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm hover:bg-muted"
                                  onClick={() => handleActionClick("update the status of")}
                                >
                                  Update Status
                                </button>
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm hover:bg-muted"
                                  onClick={() => handleActionClick("cancel")}
                                >
                                  Cancel Order
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
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
            <p className="mb-4">Manage your sales orders here.</p>
            <div className="border rounded-md p-8 text-center">
              <TruckIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No orders found</h3>
              <p className="text-muted-foreground mb-4">Get started by creating your first order.</p>
              <Button 
                onClick={() => router.push("/sales/orders/new")}
                className="flex items-center mx-auto gap-1"
              >
                <Plus size={16} />
                Create Order
              </Button>
            </div>
          </div>
        </div>
      )}

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