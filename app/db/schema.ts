import { pgTable, text, timestamp, integer, jsonb, decimal } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

export const manufacturingUnits = pgTable('manufacturing_units', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  companyId: text('company_id').notNull(),
  name: text('name').notNull(),
  type: text('type', { enum: ['ASSEMBLY', 'MACHINING', 'PACKAGING'] }).notNull(),
  capacity: integer('capacity').notNull(),
  status: text('status', { enum: ['ACTIVE', 'MAINTENANCE', 'INACTIVE'] }).notNull(),
  locationId: text('location_id').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const qualityChecks = pgTable('quality_checks', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  companyId: text('company_id').notNull(),
  productionOrderId: text('production_order_id').notNull(),
  batchId: text('batch_id').notNull(),
  type: text('type', { enum: ['INCOMING', 'IN_PROCESS', 'FINAL'] }).notNull(),
  status: text('status', { enum: ['PENDING', 'PASSED', 'FAILED'] }).notNull(),
  parameters: jsonb('parameters').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const productionSchedule = pgTable('production_schedule', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  companyId: text('company_id').notNull(),
  productionOrderId: text('production_order_id').notNull(),
  manufacturingUnitId: text('manufacturing_unit_id').notNull(),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  status: text('status', { enum: ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] }).notNull(),
  resources: jsonb('resources').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const productionCosts = pgTable('production_costs', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  companyId: text('company_id').notNull(),
  productionOrderId: text('production_order_id').notNull(),
  type: text('type', { enum: ['MATERIAL', 'LABOR', 'OVERHEAD'] }).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').notNull(),
  date: timestamp('date').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}); 