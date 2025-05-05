import {  UserRoleEnum,SubscriptionTierEnum } from "./types";

export type SidebarItemType = {
  title: string;
  href: string;
  icon: React.ReactNode; // Icon component
  roles?: UserRoleEnum[]; // If undefined, visible to all roles
  children?: Omit<SidebarItemType, 'children'>[]; // Nested items (for dropdowns)
  badge?: string | number; // Optional badge display (notifications, counts)
  subscriptions: SubscriptionTierEnum[];
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
export const filterSidebarItemsByRoleAndSubscription = (
  items: SidebarItemType[], 
  userRole?: UserRoleEnum,
  subscriptionTier?: SubscriptionTierEnum
): SidebarItemType[] => {
  if (!userRole) return items;

  return items.filter(item => {
    // If no roles specified, show to everyone
    const roleMatch = !item.roles || item.roles.length === 0 || item.roles.includes(userRole);
    
    // Check if subscription tier allows access to this item
    const subscriptionMatch = !subscriptionTier || 
      !item.subscriptions || 
      item.subscriptions.length === 0 || 
      item.subscriptions.includes(subscriptionTier);
    
    // Item is visible only if both role and subscription conditions are met
    return roleMatch && subscriptionMatch;
  }).map(item => {
    // Also filter children if present
    if (item.children && item.children.length > 0) {
      return {
        ...item,
        children: filterSidebarItemsByRoleAndSubscription(item.children, userRole, subscriptionTier),
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