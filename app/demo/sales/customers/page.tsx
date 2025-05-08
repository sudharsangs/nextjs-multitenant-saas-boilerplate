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
  Users,
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

// Mock customers data
const mockCustomers = [
  { 
    id: "cust1", 
    name: "Acme Corporation", 
    contactPerson: "John Smith",
    email: "billing@acme.com", 
    phone: "+91 9876543210",
    address: "123 Main St, New York, NY 10001", 
    city: "New Delhi",
    state: "Delhi", 
    pincode: "110001",
    gstin: "29ABCDE1234F1Z5",
    totalOrders: 12,
    totalSpent: 85750.00, 
    isActive: true
  },
  { 
    id: "cust2", 
    name: "TechSolutions Inc", 
    contactPerson: "Alice Johnson",
    email: "accounts@techsolutions.com", 
    phone: "+91 9876543211",
    address: "456 Park Ave, San Francisco, CA 94102", 
    city: "Mumbai",
    state: "Maharashtra", 
    pincode: "400001",
    gstin: "27FGHIJ5678K1Z3",
    totalOrders: 8,
    totalSpent: 42680.25, 
    isActive: true
  },
  { 
    id: "cust3", 
    name: "Global Manufacturing Ltd", 
    contactPerson: "David Williams",
    email: "finance@globalmanufacturing.com", 
    phone: "+91 9876543212",
    address: "789 Industry Blvd, Chicago, IL 60007", 
    city: "Bangalore",
    state: "Karnataka", 
    pincode: "560001",
    gstin: "24KLMNO9012P1Z8",
    totalOrders: 15,
    totalSpent: 128970.50, 
    isActive: true
  },
  { 
    id: "cust4", 
    name: "XYZ Industries", 
    contactPerson: "Sarah Brown",
    email: "ap@xyzindustries.com", 
    phone: "+91 9876543213",
    address: "101 Commerce Dr, Austin, TX 78701", 
    city: "Chennai",
    state: "Tamil Nadu", 
    pincode: "600001",
    gstin: "07PQRST3456U1Z6",
    totalOrders: 5,
    totalSpent: 23245.75, 
    isActive: true
  },
  { 
    id: "cust5", 
    name: "ABC Enterprises", 
    contactPerson: "Michael Lee",
    email: "payments@abcent.com", 
    phone: "+91 9876543214",
    address: "202 Business Pkwy, Miami, FL 33125", 
    city: "Hyderabad",
    state: "Telangana", 
    pincode: "500001",
    gstin: "33UVWXY7890Z1Z1",
    totalOrders: 10,
    totalSpent: 56780.00, 
    isActive: false
  },
];

export default function CustomersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");

  // Filter and sort customers
  const filteredCustomers = mockCustomers
    .filter((customer) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.gstin.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && customer.isActive) ||
        (statusFilter === "inactive" && !customer.isActive);

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
        <h1 className="text-2xl font-semibold">Customers</h1>
        <Button
          className="flex items-center gap-1"
          onClick={() => router.push("/sales/customers/new")}
        >
          <Plus size={16} />
          Add Customer
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
          <CardDescription>Search and filter your customer list</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search customers..."
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
              <option value="inactive">Inactive</option>
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

      {/* Customers Table */}
      {filteredCustomers.length > 0 ? (
        <div className="rounded-md border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr className="border-b">
                  <th 
                    className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center gap-1">
                      Name
                      {renderSortIcon("name")}
                    </div>
                  </th>
                  <th 
                    className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide cursor-pointer"
                    onClick={() => handleSort("contactPerson")}
                  >
                    <div className="flex items-center gap-1">
                      Contact Person
                      {renderSortIcon("contactPerson")}
                    </div>
                  </th>
                  <th 
                    className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide cursor-pointer"
                    onClick={() => handleSort("email")}
                  >
                    <div className="flex items-center gap-1">
                      Email
                      {renderSortIcon("email")}
                    </div>
                  </th>
                  <th 
                    className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide cursor-pointer"
                    onClick={() => handleSort("city")}
                  >
                    <div className="flex items-center gap-1">
                      City
                      {renderSortIcon("city")}
                    </div>
                  </th>
                  <th 
                    className="text-left py-3 px-4 text-xs font-medium text-muted-foreground tracking-wide cursor-pointer"
                    onClick={() => handleSort("totalOrders")}
                  >
                    <div className="flex items-center gap-1">
                      Orders
                      {renderSortIcon("totalOrders")}
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
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-xs text-muted-foreground">{customer.gstin}</div>
                    </td>
                    <td className="py-3 px-4">{customer.contactPerson}</td>
                    <td className="py-3 px-4">
                      <div>{customer.email}</div>
                      <div className="text-xs text-muted-foreground">{customer.phone}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div>{customer.city}</div>
                      <div className="text-xs text-muted-foreground">{customer.state}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div>{customer.totalOrders}</div>
                      <div className="text-xs text-muted-foreground">₹{customer.totalSpent.toLocaleString('en-IN')}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        customer.isActive 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500'
                      }`}>
                        {customer.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => router.push(`/sales/customers/${customer.id}`)}
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
            <p className="mb-4">Manage your customers here.</p>
            <div className="border rounded-md p-8 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No customers found</h3>
              <p className="text-muted-foreground mb-4">Get started by adding your first customer.</p>
              <Button 
                onClick={() => router.push("/sales/customers/new")}
                className="flex items-center mx-auto gap-1"
              >
                <Plus size={16} />
                Add Customer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}