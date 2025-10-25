// Subscription Tier Enums
export enum SubscriptionTierEnum {
    FREE = "FREE",
    BASIC = "BASIC",
    STANDARD = "PRO",
    PREMIUM = "ENTERPRISE"
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

// Payment Enums
export enum PaymentStatusEnum {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED',
}

// User Management Enums
export enum UserRoleEnum {
    ADMIN = 'ADMIN',
    MANAGER = 'MANAGER',
    STAFF = 'STAFF',
    VIEWER = 'VIEWER',
}

// Notification Enums
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

// Audit Log Enums
export enum AuditActionEnum {
    CREATE = 'CREATE',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
    LOGIN = 'LOGIN',
    LOGOUT = 'LOGOUT',
    EXPORT = 'EXPORT',
    IMPORT = 'IMPORT',
}

// Integration Enums
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
