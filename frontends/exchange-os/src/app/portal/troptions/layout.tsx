import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import "@/styles/client-portal.css";

export const dynamic = "force-dynamic";

export default async function PortalTroptionsLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/troptions/auth/login?redirect=/portal/troptions/dashboard");
  }
  return children;
}
