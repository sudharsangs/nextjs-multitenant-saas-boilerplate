import { pgTable, text, timestamp, boolean, integer, json, pgEnum, decimal } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

// Enums
export const locationTypeEnum = pgEnum('location_type', ['WAREHOUSE', 'FACTORY', 'STORE']);
export const inventoryStatusEnum = pgEnum('inventory_status', ['AVAILABLE', 'RESERVED', 'DAMAGED', 'QUARANTINED']);
export const batchStatusEnum = pgEnum('batch_status', ['ACTIVE', 'EXPIRED', 'RECALLED']);
export const poStatusEnum = pgEnum('po_status', ['DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'SENT', 'PARTIALLY_RECEIVED', 'FULLY_RECEIVED', 'CLOSED', 'CANCELLED']);
export const orderStatusEnum = pgEnum('order_status', ['DRAFT', 'CONFIRMED', 'PICKING', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED']);
export const taxTypeEnum = pgEnum('tax_type', ['GST', 'IGST', 'CGST', 'SGST', 'CESS']);
export const unitTypeEnum = pgEnum('unit_type', ['PIECE', 'KG', 'LITER', 'METER', 'SQUARE_METER', 'CUBIC_METER']);
export const subscriptionPlanEnum = pgEnum('subscription_plan', ['FREE', 'BASIC', 'PRO', 'ENTERPRISE']);
export const subscriptionStatusEnum = pgEnum('subscription_status', ['ACTIVE', 'TRIAL', 'EXPIRED', 'CANCELLED', 'PAYMENT_PENDING']);
export const invoiceStatusEnum = pgEnum('invoice_status', ['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED', 'PARTIALLY_PAID']);
export const quoteStatusEnum = pgEnum('quote_status', ['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED']);
export const paymentStatusEnum = pgEnum('payment_status', ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED']);
export const userRoleEnum = pgEnum('user_role', ['ADMIN', 'MANAGER', 'STAFF', 'VIEWER']);
export const notificationTypeEnum = pgEnum('notification_type', ['SYSTEM', 'ALERT', 'TASK', 'UPDATE', 'BILLING']);
export const notificationStatusEnum = pgEnum('notification_status', ['UNREAD', 'READ', 'ARCHIVED']);
export const auditActionEnum = pgEnum('audit_action', ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT', 'IMPORT']);
export const integrationTypeEnum = pgEnum('integration_type', ['PAYMENT_GATEWAY', 'EMAIL', 'SMS', 'ERP', 'CRM', 'CUSTOM']);
export const integrationStatusEnum = pgEnum('integration_status', ['ACTIVE', 'INACTIVE', 'ERROR', 'PENDING']);

// Company Management
export const companies = pgTable('companies', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  gstin: text('gstin'),
  address: text('address'),
  city: text('city'),
  state: text('state'),
  country: text('country').default('India'),
  pincode: text('pincode'),
  phone: text('phone'),
  email: text('email'),
  website: text('website'),
  billingAddress: text('billing_address'),
  logo: text('logo'),
  theme: text('theme'),
  settings: json('settings'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Enhanced User Management
export const users = pgTable('users', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()`),
  companyId: text('company_id'),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  phone: text('phone'),
  role: userRoleEnum('role').default('STAFF').notNull(),
  department: text('department'),
  password: text('password').notNull(),
  lastLoginAt: timestamp('last_login_at'),
  emailVerified: boolean('email_verified').default(false).notNull(),
  twoFactorEnabled: boolean('two_factor_enabled').default(false).notNull(),
  twoFactorSecret: text('two_factor_secret'),
  permissions: json('permissions'),
  preferences: json('preferences'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

// Enhanced Audit Logs
export const auditLogs = pgTable('audit_logs', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()`),
  companyId: text('company_id'),
  userId: text('user_id').notNull(),
  action: auditActionEnum('action').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id').notNull(),
  changes: json('changes'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  affectedData: json('affected_data'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Notifications
export const notifications = pgTable('notifications', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()`),
  companyId: text('company_id').notNull(),
  userId: text('user_id').notNull(),
  type: notificationTypeEnum('type').notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  status: notificationStatusEnum('status').default('UNREAD').notNull(),
  readAt: timestamp('read_at'),
  metadata: json('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// API Management
export const apiKeys = pgTable('api_keys', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()`),
  companyId: text('company_id').notNull(),
  name: text('name').notNull(),
  key: text('key').unique().notNull(),
  secret: text('secret').notNull(),
  permissions: json('permissions'),
  expiresAt: timestamp('expires_at'),
  lastUsedAt: timestamp('last_used_at'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Integrations
export const integrations = pgTable('integrations', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()`),
  companyId: text('company_id').notNull(),
  name: text('name').notNull(),
  type: integrationTypeEnum('type').notNull(),
  status: integrationStatusEnum('status').default('PENDING').notNull(),
  config: json('config').notNull(),
  lastSyncAt: timestamp('last_sync_at'),
  errorMessage: text('error_message'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Integration Logs
export const integrationLogs = pgTable('integration_logs', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()`),
  integrationId: text('integration_id').notNull(),
  status: text('status').notNull(),
  direction: text('direction').notNull(),
  request: json('request'),
  response: json('response'),
  error: text('error'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Enhanced Subscriptions
export const subscriptions = pgTable('subscriptions', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()`),
  companyId: text('company_id').notNull(),
  plan: subscriptionPlanEnum('plan').default('FREE').notNull(),
  status: subscriptionStatusEnum('status').default('TRIAL').notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  trialEndDate: timestamp('trial_end_date'),
  trialDays: integer('trial_days').default(14),
  billingCycle: text('billing_cycle').default('MONTHLY').notNull(),
  maxUsers: integer('max_users').notNull(),
  maxStorage: integer('max_storage').notNull(),
  features: json('features').notNull(),
  paymentMethod: text('payment_method'),
  paymentGateway: text('payment_gateway'),
  lastPaymentDate: timestamp('last_payment_date'),
  nextPaymentDate: timestamp('next_payment_date'),
  paymentStatus: text('payment_status'),
  couponCode: text('coupon_code'),
  isAutoRenew: boolean('is_auto_renew').default(true).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Enhanced Payments
export const payments = pgTable('payments', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()`),
  companyId: text('company_id').notNull(),
  invoiceId: text('invoice_id'),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  currency: text('currency').default('INR').notNull(),
  paymentDate: timestamp('payment_date').notNull(),
  paymentMethod: text('payment_method').notNull(),
  paymentGateway: text('payment_gateway'),
  status: paymentStatusEnum('status').default('PENDING').notNull(),
  referenceNumber: text('reference_number'),
  refundReason: text('refund_reason'),
  paymentMetadata: json('payment_metadata'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Financial Management
export const quotes = pgTable('quotes', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()`),
  companyId: text('company_id').notNull(),
  quoteNumber: text('quote_number').unique().notNull(),
  customerId: text('customer_id').notNull(),
  status: quoteStatusEnum('status').default('DRAFT').notNull(),
  validUntil: timestamp('valid_until').notNull(),
  totalAmount: decimal('total_amount', { precision: 12, scale: 2 }).notNull(),
  taxAmount: decimal('tax_amount', { precision: 12, scale: 2 }).notNull(),
  notes: text('notes'),
  termsAndConditions: text('terms_and_conditions'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const quoteItems = pgTable('quote_items', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()`),
  quoteId: text('quote_id').notNull(),
  productId: text('product_id').notNull(),
  quantity: integer('quantity').notNull(),
  unitPrice: decimal('unit_price', { precision: 12, scale: 2 }).notNull(),
  taxRate: decimal('tax_rate', { precision: 5, scale: 2 }).notNull(),
  taxAmount: decimal('tax_amount', { precision: 12, scale: 2 }).notNull(),
  totalPrice: decimal('total_price', { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const invoices = pgTable('invoices', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()`),
  companyId: text('company_id').notNull(),
  invoiceNumber: text('invoice_number').unique().notNull(),
  orderId: text('order_id'),
  quoteId: text('quote_id'),
  customerId: text('customer_id').notNull(),
  status: invoiceStatusEnum('status').default('DRAFT').notNull(),
  issueDate: timestamp('issue_date').notNull(),
  dueDate: timestamp('due_date').notNull(),
  currency: text('currency').default('INR').notNull(),
  totalAmount: decimal('total_amount', { precision: 12, scale: 2 }).notNull(),
  taxAmount: decimal('tax_amount', { precision: 12, scale: 2 }).notNull(),
  discountAmount: decimal('discount_amount', { precision: 12, scale: 2 }).default('0').notNull(),
  discountPercentage: decimal('discount_percentage', { precision: 5, scale: 2 }).default('0').notNull(),
  paidAmount: decimal('paid_amount', { precision: 12, scale: 2 }).default('0').notNull(),
  balanceAmount: decimal('balance_amount', { precision: 12, scale: 2 }).notNull(),
  billingAddress: text('billing_address'),
  shippingAddress: text('shipping_address'),
  paymentTerms: text('payment_terms'),
  notes: text('notes'),
  termsAndConditions: text('terms_and_conditions'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const invoiceItems = pgTable('invoice_items', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()`),
  invoiceId: text('invoice_id').notNull(),
  productId: text('product_id').notNull(),
  quantity: integer('quantity').notNull(),
  unitPrice: decimal('unit_price', { precision: 12, scale: 2 }).notNull(),
  taxRate: decimal('tax_rate', { precision: 5, scale: 2 }).notNull(),
  taxAmount: decimal('tax_amount', { precision: 12, scale: 2 }).notNull(),
  totalPrice: decimal('total_price', { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Location Management
export const locations = pgTable('locations', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()`),
  companyId: text('company_id').notNull(),
  name: text('name').notNull(),
  type: locationTypeEnum('type').notNull(),
  address: text('address').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  pincode: text('pincode').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Product Management
export const categories = pgTable('categories', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()`),
  companyId: text('company_id').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  parentId: text('parent_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const products = pgTable('products', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()`),
  companyId: text('company_id').notNull(),
  name: text('name').notNull(),
  code: text('code').notNull(),
  description: text('description'),
  categoryId: text('category_id'),
  hsnCode: text('hsn_code'),
  unit: unitTypeEnum('unit').default('PIECE').notNull(),
  reorderPoint: integer('reorder_point'),
  safetyStock: integer('safety_stock'),
  leadTime: integer('lead_time'), // in days
  shelfLife: integer('shelf_life'), // in days
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Inventory Management
export const batches = pgTable('batches', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()`),
  companyId: text('company_id').notNull(),
  batchNumber: text('batch_number').unique().notNull(),
  productId: text('product_id').notNull(),
  manufacturingDate: timestamp('manufacturing_date').notNull(),
  expiryDate: timestamp('expiry_date'),
  quantity: integer('quantity').notNull(),
  status: batchStatusEnum('status').default('ACTIVE').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const inventory = pgTable('inventory', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()`),
  companyId: text('company_id').notNull(),
  locationId: text('location_id').notNull(),
  productId: text('product_id').notNull(),
  batchId: text('batch_id'),
  quantity: integer('quantity').notNull(),
  status: inventoryStatusEnum('status').default('AVAILABLE').notNull(),
  lastCountedAt: timestamp('last_counted_at'),
  lastMovedAt: timestamp('last_moved_at'),
  costPrice: decimal('cost_price', { precision: 12, scale: 2 }),
  expiryDate: timestamp('expiry_date'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// BOM Management
export const boms = pgTable('boms', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()`),
  companyId: text('company_id').notNull(),
  productId: text('product_id').notNull(),
  version: text('version').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const bomComponents = pgTable('bom_components', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()`),
  bomId: text('bom_id').notNull(),
  productId: text('product_id').notNull(),
  quantity: decimal('quantity', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Vendor Management
export const vendors = pgTable('vendors', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()`),
  companyId: text('company_id').notNull(),
  name: text('name').notNull(),
  gstin: text('gstin'),
  contactPerson: text('contact_person').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  address: text('address').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  pincode: text('pincode').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Purchase Management
export const purchaseOrders = pgTable('purchase_orders', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()`),
  companyId: text('company_id').notNull(),
  poNumber: text('po_number').unique().notNull(),
  vendorId: text('vendor_id').notNull(),
  status: poStatusEnum('status').default('DRAFT').notNull(),
  totalAmount: decimal('total_amount', { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const poItems = pgTable('po_items', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()`),
  poId: text('po_id').notNull(),
  productId: text('product_id').notNull(),
  quantity: integer('quantity').notNull(),
  unitPrice: decimal('unit_price', { precision: 12, scale: 2 }).notNull(),
  totalPrice: decimal('total_price', { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Customer Management
export const customers = pgTable('customers', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()`),
  companyId: text('company_id').notNull(),
  name: text('name').notNull(),
  gstin: text('gstin'),
  contactPerson: text('contact_person').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  address: text('address').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  pincode: text('pincode').notNull(),
  creditLimit: decimal('credit_limit', { precision: 12, scale: 2 }),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Order Management
export const orders = pgTable('orders', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()`),
  companyId: text('company_id').notNull(),
  orderNumber: text('order_number').unique().notNull(),
  customerId: text('customer_id').notNull(),
  status: orderStatusEnum('status').default('DRAFT').notNull(),
  totalAmount: decimal('total_amount', { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const orderItems = pgTable('order_items', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()`),
  orderId: text('order_id').notNull(),
  productId: text('product_id').notNull(),
  quantity: integer('quantity').notNull(),
  unitPrice: decimal('unit_price', { precision: 12, scale: 2 }).notNull(),
  totalPrice: decimal('total_price', { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Relations
export const companyRelations = relations(companies, ({ one, many }) => ({
  subscription: one(subscriptions, {
    fields: [companies.id],
    references: [subscriptions.companyId],
  }),
  users: many(users),
  locations: many(locations),
  products: many(products),
  vendors: many(vendors),
  customers: many(customers),
  purchaseOrders: many(purchaseOrders),
  orders: many(orders),
  auditLogs: many(auditLogs),
  quotes: many(quotes),
  invoices: many(invoices),
  payments: many(payments),
  notifications: many(notifications),
  apiKeys: many(apiKeys),
  integrations: many(integrations),
}));

export const userRelations = relations(users, ({ one, many }) => ({
  company: one(companies, {
    fields: [users.companyId],
    references: [companies.id],
  }),
  auditLogs: many(auditLogs),
  notifications: many(notifications),
}));

export const locationRelations = relations(locations, ({ one, many }) => ({
  company: one(companies, {
    fields: [locations.companyId],
    references: [companies.id],
  }),
  inventory: many(inventory),
}));

export const categoryRelations = relations(categories, ({ one, many }) => ({
  company: one(companies, {
    fields: [categories.companyId],
    references: [companies.id],
  }),
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
  }),
  products: many(products),
}));

export const productRelations = relations(products, ({ one, many }) => ({
  company: one(companies, {
    fields: [products.companyId],
    references: [companies.id],
  }),
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  inventory: many(inventory),
  boms: many(boms),
  poItems: many(poItems),
  orderItems: many(orderItems),
}));

export const inventoryRelations = relations(inventory, ({ one }) => ({
  company: one(companies, {
    fields: [inventory.companyId],
    references: [companies.id],
  }),
  product: one(products, {
    fields: [inventory.productId],
    references: [products.id],
  }),
  location: one(locations, {
    fields: [inventory.locationId],
    references: [locations.id],
  }),
  batch: one(batches, {
    fields: [inventory.batchId],
    references: [batches.id],
  }),
}));

export const batchRelations = relations(batches, ({ one, many }) => ({
  company: one(companies, {
    fields: [batches.companyId],
    references: [companies.id],
  }),
  product: one(products, {
    fields: [batches.productId],
    references: [products.id],
  }),
  inventory: many(inventory),
}));

export const bomRelations = relations(boms, ({ one, many }) => ({
  company: one(companies, {
    fields: [boms.companyId],
    references: [companies.id],
  }),
  product: one(products, {
    fields: [boms.productId],
    references: [products.id],
  }),
  components: many(bomComponents),
}));

export const bomComponentRelations = relations(bomComponents, ({ one }) => ({
  bom: one(boms, {
    fields: [bomComponents.bomId],
    references: [boms.id],
  }),
  product: one(products, {
    fields: [bomComponents.productId],
    references: [products.id],
  }),
}));

export const vendorRelations = relations(vendors, ({ one, many }) => ({
  company: one(companies, {
    fields: [vendors.companyId],
    references: [companies.id],
  }),
  purchaseOrders: many(purchaseOrders),
}));

export const purchaseOrderRelations = relations(purchaseOrders, ({ one, many }) => ({
  company: one(companies, {
    fields: [purchaseOrders.companyId],
    references: [companies.id],
  }),
  vendor: one(vendors, {
    fields: [purchaseOrders.vendorId],
    references: [vendors.id],
  }),
  items: many(poItems),
}));

export const poItemRelations = relations(poItems, ({ one }) => ({
  po: one(purchaseOrders, {
    fields: [poItems.poId],
    references: [purchaseOrders.id],
  }),
  product: one(products, {
    fields: [poItems.productId],
    references: [products.id],
  }),
}));

export const customerRelations = relations(customers, ({ one, many }) => ({
  company: one(companies, {
    fields: [customers.companyId],
    references: [companies.id],
  }),
  orders: many(orders),
}));

export const orderRelations = relations(orders, ({ one, many }) => ({
  company: one(companies, {
    fields: [orders.companyId],
    references: [companies.id],
  }),
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
  items: many(orderItems),
}));

export const orderItemRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));

export const integrationRelations = relations(integrations, ({ one, many }) => ({
  company: one(companies, {
    fields: [integrations.companyId],
    references: [companies.id],
  }),
  logs: many(integrationLogs),
}));

export const integrationLogRelations = relations(integrationLogs, ({ one }) => ({
  integration: one(integrations, {
    fields: [integrationLogs.integrationId],
    references: [integrations.id],
  }),
}));

// Add relations for quotes and invoices
export const quoteRelations = relations(quotes, ({ one, many }) => ({
  company: one(companies, {
    fields: [quotes.companyId],
    references: [companies.id],
  }),
  customer: one(customers, {
    fields: [quotes.customerId],
    references: [customers.id],
  }),
  items: many(quoteItems),
  invoice: one(invoices, {
    fields: [quotes.id],
    references: [invoices.quoteId],
  }),
}));

export const quoteItemRelations = relations(quoteItems, ({ one }) => ({
  quote: one(quotes, {
    fields: [quoteItems.quoteId],
    references: [quotes.id],
  }),
  product: one(products, {
    fields: [quoteItems.productId],
    references: [products.id],
  }),
}));

export const invoiceRelations = relations(invoices, ({ one, many }) => ({
  company: one(companies, {
    fields: [invoices.companyId],
    references: [companies.id],
  }),
  customer: one(customers, {
    fields: [invoices.customerId],
    references: [customers.id],
  }),
  order: one(orders, {
    fields: [invoices.orderId],
    references: [orders.id],
  }),
  quote: one(quotes, {
    fields: [invoices.quoteId],
    references: [quotes.id],
  }),
  items: many(invoiceItems),
  payments: many(payments),
}));

export const invoiceItemRelations = relations(invoiceItems, ({ one }) => ({
  invoice: one(invoices, {
    fields: [invoiceItems.invoiceId],
    references: [invoices.id],
  }),
  product: one(products, {
    fields: [invoiceItems.productId],
    references: [products.id],
  }),
}));

export const taxRates = pgTable('tax_rates', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()`),
  companyId: text('company_id').notNull(),
  hsnCode: text('hsn_code').notNull(),
  type: taxTypeEnum('type').notNull(),
  rate: decimal('rate', { precision: 5, scale: 2 }).notNull(),
  description: text('description'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const taxRateRelations = relations(taxRates, ({ one }) => ({
  company: one(companies, {
    fields: [taxRates.companyId],
    references: [companies.id],
  }),
}));
