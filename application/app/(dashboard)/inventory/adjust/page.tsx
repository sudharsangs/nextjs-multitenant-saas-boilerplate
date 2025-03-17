import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

export default async function AdjustInventoryPage() {
  const response = await fetch(`${process.env.URL}/api/inventory/adjust`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch inventory adjustment data");
  }

  const { products, locations } = await response.json();

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Adjust Inventory"
        description="Add or remove inventory from stock"
      >
        <Link href="/inventory">
          <Button variant="outline">Cancel</Button>
        </Link>
      </DashboardHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Inventory Adjustment</CardTitle>
            <CardDescription>
              Update inventory quantities for a specific product and location
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action="/api/inventory" method="POST" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="productId">Product</Label>
                  <Select name="productId" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product: { id: string; name: string; sku: string }) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} ({product.sku})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="locationId">Location</Label>
                  <Select name="locationId" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location: { id: string; name: string }) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="transactionType">Adjustment Type</Label>
                  <Select name="transactionType" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="receive">Receive Stock</SelectItem>
                      <SelectItem value="adjust_up">Adjust Up</SelectItem>
                      <SelectItem value="adjust_down">Adjust Down</SelectItem>
                      <SelectItem value="damage">Damaged/Expired</SelectItem>
                      <SelectItem value="transfer">Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input 
                    type="number" 
                    name="quantity" 
                    placeholder="Enter quantity" 
                    min="0.01" 
                    step="0.01" 
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="referenceNumber">Reference Number</Label>
                <Input 
                  type="text" 
                  name="referenceNumber" 
                  placeholder="PO number, transfer ID, etc." 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea 
                  name="notes" 
                  placeholder="Add any additional information about this adjustment" 
                  rows={3} 
                />
              </div>
              <input type="hidden" name="transactionDate" value={new Date().toISOString()} />
              <CardFooter className="px-0 pt-6">
                <Button type="submit" className="w-full">
                  Submit Adjustment
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Current Inventory</CardTitle>
            <CardDescription>
              Current stock levels for the selected product and location
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center text-sm text-muted-foreground">
              Select a product and location to view current inventory
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
} 