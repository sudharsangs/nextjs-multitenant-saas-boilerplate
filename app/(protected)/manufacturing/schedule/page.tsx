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

interface ProductionSchedule {
  id: string;
  productionOrderId: string;
  manufacturingUnitId: string;
  startTime: string;
  endTime: string;
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  resources: string[];
  notes: string | null;
  companyId: string;
}

export default function ProductionSchedulePage() {
  const router = useRouter();
  const [schedules, setSchedules] = useState<ProductionSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const fetchSchedules = async () => {
      setIsLoading(true);
      try {
        const response = await api.get<ProductionSchedule[]>("/production-schedule");
        if (response.success && response.data) {
          setSchedules(response.data);
        } else {
          setError(response.error || "Failed to load production schedules");
        }
      } catch (err) {
        console.error("Error loading production schedules:", err);
        setError("Failed to load production schedules");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  const filteredSchedules = schedules.filter((schedule) => {
    const matchesSearch = 
      schedule.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      schedule.resources.some(resource => 
        resource.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    const matchesStatus = statusFilter === "all" || schedule.status === statusFilter;
    
    return matchesSearch && matchesStatus;
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
          <h1 className="text-2xl font-semibold">Production Schedule</h1>
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
        <h1 className="text-2xl font-semibold">Production Schedule</h1>
        <Button onClick={() => router.push("/manufacturing/schedule/new")}>
          <Plus className="h-4 w-4 mr-2" />
          New Schedule
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by resources or notes..."
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
            <SelectItem value="SCHEDULED">Scheduled</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchedules.map((schedule) => (
          <div
            key={schedule.id}
            className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.push(`/manufacturing/schedule/${schedule.id}`)}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">Schedule #{schedule.id}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(schedule.startTime).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  schedule.status === "COMPLETED"
                    ? "bg-green-100 text-green-800"
                    : schedule.status === "CANCELLED"
                    ? "bg-red-100 text-red-800"
                    : schedule.status === "IN_PROGRESS"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {schedule.status}
              </span>
            </div>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500">Production Order</p>
                <p className="font-medium">#{schedule.productionOrderId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Manufacturing Unit</p>
                <p className="font-medium">#{schedule.manufacturingUnitId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="text-sm">
                  {new Date(schedule.startTime).toLocaleTimeString()} -{" "}
                  {new Date(schedule.endTime).toLocaleTimeString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Resources</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {schedule.resources.map((resource, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {resource}
                    </span>
                  ))}
                </div>
              </div>
              {schedule.notes && (
                <div>
                  <p className="text-sm text-gray-500">Notes</p>
                  <p className="text-sm">{schedule.notes}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 