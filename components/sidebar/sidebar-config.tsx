import { UserRoleEnum, SubscriptionTierEnum } from "@/lib/types";
import { SidebarItemType } from "@/lib/sidebar";
import {
  LayoutDashboard,
  Settings,
  Users,
  Building,
  Package,
  Key as KeyIcon,
  CreditCard,
  Crown,
  ScrollText
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
    title: "Products",
    href: "/products",
    icon: <Package />,
    roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.STAFF],
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
        title: "Billing",
        href: "/settings/billing",
        icon: <CreditCard />,
        roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER],
        subscriptions: [SubscriptionTierEnum.BASIC, SubscriptionTierEnum.STANDARD, SubscriptionTierEnum.PREMIUM],
      },
      {
        title: "Subscription",
        href: "/settings/subscription",
        icon: <Crown />,
        roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER],
        subscriptions: [SubscriptionTierEnum.FREE, SubscriptionTierEnum.BASIC, SubscriptionTierEnum.STANDARD, SubscriptionTierEnum.PREMIUM],
      },
      {
        title: "Audit Logs",
        href: "/settings/audit-logs",
        icon: <ScrollText />,
        roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER],
        subscriptions: [SubscriptionTierEnum.STANDARD, SubscriptionTierEnum.PREMIUM],
      },
      {
        title: "API Keys",
        href: "/settings/api-keys",
        icon: <KeyIcon />,
        roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER],
        subscriptions: [SubscriptionTierEnum.BASIC, SubscriptionTierEnum.STANDARD, SubscriptionTierEnum.PREMIUM],
      },
    ],
    href: "/settings",
  },
];
