import { DashboardHeader } from "@/components/dashboard/header";
import { DashboardShell } from "@/components/dashboard/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { Plus, Search } from "lucide-react";
import Link from "next/link";

interface InventoryPageProps {
  searchParams: {
    page?: string;
    limit?: string;
    locationId?: string;
    lowStock?: string;
  };
}

export default async function InventoryPage({ searchParams }: InventoryPageProps) {
  const page = searchParams.page || "1";
  const limit = searchParams.limit || "10";
  const locationId = searchParams.locationId;
  const lowStock = searchParams.lowStock;

  const response = await fetch(
    `${process.env.URL}/api/inventory?page=${page}&limit=${limit}${
      locationId ? `&locationId=${locationId}` : ""
    }${lowStock ? `&lowStock=${lowStock}` : ""}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch inventory");
  }

  const { inventory, total, locations, totalPages, currentPage } = await response.json();

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Inventory Management"
        description="Manage your inventory across all locations"
      >
        <Link href="/inventory/adjust">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Adjust Inventory
          </Button>
        </Link>
      </DashboardHeader>

      <div className="flex items-center justify-between space-y-2">
        <div className="flex flex-1 items-center space-x-2">
          <form className="flex space-x-2">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full pl-8"
              />
            </div>
            <Select defaultValue={locationId || ""}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All locations</SelectItem>
                {locations.map((location: { id: string; name: string }) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button>Filter</Button>
          </form>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">Export</Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">On Hand</TableHead>
              <TableHead className="text-right">Allocated</TableHead>
              <TableHead className="text-right">Available</TableHead>
              <TableHead className="text-right">Reorder Point</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.map((item: any) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  <Link href={`/inventory/${item.id}`} className="hover:underline">
                    {item.product.name}
                  </Link>
                </TableCell>
                <TableCell>{item.product.sku}</TableCell>
                <TableCell>{item.location.name}</TableCell>
                <TableCell className="text-right">{Number(item.quantityOnHand)}</TableCell>
                <TableCell className="text-right">{Number(item.quantityAllocated)}</TableCell>
                <TableCell className="text-right">{Number(item.quantityAvailable)}</TableCell>
                <TableCell className="text-right">{Number(item.reorderPoint)}</TableCell>
                <TableCell className="text-right">
                  {Number(item.quantityAvailable) <= Number(item.reorderPoint) ? (
                    <span className="text-red-500">Low Stock</span>
                  ) : (
                    <span className="text-green-500">In Stock</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {inventory.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No inventory items found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination>
        <PaginationContent>
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious href={`/inventory?page=${currentPage - 1}&limit=${limit}${locationId ? `&locationId=${locationId}` : ''}${lowStock ? '&lowStock=true' : ''}`} />
            </PaginationItem>
          )}
          {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
            const pageNumber = i + 1;
            const isCurrentPage = pageNumber === currentPage;
            
            return (
              <PaginationItem key={pageNumber}>
                <PaginationLink 
                  href={`/inventory?page=${pageNumber}&limit=${limit}${locationId ? `&locationId=${locationId}` : ''}${lowStock ? '&lowStock=true' : ''}`}
                  isActive={isCurrentPage}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationNext href={`/inventory?page=${currentPage + 1}&limit=${limit}${locationId ? `&locationId=${locationId}` : ''}${lowStock ? '&lowStock=true' : ''}`} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </DashboardShell>
  );
} 