import { UserRoleEnum } from "@/lib/types";
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
  Receipt,
  Tag,
  BoxesIcon,
  BarChart3
} from "lucide-react";

export const SIDEBAR_ITEMS: SidebarItemType[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard />,
    roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.STAFF],
  },
  {
    title: "Inventory",
    icon: <BoxesIcon />,
    roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.STAFF],
    children: [
      {
        title: "Products",
        href: "/inventory/products",
        icon: <PackageOpen />,
        roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.STAFF],
      },
      {
        title: "Categories",
        href: "/inventory/categories",
        icon: <FolderTree />,
        roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.STAFF],
      },
      {
        title: "Stock Management",
        href: "/inventory/stock",
        icon: <Boxes />,
        roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.STAFF],
      },
      {
        title: "Batches",
        href: "/inventory/batches",
        icon: <ClipboardList />,
        roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.STAFF],
      }
    ],
    href: "/inventory",
  },
  {
    title: "Manufacturing",
    icon: <Factory />,
    roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER],
    children: [
      {
        title: "Bill of Materials",
        href: "/manufacturing/boms",
        icon: <ClipboardList />,
        roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER],
      },
      {
        title: "Production Orders",
        href: "/manufacturing/production-orders",
        icon: <ClipboardList />,
        roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER],
      },
      {
        title: "Quality Checks",
        href: "/manufacturing/quality-checks",
        icon: <ClipboardList />,
        roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER],
      }
    ],
    href: "/manufacturing",
  },
  {
    title: "Purchases",
    icon: <TruckIcon />,
    roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER],
    children: [
      {
        title: "Purchase Orders",
        href: "/purchases/orders",
        icon: <ClipboardList />,
        roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER],
      },
      {
        title: "Vendors",
        href: "/purchases/vendors",
        icon: <Building />,
        roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER],
      }
    ],
    href: "/purchases",
  },
  {
    title: "Sales",
    icon: <ShoppingCart />,
    roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER],
    children: [
      {
        title: "Orders",
        href: "/sales/orders",
        icon: <ClipboardList />,
        roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.STAFF],
      },
      {
        title: "Customers",
        href: "/sales/customers",
        icon: <Users />,
        roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.STAFF],
      },
      {
        title: "Invoices",
        href: "/sales/invoices",
        icon: <Receipt />,
        roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER],
      }
    ],
    href: "/sales",
  },
  {
    title: "Locations",
    href: "/locations",
    icon: <Warehouse />,
    roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER, UserRoleEnum.STAFF],
  },
  {
    title: "Reports",
    icon: <FileBarChart />,
    roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER],
    children: [
      {
        title: "Inventory Reports",
        href: "/reports/inventory",
        icon: <BarChart3 />,
        roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER],
      },
      {
        title: "Sales Reports",
        href: "/reports/sales",
        icon: <BarChart3 />,
        roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER],
      },
      {
        title: "Purchase Reports",
        href: "/reports/purchases",
        icon: <BarChart3 />,
        roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER],
      },
      {
        title: "Tax Reports",
        href: "/reports/tax",
        icon: <BarChart3 />,
        roles: [UserRoleEnum.ADMIN, UserRoleEnum.MANAGER],
      },
    ],
    href: "/reports",
  },
  {
    title: "Settings",
    icon: <Settings />,
    roles: [UserRoleEnum.ADMIN],
    children: [
      {
        title: "Company Profile",
        href: "/settings/company",
        icon: <Building />,
        roles: [UserRoleEnum.ADMIN],
      },
      {
        title: "Users & Permissions",
        href: "/settings/users",
        icon: <Users />,
        roles: [UserRoleEnum.ADMIN],
      },
      {
        title: "Tax Rates",
        href: "/settings/tax-rates",
        icon: <Tag />,
        roles: [UserRoleEnum.ADMIN],
      },
    ],
    href: "/settings",
  },
];