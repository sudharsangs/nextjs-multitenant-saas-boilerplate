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
import { format } from "date-fns";

interface OrdersPageProps {
  searchParams: {
    page?: string;
    limit?: string;
    status?: string;
    search?: string;
  };
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email || "" },
    select: { companyId: true }
  });

  if (!user) return null;

  const page = parseInt(searchParams.page || "1");
  const limit = parseInt(searchParams.limit || "10");
  const status = searchParams.status;
  const search = searchParams.search;

  const where: Prisma.OrderWhereInput = {
    companyId: user.companyId,
    ...(status && { status }),
    ...(search && {
      OR: [
        { orderNumber: { contains: search } },
        { customer: { name: { contains: search } } },
      ],
    }),
  };

  const [orders, total, statuses] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        customer: true,
        user: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { orderDate: "desc" },
    }),
    prisma.order.count({ where }),
    prisma.order.groupBy({
      by: ["status"],
      where: { companyId: user.companyId },
      _count: true,
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Orders"
        description="Manage your customer orders"
      >
        <Link href="/orders/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Order
          </Button>
        </Link>
      </DashboardHeader>

      <div className="flex items-center justify-between space-y-2">
        <div className="flex flex-1 items-center space-x-2">
          <form className="flex space-x-2" action="/orders" method="GET">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                name="search"
                placeholder="Search orders..."
                defaultValue={search}
                className="w-full pl-8"
              />
            </div>
            <Select name="status" defaultValue={status || ""}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All statuses</SelectItem>
                {statuses.map((s) => (
                  <SelectItem key={s.status} value={s.status}>
                    {s.status} ({s._count})
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
              <TableHead>Order #</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Created By</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  <Link href={`/orders/${order.id}`} className="hover:underline">
                    {order.orderNumber}
                  </Link>
                </TableCell>
                <TableCell>{format(new Date(order.orderDate), "MMM d, yyyy")}</TableCell>
                <TableCell>{order.customer.name}</TableCell>
                <TableCell>{order.user.name}</TableCell>
                <TableCell className="text-right">${Number(order.totalAmount).toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <OrderStatusBadge status={order.status} />
                </TableCell>
              </TableRow>
            ))}
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No orders found.
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
              <PaginationPrevious href={`/orders?page=${page - 1}&limit=${limit}${status ? `&status=${status}` : ''}${search ? `&search=${search}` : ''}`} />
            </PaginationItem>
          )}
          {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
            const pageNumber = i + 1;
            const isCurrentPage = pageNumber === page;
            
            return (
              <PaginationItem key={pageNumber}>
                <PaginationLink 
                  href={`/orders?page=${pageNumber}&limit=${limit}${status ? `&status=${status}` : ''}${search ? `&search=${search}` : ''}`}
                  isActive={isCurrentPage}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          {page < totalPages && (
            <PaginationItem>
              <PaginationNext href={`/orders?page=${page + 1}&limit=${limit}${status ? `&status=${status}` : ''}${search ? `&search=${search}` : ''}`} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </DashboardShell>
  );
}

function OrderStatusBadge({ status }: { status: string }) {
  let className = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ";
  
  switch (status.toLowerCase()) {
    case "pending":
      className += "bg-yellow-100 text-yellow-800";
      break;
    case "processing":
      className += "bg-blue-100 text-blue-800";
      break;
    case "completed":
      className += "bg-green-100 text-green-800";
      break;
    case "cancelled":
      className += "bg-red-100 text-red-800";
      break;
    default:
      className += "bg-gray-100 text-gray-800";
  }

  return <span className={className}>{status}</span>;
} 