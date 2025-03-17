"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertCircle } from "lucide-react";

interface InventoryItem {
  id: string;
  product: {
    name: string;
    sku: string;
  };
  location: {
    name: string;
  };
  quantityAvailable: number;
  reorderPoint: number;
}

export function InventoryAlerts() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const response = await fetch("/api/inventory/alerts", {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to fetch inventory alerts");
        }
        const data = await response.json();
        setItems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load alerts");
      } finally {
        setLoading(false);
      }
    }

    fetchAlerts();
  }, []);

  if (loading) {
    return <div className="text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!items || items.length === 0) {
    return (
      <div className="flex items-center justify-center p-6 text-gray-500">
        <AlertCircle className="mr-2 h-4 w-4" />
        No inventory alerts
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-gray-500">Product</TableHead>
          <TableHead className="text-gray-500">SKU</TableHead>
          <TableHead className="text-gray-500">Location</TableHead>
          <TableHead className="text-gray-500">Available</TableHead>
          <TableHead className="text-gray-500">Reorder Point</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium text-gray-900">
              {item.product.name}
            </TableCell>
            <TableCell className="text-gray-900">{item.product.sku}</TableCell>
            <TableCell className="text-gray-900">{item.location.name}</TableCell>
            <TableCell className="text-gray-900">{item.quantityAvailable}</TableCell>
            <TableCell className="text-gray-900">{item.reorderPoint}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 