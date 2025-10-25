import { UserRoleEnum, SubscriptionTierEnum } from "@/lib/types";
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


export const SIDEBAR_ITEMS: SidebarItemType[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard />,
    roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.STAFF, UserRoleEnum.VIEWER],
    subscriptions: [SubscriptionTierEnum.FREE, SubscriptionTierEnum.BASIC, SubscriptionTierEnum.STANDARD, SubscriptionTierEnum.PREMIUM],
  },
  {
    title: "Settings",
    icon: <Settings />,
    roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER],
    subscriptions: [SubscriptionTierEnum.FREE, SubscriptionTierEnum.BASIC, SubscriptionTierEnum.STANDARD, SubscriptionTierEnum.PREMIUM],
    children: [
      {
        title: "Company Profile",
        href: "/settings/company",
        icon: <Building />,
        roles: [UserRoleEnum.ADMIN],
        subscriptions: [SubscriptionTierEnum.FREE, SubscriptionTierEnum.BASIC, SubscriptionTierEnum.STANDARD, SubscriptionTierEnum.PREMIUM],
      },
      {
        title: "Users & Permissions",
        href: "/settings/users",
        icon: <Users />,
        roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER],
        subscriptions: [SubscriptionTierEnum.BASIC, SubscriptionTierEnum.STANDARD, SubscriptionTierEnum.PREMIUM],
      },
      {
        title: "Subscription & Billing",
        href: "/settings/subscription",
        icon: <CreditCard />,
        roles: [UserRoleEnum.ADMIN],
        subscriptions: [SubscriptionTierEnum.FREE, SubscriptionTierEnum.BASIC, SubscriptionTierEnum.STANDARD, SubscriptionTierEnum.PREMIUM],
      },
      {
        title: "Notifications",
        href: "/settings/notifications",
        icon: <Bell />,
        roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER],
        subscriptions: [SubscriptionTierEnum.FREE, SubscriptionTierEnum.BASIC, SubscriptionTierEnum.STANDARD, SubscriptionTierEnum.PREMIUM],
      },
      {
        title: "API Keys",
        href: "/settings/api-keys",
        icon: <Key />,
        roles: [UserRoleEnum.ADMIN],
        subscriptions: [SubscriptionTierEnum.STANDARD, SubscriptionTierEnum.PREMIUM],
      },
      {
        title: "Integrations",
        href: "/settings/integrations",
        icon: <Plug />,
        roles: [UserRoleEnum.ADMIN],
        subscriptions: [SubscriptionTierEnum.STANDARD, SubscriptionTierEnum.PREMIUM],
      },
      {
        title: "Audit Logs",
        href: "/settings/audit-logs",
        icon: <FileText />,
        roles: [UserRoleEnum.ADMIN],
        subscriptions: [SubscriptionTierEnum.PREMIUM],
      },
      {
        title: "Security",
        href: "/settings/security",
        icon: <Shield />,
        roles: [UserRoleEnum.ADMIN],
        subscriptions: [SubscriptionTierEnum.STANDARD, SubscriptionTierEnum.PREMIUM],
      },
    ],
    href: "/settings",
  },
];
