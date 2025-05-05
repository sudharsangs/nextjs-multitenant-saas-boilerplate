export enum LocationTypeEnum {
    WAREHOUSE = 'WAREHOUSE',
    FACTORY = 'FACTORY',
    STORE = 'STORE',
}

export enum SubscriptionTierEnum {
    FREE = "FREE",
    BASIC = "BASIC",
    STANDARD = "PRO",
    PREMIUM = "ENTERPRISE"
}

export enum InventoryStatusEnum {
    AVAILABLE = 'AVAILABLE',
    RESERVED = 'RESERVED',
    DAMAGED = 'DAMAGED',
    QUARANTINED = 'QUARANTINED',
}

export enum BatchStatusEnum {
    ACTIVE = 'ACTIVE',
    EXPIRED = 'EXPIRED',
    RECALLED = 'RECALLED',
}

export enum PoStatusEnum {
    DRAFT = 'DRAFT',
    PENDING_APPROVAL = 'PENDING_APPROVAL',
    APPROVED = 'APPROVED',
    SENT = 'SENT',
    PARTIALLY_RECEIVED = 'PARTIALLY_RECEIVED',
    FULLY_RECEIVED = 'FULLY_RECEIVED',
    CLOSED = 'CLOSED',
    CANCELLED = 'CANCELLED',
}

export enum OrderStatusEnum {
    DRAFT = 'DRAFT',
    CONFIRMED = 'CONFIRMED',
    PICKING = 'PICKING',
    PACKED = 'PACKED',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
}

export enum TaxTypeEnum {
    GST = 'GST',
    IGST = 'IGST',
    CGST = 'CGST',
    SGST = 'SGST',
    CESS = 'CESS',
}

export enum UnitTypeEnum {
    PIECE = 'PIECE',
    KG = 'KG',
    LITER = 'LITER',
    METER = 'METER',
    SQUARE_METER = 'SQUARE_METER',
    CUBIC_METER = 'CUBIC_METER',
}

export enum SubscriptionPlanEnum {
    FREE = 'FREE',
    BASIC = 'BASIC',
    PRO = 'PRO',
    ENTERPRISE = 'ENTERPRISE',
}

export enum SubscriptionStatusEnum {
    ACTIVE = 'ACTIVE',
    TRIAL = 'TRIAL',
    EXPIRED = 'EXPIRED',
    CANCELLED = 'CANCELLED',
    PAYMENT_PENDING = 'PAYMENT_PENDING',
}

export enum InvoiceStatusEnum {
    DRAFT = 'DRAFT',
    SENT = 'SENT',
    PAID = 'PAID',
    OVERDUE = 'OVERDUE',
    CANCELLED = 'CANCELLED',
    PARTIALLY_PAID = 'PARTIALLY_PAID',
}

export enum QuoteStatusEnum {
    DRAFT = 'DRAFT',
    SENT = 'SENT',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
    EXPIRED = 'EXPIRED',
}

export enum PaymentStatusEnum {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED',
}

export enum UserRoleEnum {
    ADMIN = 'ADMIN',
    MANAGER = 'MANAGER',
    STAFF = 'STAFF',
    VIEWER = 'VIEWER',
}

export enum NotificationTypeEnum {
    SYSTEM = 'SYSTEM',
    ALERT = 'ALERT',
    TASK = 'TASK',
    UPDATE = 'UPDATE',
    BILLING = 'BILLING',
}

export enum NotificationStatusEnum {
    UNREAD = 'UNREAD',
    READ = 'READ',
    ARCHIVED = 'ARCHIVED',
}

export enum AuditActionEnum {
    CREATE = 'CREATE',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
    LOGIN = 'LOGIN',
    LOGOUT = 'LOGOUT',
    EXPORT = 'EXPORT',
    IMPORT = 'IMPORT',
}

export enum IntegrationTypeEnum {
    PAYMENT_GATEWAY = 'PAYMENT_GATEWAY',
    EMAIL = 'EMAIL',
    SMS = 'SMS',
    ERP = 'ERP',
    CRM = 'CRM',
    CUSTOM = 'CUSTOM',
}

export enum IntegrationStatusEnum {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    ERROR = 'ERROR',
    PENDING = 'PENDING',
}