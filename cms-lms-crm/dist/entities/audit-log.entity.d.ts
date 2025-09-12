import { User } from './user.entity';
export declare enum AuditAction {
    CREATE = "create",
    UPDATE = "update",
    DELETE = "delete",
    VIEW = "view",
    LOGIN = "login",
    LOGOUT = "logout",
    EXPORT = "export",
    IMPORT = "import"
}
export declare enum AuditEntityType {
    USER = "user",
    CONTACT = "contact",
    CATEGORY = "category",
    CRM_TRACKER = "crm_tracker",
    CRM_LEAD = "crm_lead",
    ASSESSMENT = "assessment",
    QUESTIONNAIRE = "questionnaire",
    CAMPAIGN = "campaign",
    EMAIL_TEMPLATE = "email_template"
}
export declare class AuditLog {
    id: string;
    action: AuditAction;
    entityType: AuditEntityType;
    entityId: string;
    entityName: string;
    oldValues: any;
    newValues: any;
    description: string;
    ipAddress: string;
    userAgent: string;
    createdAt: Date;
    user: User;
    userId: string;
}
