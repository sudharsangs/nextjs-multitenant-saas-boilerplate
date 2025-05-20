"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api-client";

interface ManufacturingUnit {
  id: string;
  name: string;
  type: "ASSEMBLY" | "MACHINING" | "PACKAGING";
  capacity: number;
  status: "ACTIVE" | "MAINTENANCE" | "INACTIVE";
  locationId: string;
  notes: string | null;
  companyId: string;
}

export default function ManufacturingUnitsPage() {
  const router = useRouter();
  const [units, setUnits] = useState<ManufacturingUnit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  useEffect(() => {
    const fetchUnits = async () => {
      setIsLoading(true);
      try {
        const response = await api.get<ManufacturingUnit[]>("/manufacturing-units");
        if (response.success && response.data) {
          setUnits(response.data);
        } else {
          setError(response.error || "Failed to load manufacturing units");
        }
      } catch (err) {
        console.error("Error loading manufacturing units:", err);
        setError("Failed to load manufacturing units");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUnits();
  }, []);

  const filteredUnits = units.filter((unit) => {
    const matchesSearch = 
      unit.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || unit.status === statusFilter;
    const matchesType = typeFilter === "all" || unit.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Manufacturing Units</h1>
        </div>
        <div className="p-4 border border-red-300 bg-red-50 rounded-md text-red-700">
          <p>{error}</p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Manufacturing Units</h1>
        <Button onClick={() => router.push("/manufacturing/units/new")}>
          <Plus className="h-4 w-4 mr-2" />
          New Unit
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="ASSEMBLY">Assembly</SelectItem>
            <SelectItem value="MACHINING">Machining</SelectItem>
            <SelectItem value="PACKAGING">Packaging</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUnits.map((unit) => (
          <div
            key={unit.id}
            className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.push(`/manufacturing/units/${unit.id}`)}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{unit.name}</h3>
                <p className="text-sm text-gray-500">{unit.type}</p>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  unit.status === "ACTIVE"
                    ? "bg-green-100 text-green-800"
                    : unit.status === "MAINTENANCE"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {unit.status}
              </span>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500">Capacity</p>
                <p className="font-medium">{unit.capacity} units</p>
              </div>
              {unit.notes && (
                <div>
                  <p className="text-sm text-gray-500">Notes</p>
                  <p className="text-sm">{unit.notes}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 