import { pgTable, text, timestamp, boolean, integer, json, pgEnum, decimal } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

// Enums
export const subscriptionPlanEnum = pgEnum('subscription_plan', ['FREE', 'BASIC', 'PRO', 'ENTERPRISE']);
export const subscriptionStatusEnum = pgEnum('subscription_status', ['ACTIVE', 'TRIAL', 'EXPIRED', 'CANCELLED', 'PAYMENT_PENDING']);
export const paymentStatusEnum = pgEnum('payment_status', ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED']);
export const userRoleEnum = pgEnum('user_role', ['ADMIN', 'MANAGER', 'STAFF', 'VIEWER']);
export const notificationTypeEnum = pgEnum('notification_type', ['SYSTEM', 'ALERT', 'TASK', 'UPDATE', 'BILLING']);
export const notificationStatusEnum = pgEnum('notification_status', ['UNREAD', 'READ', 'ARCHIVED']);
export const auditActionEnum = pgEnum('audit_action', ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT', 'IMPORT']);
export const integrationTypeEnum = pgEnum('integration_type', ['PAYMENT_GATEWAY', 'EMAIL', 'SMS', 'ERP', 'CRM', 'CUSTOM']);
export const integrationStatusEnum = pgEnum('integration_status', ['ACTIVE', 'INACTIVE', 'ERROR', 'PENDING']);
export const subscriptionDurationEnum = pgEnum('subscription_duration', ['monthly', 'quarterly', 'half-yearly', 'annual']);
export const productCategoryEnum = pgEnum('product_category', ['ELECTRONICS', 'CLOTHING', 'FOOD', 'BOOKS', 'OTHER']);

// Company Management (Tenant)
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

// User Management
export const users = pgTable('users', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()`),
  companyId: text('company_id').notNull(),
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

// Audit Logs
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

// API Keys Management
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

// Subscriptions
export const subscriptions = pgTable('subscriptions', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()`),
  companyId: text('company_id').notNull().unique(),
  plan: subscriptionPlanEnum('plan').default('FREE').notNull(),
  status: subscriptionStatusEnum('status').default('TRIAL').notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  trialEndDate: timestamp('trial_end_date'),
  trialDays: integer('trial_days').default(14),
  duration: subscriptionDurationEnum('duration').default('monthly').notNull(),
  maxUsers: integer('max_users').notNull(),
  maxStorage: integer('max_storage').notNull(),
  features: json('features').notNull(),
  paymentMethod: text('payment_method'),
  paymentGateway: text('payment_gateway'),
  lastPaymentDate: timestamp('last_payment_date'),
  nextPaymentDate: timestamp('next_payment_date'),
  couponCode: text('coupon_code'),
  isAutoRenew: boolean('is_auto_renew').default(true).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Payments
export const payments = pgTable('payments', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()`),
  companyId: text('company_id').notNull(),
  subscriptionId: text('subscription_id'),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  currency: text('currency').default('USD').notNull(),
  paymentDate: timestamp('payment_date').notNull(),
  paymentMethod: text('payment_method').notNull(),
  paymentGateway: text('payment_gateway'),
  status: paymentStatusEnum('status').default('PENDING').notNull(),
  transactionId: text('transaction_id'),
  refundReason: text('refund_reason'),
  metadata: json('metadata'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Products (Demo CRUD Table)
export const products = pgTable('products', {
  id: text('id').primaryKey().default(sql`gen_random_uuid()`),
  companyId: text('company_id').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  category: productCategoryEnum('category').default('OTHER').notNull(),
  price: decimal('price', { precision: 12, scale: 2 }).notNull(),
  stock: integer('stock').default(0).notNull(),
  sku: text('sku').unique(),
  isActive: boolean('is_active').default(true).notNull(),
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
  auditLogs: many(auditLogs),
  payments: many(payments),
  notifications: many(notifications),
  apiKeys: many(apiKeys),
  integrations: many(integrations),
  products: many(products),
}));

export const userRelations = relations(users, ({ one, many }) => ({
  company: one(companies, {
    fields: [users.companyId],
    references: [companies.id],
  }),
  auditLogs: many(auditLogs),
  notifications: many(notifications),
}));

export const subscriptionRelations = relations(subscriptions, ({ one, many }) => ({
  company: one(companies, {
    fields: [subscriptions.companyId],
    references: [companies.id],
  }),
  payments: many(payments),
}));

export const paymentRelations = relations(payments, ({ one }) => ({
  company: one(companies, {
    fields: [payments.companyId],
    references: [companies.id],
  }),
  subscription: one(subscriptions, {
    fields: [payments.subscriptionId],
    references: [subscriptions.id],
  }),
}));

export const notificationRelations = relations(notifications, ({ one }) => ({
  company: one(companies, {
    fields: [notifications.companyId],
    references: [companies.id],
  }),
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const auditLogRelations = relations(auditLogs, ({ one }) => ({
  company: one(companies, {
    fields: [auditLogs.companyId],
    references: [companies.id],
  }),
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
}));

export const apiKeyRelations = relations(apiKeys, ({ one }) => ({
  company: one(companies, {
    fields: [apiKeys.companyId],
    references: [companies.id],
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

export const productRelations = relations(products, ({ one }) => ({
  company: one(companies, {
    fields: [products.companyId],
    references: [companies.id],
  }),
}));
