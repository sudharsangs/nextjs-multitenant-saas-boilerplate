"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api-client";

interface BOM {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    code: string;
  };
  version: string;
  status: "draft" | "active" | "archived";
  components: {
    id: string;
    productId: string;
    product: {
      id: string;
      name: string;
      code: string;
    };
    quantity: number;
  }[];
  notes: string;
  companyId: string;
  lastUpdated: string;
}

export default function BOMsPage() {
  const router = useRouter();
  const [boms, setBOMs] = useState<BOM[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchBOMs = async () => {
      setIsLoading(true);
      try {
        const response = await api.get<BOM[]>("/boms");
        if (response.success && response.data) {
          setBOMs(response.data);
        } else {
          setError(response.error || "Failed to load BOMs");
        }
      } catch (err) {
        console.error("Error loading BOMs:", err);
        setError("Failed to load BOMs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBOMs();
  }, []);

  const filteredBOMs = boms.filter((bom) => {
    const matchesSearch = 
      bom.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bom.product.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bom.version.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Bill of Materials</h1>
        <Button onClick={() => router.push("/manufacturing/boms/new")}>
          <Plus className="h-4 w-4 mr-2" />
          New BOM
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by product name, code, or version..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="bg-card rounded-lg shadow">
        {error ? (
          <div className="p-4 text-red-500">{error}</div>
        ) : filteredBOMs.length === 0 ? (
          <div className="p-8 text-center">
            <h3 className="text-lg font-medium mb-2">No BOMs found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? "No results match your search criteria"
                : "Get started by creating your first BOM"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Product</th>
                  <th className="text-left p-4">Version</th>
                  <th className="text-left p-4">Components</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Last Updated</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBOMs.map((bom) => (
                  <tr
                    key={bom.id}
                    className="border-b hover:bg-muted/50 cursor-pointer"
                    onClick={() => router.push(`/manufacturing/boms/${bom.id}`)}
                  >
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{bom.product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {bom.product.code}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">{bom.version}</td>
                    <td className="p-4">{bom.components.length} components</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          bom.status === "active"
                            ? "bg-green-100 text-green-800"
                            : bom.status === "archived"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {bom.status.charAt(0).toUpperCase() + bom.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-4">
                      {new Date(bom.lastUpdated).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/manufacturing/boms/${bom.id}/edit`);
                        }}
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}