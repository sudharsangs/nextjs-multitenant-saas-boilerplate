import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

interface InventoryAlert {
  id: string;
  productName: string;
  sku: string;
  quantityAvailable: number;
  reorderPoint: number;
  locationName: string;
}

export async function InventoryAlerts() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email || "" },
    select: { companyId: true }
  });

  if (!user) return null;

  const lowStockItems = await prisma.inventory.findMany({
    where: {
      product: {
        companyId: user.companyId
      },
      quantityAvailable: {
        lte: 10 // Assuming low stock threshold
      }
    },
    include: {
      product: true,
      location: true
    },
    take: 5
  });

  const alerts: InventoryAlert[] = lowStockItems.map(item => ({
    id: item.id,
    productName: item.product.name,
    sku: item.product.sku,
    quantityAvailable: Number(item.quantityAvailable),
    reorderPoint: Number(item.reorderPoint),
    locationName: item.location.name
  }));

  if (alerts.length === 0) {
    return (
      <div className="text-center text-sm text-muted-foreground">
        No inventory alerts at this time
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <Link key={alert.id} href={`/inventory/${alert.id}`}>
          <Alert className="cursor-pointer hover:bg-muted/50">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="flex items-center gap-x-2">
              {alert.productName}
              <span className="text-sm font-normal text-muted-foreground">
                ({alert.sku})
              </span>
            </AlertTitle>
            <AlertDescription className="mt-2 flex items-center justify-between">
              <span>
                Available: {alert.quantityAvailable} | Reorder Point:{" "}
                {alert.reorderPoint}
              </span>
              <span className="text-sm text-muted-foreground">
                {alert.locationName}
              </span>
            </AlertDescription>
          </Alert>
        </Link>
      ))}
    </div>
  );
} 