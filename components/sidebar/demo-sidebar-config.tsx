import { SidebarItemType } from "@/lib/sidebar";
import {
  LayoutDashboard,
  Settings,
  Users,
  Building,
  CreditCard,
  Bell,
  Shield,
  Key,
  Plug,
  FileText
} from "lucide-react";


export const DEMO_SIDEBAR_ITEMS: SidebarItemType[] = [
  {
    title: "Dashboard",
    href: "/demo/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    title: "Settings",
    icon: <Settings />,
    children: [
      {
        title: "Company Profile",
        href: "/demo/settings/company",
        icon: <Building />,
      },
      {
        title: "Users & Permissions",
        href: "/demo/settings/users",
        icon: <Users />,
      },
      {
        title: "Subscription & Billing",
        href: "/demo/settings/subscription",
        icon: <CreditCard />,
      },
      {
        title: "Notifications",
        href: "/demo/settings/notifications",
        icon: <Bell />,
      },
      {
        title: "API Keys",
        href: "/demo/settings/api-keys",
        icon: <Key />,
      },
      {
        title: "Integrations",
        href: "/demo/settings/integrations",
        icon: <Plug />,
      },
      {
        title: "Audit Logs",
        href: "/demo/settings/audit-logs",
        icon: <FileText />,
      },
      {
        title: "Security",
        href: "/demo/settings/security",
        icon: <Shield />,
      },
    ],
    href: "/demo/settings",
  },
];
