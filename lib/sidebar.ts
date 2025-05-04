import { UserRoleEnum } from "./types";

export type SidebarItemType = {
  title: string;
  href: string;
  icon: React.ReactNode; // Icon component
  roles?: UserRoleEnum[]; // If undefined, visible to all roles
  children?: Omit<SidebarItemType, 'children'>[]; // Nested items (for dropdowns)
  badge?: string | number; // Optional badge display (notifications, counts)
};

// Collection of sidebar configurations
export type SidebarConfig = {
  [key in UserRoleEnum | 'DEFAULT']?: SidebarItemType[];
};

// Sidebar state (expanded/collapsed) and active item
export interface SidebarState {
  collapsed: boolean;
  activeItem: string | null;
}

// Function to filter sidebar items based on user role
export const filterSidebarItemsByRole = (
  items: SidebarItemType[], 
  userRole?: UserRoleEnum
): SidebarItemType[] => {
  if (!userRole) return items;

  return items.filter(item => {
    // If no roles specified, show to everyone
    if (!item.roles || item.roles.length === 0) {
      return true;
    }
    
    // Check if user role matches allowed roles
    return item.roles.includes(userRole);
  }).map(item => {
    // Also filter children if present
    if (item.children && item.children.length > 0) {
      return {
        ...item,
        children: filterSidebarItemsByRole(item.children, userRole),
      };
    }
    return item;
  }).filter(item => {
    // Remove items that have empty children arrays after filtering
    if (item.children && item.children.length === 0) {
      return false;
    }
    return true;
  });
};