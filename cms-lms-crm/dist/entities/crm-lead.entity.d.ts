import { Contact } from './contact.entity';
import { CrmTracker } from './crm-tracker.entity';
import { User } from './user.entity';
import { CrmLeadUpdate } from './crm-lead-update.entity';
export declare enum LeadStatus {
    NEW = "new",
    CONTACTED = "contacted",
    QUALIFIED = "qualified",
    PROPOSAL = "proposal",
    NEGOTIATION = "negotiation",
    CLOSED_WON = "closed_won",
    CLOSED_LOST = "closed_lost",
    ON_HOLD = "on_hold"
}
export declare enum LeadPriority {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    URGENT = "urgent"
}
export declare class CrmLead {
    id: string;
    status: LeadStatus;
    priority: LeadPriority;
    estimatedValue: number;
    expectedCloseDate: Date;
    notes: string;
    customFieldValues: Record<string, any>;
    lastContactDate: Date;
    nextFollowUpDate: Date;
    createdAt: Date;
    updatedAt: Date;
    contact: Contact;
    contactId: string;
    tracker: CrmTracker;
    trackerId: string;
    assignedTo: User;
    assignedToId: string;
    createdBy: User;
    createdById: string;
    updates: CrmLeadUpdate[];
}
