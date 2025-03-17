import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { Feature } from "@/lib/subscription";

// Deployment type specific features
const deploymentFeatures = {
  pulse: [
    Feature.ORDER_MATRIX,
    Feature.INVENTORY_AXIS,
    Feature.ADVANCED_REPORTING,
    Feature.API_ACCESS,
    Feature.MULTI_LOCATION,
    Feature.BATCH_TRACKING,
    Feature.SERIAL_TRACKING,
  ],
  ordermatrix: [Feature.ORDER_MATRIX],
  inventoryaxis: [Feature.INVENTORY_AXIS],
};

// Feature-specific paths that require access check
const featurePaths = {
  [Feature.ORDER_MATRIX]: ["/orders", "/order-matrix"],
  [Feature.INVENTORY_AXIS]: ["/inventory", "/inventory-axis"],
  [Feature.ADVANCED_REPORTING]: ["/reports", "/analytics"],
  [Feature.API_ACCESS]: ["/api/v1"],
  [Feature.MULTI_LOCATION]: ["/locations"],
  [Feature.BATCH_TRACKING]: ["/batches"],
  [Feature.SERIAL_TRACKING]: ["/serials"],
};

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Skip middleware for public paths
  if (
    path.startsWith("/_next") ||
    path.startsWith("/api/auth") ||
    path.startsWith("/login") ||
    path.startsWith("/signup") ||
    path.startsWith("/static")
  ) {
    return NextResponse.next();
  }

  // Get deployment type from environment variable or hostname
  const hostname = request.headers.get("host") || "";
  let deploymentType = process.env.NEXT_PUBLIC_DEPLOYMENT_TYPE || "pulse";

  if (hostname.startsWith("ordermatrix.")) {
    deploymentType = "ordermatrix";
  } else if (hostname.startsWith("inventoryaxis.")) {
    deploymentType = "inventoryaxis";
  }

  // Get the session token
  const token = await getToken({ req: request });

  // If no token and not a public path, redirect to login
  if (!token) {
    const url = new URL("/login", request.url);
    return NextResponse.redirect(url);
  }

  // Check if the path requires feature access
  const requiredFeature = Object.entries(featurePaths).find(([feature, paths]) =>
    paths.some((p) => path.startsWith(p))
  )?.[0] as Feature | undefined;

  if (requiredFeature) {
    // Check if the feature is available in current deployment
    const availableFeatures = deploymentFeatures[deploymentType as keyof typeof deploymentFeatures];
    if (!availableFeatures.includes(requiredFeature)) {
      // Feature not available in this deployment
      return new NextResponse("Feature not available in this deployment", {
        status: 403,
      });
    }

    // Add feature check header for the API route to verify subscription access
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-required-feature", requiredFeature);

    // Return response with modified headers
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
} 