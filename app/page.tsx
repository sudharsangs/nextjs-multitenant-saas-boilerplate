import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");

  // If user has an access token, redirect to dashboard
  // Otherwise redirect to login
  if (accessToken) {
    redirect("/dashboard");
  } else {
    redirect("/auth/login");
  }
}
