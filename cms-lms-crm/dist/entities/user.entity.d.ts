import { Contact } from './contact.entity';
import { CrmTracker } from './crm-tracker.entity';
import { Assessment } from './assessment.entity';
import { Questionnaire } from './questionnaire.entity';
import { Campaign } from './campaign.entity';
import { AuditLog } from './audit-log.entity';
export declare enum UserRole {
    ADMIN = "admin",
    INTERNAL_STAFF = "internal_staff",
    PARTNER = "partner",
    CLIENT = "client"
}
export declare enum UserStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    SUSPENDED = "suspended"
}
export declare class User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    role: UserRole;
    status: UserStatus;
    company: string;
    designation: string;
    profilePicture: string;
    isEmailVerified: boolean;
    lastLoginAt: Date;
    createdAt: Date;
    updatedAt: Date;
    createdContacts: Contact[];
    updatedContacts: Contact[];
    crmTrackers: CrmTracker[];
    assignedTrackers: CrmTracker[];
    assessments: Assessment[];
    questionnaires: Questionnaire[];
    campaigns: Campaign[];
    auditLogs: AuditLog[];
}
