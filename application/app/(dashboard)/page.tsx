import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/dashboard`, {
    headers: {
      Cookie: `next-auth.session-token=${session.user.token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard data");
  }

  const data = await response.json();

  return <DashboardClient data={data} />;
} 