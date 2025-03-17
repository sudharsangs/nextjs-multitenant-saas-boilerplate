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
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { Prisma } from "@prisma/client";

interface ProductsPageProps {
  searchParams: {
    page?: string;
    limit?: string;
    category?: string;
    search?: string;
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email || "" },
    select: { companyId: true }
  });

  if (!user) return null;

  const page = parseInt(searchParams.page || "1");
  const limit = parseInt(searchParams.limit || "10");
  const category = searchParams.category;
  const search = searchParams.search;

  const where: Prisma.ProductWhereInput = {
    companyId: user.companyId,
    ...(category && { category }),
    ...(search && {
      OR: [
        { name: { contains: search } },
        { sku: { contains: search } },
        { description: { contains: search } },
      ],
    }),
  };

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { name: "asc" },
    }),
    prisma.product.count({ where }),
    prisma.product.groupBy({
      by: ["category"],
      where: { companyId: user.companyId },
      _count: true,
      orderBy: { category: "asc" },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Products"
        description="Manage your product catalog"
      >
        <Link href="/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </DashboardHeader>

      <div className="flex items-center justify-between space-y-2">
        <div className="flex flex-1 items-center space-x-2">
          <form className="flex space-x-2" action="/products" method="GET">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                name="search"
                placeholder="Search products..."
                defaultValue={search}
                className="w-full pl-8"
              />
            </div>
            <Select name="category" defaultValue={category || ""}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.category} value={cat.category}>
                    {cat.category} ({cat._count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit">Filter</Button>
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
              <TableHead>Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Cost Price</TableHead>
              <TableHead className="text-right">Selling Price</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">
                  <Link href={`/products/${product.id}`} className="hover:underline">
                    {product.name}
                  </Link>
                </TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell className="text-right">${Number(product.costPrice).toFixed(2)}</TableCell>
                <TableCell className="text-right">${Number(product.sellingPrice).toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  {product.isActive ? (
                    <span className="text-green-500">Active</span>
                  ) : (
                    <span className="text-red-500">Inactive</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination>
        <PaginationContent>
          {page > 1 && (
            <PaginationItem>
              <PaginationPrevious href={`/products?page=${page - 1}&limit=${limit}${category ? `&category=${category}` : ''}${search ? `&search=${search}` : ''}`} />
            </PaginationItem>
          )}
          {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
            const pageNumber = i + 1;
            const isCurrentPage = pageNumber === page;
            
            return (
              <PaginationItem key={pageNumber}>
                <PaginationLink 
                  href={`/products?page=${pageNumber}&limit=${limit}${category ? `&category=${category}` : ''}${search ? `&search=${search}` : ''}`}
                  isActive={isCurrentPage}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          {page < totalPages && (
            <PaginationItem>
              <PaginationNext href={`/products?page=${page + 1}&limit=${limit}${category ? `&category=${category}` : ''}${search ? `&search=${search}` : ''}`} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </DashboardShell>
  );
} 