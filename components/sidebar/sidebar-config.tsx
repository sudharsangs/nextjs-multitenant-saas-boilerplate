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
    href: "/dashboard",
    icon: <LayoutDashboard />,
    roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.STAFF],
    subscriptions: [SubscriptionTierEnum.FREE, SubscriptionTierEnum.BASIC, SubscriptionTierEnum.STANDARD, SubscriptionTierEnum.PREMIUM],
  },
  {
    title: "Inventory",
    icon: <BoxesIcon />,
    roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.STAFF],
    subscriptions: [SubscriptionTierEnum.FREE, SubscriptionTierEnum.BASIC, SubscriptionTierEnum.STANDARD, SubscriptionTierEnum.PREMIUM],
    children: [
      {
        title: "Products",
        href: "/inventory/products",
        icon: <PackageOpen />,
        roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.STAFF],
        subscriptions: [SubscriptionTierEnum.FREE, SubscriptionTierEnum.BASIC, SubscriptionTierEnum.STANDARD, SubscriptionTierEnum.PREMIUM],
      },
      {
        title: "Categories",
        href: "/inventory/categories",
        icon: <FolderTree />,
        roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.STAFF],
        subscriptions: [SubscriptionTierEnum.FREE, SubscriptionTierEnum.BASIC, SubscriptionTierEnum.STANDARD, SubscriptionTierEnum.PREMIUM],
      },
      {
        title: "Stock Management",
        href: "/inventory/stock",
        icon: <Boxes />,
        roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.STAFF],
        subscriptions: [SubscriptionTierEnum.BASIC, SubscriptionTierEnum.STANDARD, SubscriptionTierEnum.PREMIUM],
      },
      {
        title: "Batches",
        href: "/inventory/batches",
        icon: <ClipboardList />,
        roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.STAFF],
        subscriptions: [SubscriptionTierEnum.STANDARD, SubscriptionTierEnum.PREMIUM],
      }
    ],
    href: "/inventory",
  },
  {
    title: "Manufacturing",
    icon: <Factory />,
    roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER],
    subscriptions: [SubscriptionTierEnum.STANDARD, SubscriptionTierEnum.PREMIUM],
    children: [
      {
        title: "Bill of Materials",
        href: "/manufacturing/boms",
        icon: <ClipboardList />,
        roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER],
        subscriptions: [SubscriptionTierEnum.STANDARD, SubscriptionTierEnum.PREMIUM],
      },
      {
        title: "Production Orders",
        href: "/manufacturing/production-orders",
        icon: <Target />,
        roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER],
        subscriptions: [SubscriptionTierEnum.STANDARD, SubscriptionTierEnum.PREMIUM],
      },
      {
        title: "Quality Checks",
        href: "/manufacturing/quality-checks",
        icon: <ListCheck />,
        roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER],
        subscriptions: [SubscriptionTierEnum.PREMIUM],
      }
    ],
    href: "/manufacturing",
  },
  {
    title: "Purchases",
    icon: <TruckIcon />,
    roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER],
    subscriptions: [SubscriptionTierEnum.BASIC, SubscriptionTierEnum.STANDARD, SubscriptionTierEnum.PREMIUM],
    children: [
      {
        title: "Purchase Orders",
        href: "/purchases/orders",
        icon: <SendToBack />,
        roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER],
        subscriptions: [SubscriptionTierEnum.BASIC, SubscriptionTierEnum.STANDARD, SubscriptionTierEnum.PREMIUM],
      },
      {
        title: "Vendors",
        href: "/purchases/vendors",
        icon: <Building />,
        roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER],
        subscriptions: [SubscriptionTierEnum.BASIC, SubscriptionTierEnum.STANDARD, SubscriptionTierEnum.PREMIUM],
      }
    ],
    href: "/purchases",
  },
  {
    title: "Sales",
    icon: <ShoppingCart />,
    roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER],
    subscriptions: [SubscriptionTierEnum.BASIC, SubscriptionTierEnum.STANDARD, SubscriptionTierEnum.PREMIUM],
    children: [
      {
        title: "Orders",
        href: "/sales/orders",
        icon: <ClipboardList />,
        roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.STAFF],
        subscriptions: [SubscriptionTierEnum.BASIC, SubscriptionTierEnum.STANDARD, SubscriptionTierEnum.PREMIUM],
      },
      {
        title: "Customers",
        href: "/sales/customers",
        icon: <Users />,
        roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.STAFF],
        subscriptions: [SubscriptionTierEnum.BASIC, SubscriptionTierEnum.STANDARD, SubscriptionTierEnum.PREMIUM],
      },
      {
        title: "Invoices",
        href: "/sales/invoices",
        icon: <ReceiptIndianRupee />,
        roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER],
        subscriptions: [SubscriptionTierEnum.STANDARD, SubscriptionTierEnum.PREMIUM],
      }
    ],
    href: "/sales",
  },
  {
    title: "Locations",
    href: "/locations",
    icon: <Warehouse />,
    roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.STAFF],
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
        href: "/reports/inventory",
        icon: <BarChart3 />,
        roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER],
        subscriptions: [SubscriptionTierEnum.STANDARD, SubscriptionTierEnum.PREMIUM],
      },
      {
        title: "Sales Reports",
        href: "/reports/sales",
        icon: <BadgeIndianRupee />,
        roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER],
        subscriptions: [SubscriptionTierEnum.STANDARD, SubscriptionTierEnum.PREMIUM],
      },
      {
        title: "Purchase Reports",
        href: "/reports/purchases",
        icon: <TicketPercent />,
        roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER],
        subscriptions: [SubscriptionTierEnum.PREMIUM],
      },
      {
        title: "Tax Reports",
        href: "/reports/tax",
        icon: <Landmark />,
        roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER],
        subscriptions: [SubscriptionTierEnum.PREMIUM],
      },
    ],
    href: "/reports",
  },
  {
    title: "Settings",
    icon: <Settings />,
    roles: [UserRoleEnum.ADMIN],
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
        roles: [UserRoleEnum.ADMIN],
        subscriptions: [SubscriptionTierEnum.BASIC, SubscriptionTierEnum.STANDARD, SubscriptionTierEnum.PREMIUM],
      },
      {
        title: "Tax Rates",
        href: "/settings/tax-rates",
        icon: <Tag />,
        roles: [UserRoleEnum.ADMIN],
        subscriptions: [SubscriptionTierEnum.STANDARD, SubscriptionTierEnum.PREMIUM],
      },
    ],
    href: "/settings",
  },
];