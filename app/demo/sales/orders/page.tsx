"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal,
  ArrowUpDown, 
  Eye, 
  FileDown,
  Printer,
  ShoppingBag,
  AlertCircle} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  CardDescription
} from "@/components/ui/card";

// Mock orders data
const mockOrders = [
  {
    id: "ord1",
    orderNumber: "ORD-2025-0001",
    customer: "Acme Corporation",
    date: "2025-05-01",
    expectedShipDate: "2025-05-08",
    amount: 12450.00,
    status: "DELIVERED"
  },
  {
    id: "ord2",
    orderNumber: "ORD-2025-0002",
    customer: "TechSolutions Inc",
    date: "2025-05-03",
    expectedShipDate: "2025-05-10",
    amount: 5680.25,
    status: "CONFIRMED"
  },
  {
    id: "ord3",
    orderNumber: "ORD-2025-0003",
    customer: "Global Manufacturing Ltd",
    date: "2025-05-04",
    expectedShipDate: "2025-05-11",
    amount: 8970.50,
    status: "PACKED"
  },
  {
    id: "ord4",
    orderNumber: "ORD-2025-0004",
    customer: "XYZ Industries",
    date: "2025-05-06",
    expectedShipDate: "2025-05-13",
    amount: 3245.75,
    status: "SHIPPED"
  },
  {
    id: "ord5",
    orderNumber: "ORD-2025-0005",
    customer: "ABC Enterprises",
    date: "2025-05-07",
    expectedShipDate: "2025-05-14",
    amount: 6780.00,
    status: "DRAFT"
  },
];



export default function SalesOrdersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [sortField, setSortField] = useState<keyof typeof mockOrders[0] | null>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    message: string;
    type: 'success' | 'warning' | 'info';
  } | null>(null);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  
  // Status filters
  const statusFilters = ["ALL", "DRAFT", "CONFIRMED", "PICKING", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED"];

  // Filter and sort orders based on search query and filters
  const filteredOrders = mockOrders
    .filter((order) => {
      // Filter by search query
      const matchesSearch = 
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by status
      const matchesStatus = selectedStatus === "ALL" || order.status === selectedStatus;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      
      // Handle different field types
      let comparison = 0;
      if (sortField === "amount") {
        comparison = a.amount - b.amount;
      } else if (sortField === "date" || sortField === "expectedShipDate") {
        comparison = new Date(a[sortField]).getTime() - new Date(b[sortField]).getTime();
      } else {
        comparison = a[sortField].localeCompare(b[sortField]);
      }
      
      return sortDirection === "asc" ? comparison : -comparison;
    });

  const handleSort = (field: keyof typeof mockOrders[0]) => {
    // If clicking the same field, toggle direction
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // New field, set as default desc
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const renderSortIcon = (field: keyof typeof mockOrders[0]) => {
    if (sortField !== field) return <ArrowUpDown size={14} className="opacity-50" />;
    return sortDirection === "asc" ? 
      <ArrowUpDown size={14} className="text-primary" /> : 
      <ArrowUpDown size={14} className="text-primary" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED": return "bg-green-100 text-green-800";
      case "SHIPPED": return "bg-blue-100 text-blue-800";
      case "PACKED": return "bg-purple-100 text-purple-800";
      case "PICKING": return "bg-amber-100 text-amber-800";
      case "CONFIRMED": return "bg-cyan-100 text-cyan-800";
      case "DRAFT": return "bg-gray-100 text-gray-800";
      case "CANCELLED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  const handleExport = () => {
    setModalContent({
      title: "Demo Mode",
      message: "In a real application, this would export the orders to a CSV or Excel file.",
      type: "info"
    });
    setShowModal(true);
  };

  const handlePrint = (orderId: string) => {
    const order = mockOrders.find(o => o.id === orderId);
    
    setModalContent({
      title: "Demo Mode",
      message: `In a real application, this would generate and print a PDF for order ${order?.orderNumber}.`,
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

          {/* Export Buttons */}
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
                    onClick={() => handleSort("expectedShipDate")}
                  >
                    <div className="flex items-center gap-1">
                      Ship Date
                      {renderSortIcon("expectedShipDate")}
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
                    <td className="py-3 px-4">{formatDate(order.date)}</td>
                    <td className="py-3 px-4">{formatDate(order.expectedShipDate)}</td>
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
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handlePrint(order.id)}
                        >
                          <Printer className="h-4 w-4" />
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
                            <div className="absolute right-0 mt-1 w-44 bg-background border border-border rounded-md shadow-md z-10">
                              <div className="py-1">
                                {order.status === "DRAFT" && (
                                  <button
                                    className="block w-full text-left px-4 py-2 text-sm hover:bg-muted text-green-600"
                                    onClick={() => handleActionClick("confirm")}
                                  >
                                    Confirm Order
                                  </button>
                                )}
                                {["DRAFT", "CONFIRMED"].includes(order.status) && (
                                  <button
                                    className="block w-full text-left px-4 py-2 text-sm hover:bg-muted text-red-600"
                                    onClick={() => handleActionClick("cancel")}
                                  >
                                    Cancel Order
                                  </button>
                                )}
                                {order.status === "CONFIRMED" && (
                                  <button
                                    className="block w-full text-left px-4 py-2 text-sm hover:bg-muted"
                                    onClick={() => handleActionClick("start picking")}
                                  >
                                    Start Picking
                                  </button>
                                )}
                                {order.status === "PICKING" && (
                                  <button
                                    className="block w-full text-left px-4 py-2 text-sm hover:bg-muted"
                                    onClick={() => handleActionClick("mark as packed")}
                                  >
                                    Mark as Packed
                                  </button>
                                )}
                                {order.status === "PACKED" && (
                                  <button
                                    className="block w-full text-left px-4 py-2 text-sm hover:bg-muted"
                                    onClick={() => handleActionClick("mark as shipped")}
                                  >
                                    Mark as Shipped
                                  </button>
                                )}
                                {order.status === "SHIPPED" && (
                                  <button
                                    className="block w-full text-left px-4 py-2 text-sm hover:bg-muted"
                                    onClick={() => handleActionClick("mark as delivered")}
                                  >
                                    Mark as Delivered
                                  </button>
                                )}
                                <button
                                  className="block w-full text-left px-4 py-2 text-sm hover:bg-muted"
                                  onClick={() => handleActionClick("create invoice for")}
                                >
                                  Create Invoice
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
              <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
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