import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface Order {
  id: string;
  customer: string;
  email: string;
  amount: number;
  status: "pending" | "processing" | "completed" | "cancelled";
}

export async function RecentOrders() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email || "" },
    select: { companyId: true }
  });

  if (!user) return null;

  const recentOrders = await prisma.order.findMany({
    where: { companyId: user.companyId },
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { customer: true }
  });

  const orders: Order[] = recentOrders.map(order => ({
    id: order.id,
    customer: order.customer.name,
    email: order.customer.email,
    amount: Number(order.totalAmount),
    status: order.status as "pending" | "processing" | "completed" | "cancelled"
  }));

  if (orders.length === 0) {
    return (
      <div className="text-center text-sm text-muted-foreground">
        No recent orders
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {orders.map((order) => (
        <div key={order.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>
              {order.customer
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{order.customer}</p>
            <p className="text-sm text-muted-foreground">{order.email}</p>
          </div>
          <div className="ml-auto font-medium">
            +${order.amount.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
} 