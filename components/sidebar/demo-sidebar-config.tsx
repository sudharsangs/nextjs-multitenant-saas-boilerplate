import { UserRoleEnum, SubscriptionTierEnum } from "@/lib/types";
import { SidebarItemType } from "@/lib/sidebar";
import {
  LayoutDashboard,
  PackageOpen,
  FolderTree,
  ClipboardList,
  Boxes,
  Factory,
  Warehouse,
  TruckIcon,
  ShoppingCart,
  FileBarChart,
  Settings,
  Users,
  Building,
  ReceiptIndianRupee,
  Tag,
  BoxesIcon,
  BarChart3,
  SendToBack,
  ListCheck,
  Target,
  BadgeIndianRupee,
  TicketPercent,
  Landmark
} from "lucide-react";


export const SIDEBAR_ITEMS: SidebarItemType[] = [
  {
    title: "Dashboard",
    href: "/demo/dashboard",
    icon: <LayoutDashboard />,
    roles: [],
    subscriptions: [],
  },
  {
    title: "Inventory",
    icon: <BoxesIcon />,
    roles: [],
    subscriptions: [],
    children: [
      {
        title: "Products",
        href: "/demo/inventory/products",
        icon: <PackageOpen />,
        roles: [],
        subscriptions: [],
      },
      {
        title: "Categories",
        href: "/demo/inventory/categories",
        icon: <FolderTree />,
        roles: [],
        subscriptions: [],
      },
      {
        title: "Stock Management",
        href: "/demo/inventory/stock",
        icon: <Boxes />,
        roles: [],
        subscriptions: [SubscriptionTierEnum.BASIC, SubscriptionTierEnum.STANDARD, SubscriptionTierEnum.PREMIUM],
      },
      {
        title: "Batches",
        href: "/demo/inventory/batches",
        icon: <ClipboardList />,
        roles: [],
        subscriptions: [SubscriptionTierEnum.STANDARD, SubscriptionTierEnum.PREMIUM],
      }
    ],
    href: "/demo/inventory",
  },
  {
    title: "Manufacturing",
    icon: <Factory />,
    roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER],
    subscriptions: [SubscriptionTierEnum.STANDARD, SubscriptionTierEnum.PREMIUM],
    children: [
      {
        title: "Bill of Materials",
        href: "/demo/manufacturing/boms",
        icon: <ClipboardList />,
        roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER],
        subscriptions: [SubscriptionTierEnum.STANDARD, SubscriptionTierEnum.PREMIUM],
      },
      {
        title: "Production Orders",
        href: "/demo/manufacturing/production-orders",
        icon: <Target />,
        roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER],
        subscriptions: [SubscriptionTierEnum.STANDARD, SubscriptionTierEnum.PREMIUM],
      },
      {
        title: "Quality Checks",
        href: "/demo/manufacturing/quality-checks",
        icon: <ListCheck />,
        roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER],
        subscriptions: [SubscriptionTierEnum.PREMIUM],
      }
    ],
    href: "/demo/manufacturing",
  },
  {
    title: "Purchases",
    icon: <TruckIcon />,
    roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER],
    subscriptions: [SubscriptionTierEnum.BASIC, SubscriptionTierEnum.STANDARD, SubscriptionTierEnum.PREMIUM],
    children: [
      {
        title: "Purchase Orders",
        href: "/demo/purchases/orders",
        icon: <SendToBack />,
        roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER],
        subscriptions: [SubscriptionTierEnum.BASIC, SubscriptionTierEnum.STANDARD, SubscriptionTierEnum.PREMIUM],
      },
      {
        title: "Vendors",
        href: "/demo/purchases/vendors",
        icon: <Building />,
        roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER],
        subscriptions: [SubscriptionTierEnum.BASIC, SubscriptionTierEnum.STANDARD, SubscriptionTierEnum.PREMIUM],
      }
    ],
    href: "/demo/purchases",
  },
  {
    title: "Sales",
    icon: <ShoppingCart />,
    roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER],
    subscriptions: [SubscriptionTierEnum.BASIC, SubscriptionTierEnum.STANDARD, SubscriptionTierEnum.PREMIUM],
    children: [
      {
        title: "Orders",
        href: "/demo/sales/orders",
        icon: <ClipboardList />,
        roles: [],
        subscriptions: [SubscriptionTierEnum.BASIC, SubscriptionTierEnum.STANDARD, SubscriptionTierEnum.PREMIUM],
      },
      {
        title: "Customers",
        href: "/demo/sales/customers",
        icon: <Users />,
        roles: [],
        subscriptions: [SubscriptionTierEnum.BASIC, SubscriptionTierEnum.STANDARD, SubscriptionTierEnum.PREMIUM],
      },
      {
        title: "Invoices",
        href: "/demo/sales/invoices",
        icon: <ReceiptIndianRupee />,
        roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER],
        subscriptions: [SubscriptionTierEnum.STANDARD, SubscriptionTierEnum.PREMIUM],
      }
    ],
    href: "/demo/sales",
  },
  {
    title: "Locations",
    href: "/demo/locations",
    icon: <Warehouse />,
    roles: [],
    subscriptions: [SubscriptionTierEnum.STANDARD, SubscriptionTierEnum.PREMIUM],
  },
  {
    title: "Reports",
    icon: <FileBarChart />,
    roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER],
    subscriptions: [SubscriptionTierEnum.STANDARD, SubscriptionTierEnum.PREMIUM],
    children: [
      {
        title: "Inventory Reports",
        href: "/demo/reports/inventory",
        icon: <BarChart3 />,
        roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER],
        subscriptions: [SubscriptionTierEnum.STANDARD, SubscriptionTierEnum.PREMIUM],
      },
      {
        title: "Sales Reports",
        href: "/demo/reports/sales",
        icon: <BadgeIndianRupee />,
        roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER],
        subscriptions: [SubscriptionTierEnum.STANDARD, SubscriptionTierEnum.PREMIUM],
      },
      {
        title: "Purchase Reports",
        href: "/demo/reports/purchases",
        icon: <TicketPercent />,
        roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER],
        subscriptions: [SubscriptionTierEnum.PREMIUM],
      },
      {
        title: "Tax Reports",
        href: "/demo/reports/tax",
        icon: <Landmark />,
        roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER],
        subscriptions: [SubscriptionTierEnum.PREMIUM],
      },
    ],
    href: "/demo/reports",
  },
  {
    title: "Settings",
    icon: <Settings />,
    roles: [UserRoleEnum.ADMIN],
    subscriptions: [],
    children: [
      {
        title: "Company Profile",
        href: "/demo/settings/company",
        icon: <Building />,
        roles: [UserRoleEnum.ADMIN],
        subscriptions: [],
      },
      {
        title: "Users & Permissions",
        href: "/demo/settings/users",
        icon: <Users />,
        roles: [UserRoleEnum.ADMIN],
        subscriptions: [SubscriptionTierEnum.BASIC, SubscriptionTierEnum.STANDARD, SubscriptionTierEnum.PREMIUM],
      },
      {
        title: "Tax Rates",
        href: "/demo/settings/tax-rates",
        icon: <Tag />,
        roles: [UserRoleEnum.ADMIN],
        subscriptions: [SubscriptionTierEnum.STANDARD, SubscriptionTierEnum.PREMIUM],
      },
    ],
    href: "/demo/settings",
  },
];