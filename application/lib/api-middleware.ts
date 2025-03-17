import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { Feature } from "@/lib/subscription";
import { hasFeatureAccess } from "@/lib/subscription";
import { unauthorizedResponse, forbiddenResponse } from "@/lib/api-response";

export async function withAuth(
  req: NextRequest,
  handler: (userId: string, companyId: string) => Promise<Response>
) {
  const token = await getToken({ req });

  if (!token?.sub) {
    return unauthorizedResponse();
  }

  return handler(token.sub, token.companyId as string);
}

export async function withFeature(
  req: NextRequest,
  feature: Feature,
  handler: (userId: string, companyId: string) => Promise<Response>
) {
  const token = await getToken({ req });

  if (!token?.sub) {
    return unauthorizedResponse();
  }

  const hasAccess = await hasFeatureAccess(token.companyId as string, feature);
  if (!hasAccess) {
    return forbiddenResponse("Feature not available in your subscription");
  }

  return handler(token.sub, token.companyId as string);
} 