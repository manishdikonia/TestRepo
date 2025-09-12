import { CrmLead } from './crm-lead.entity';
import { User } from './user.entity';
import { LeadStatus } from './crm-lead.entity';
export declare enum UpdateType {
    STATUS_CHANGE = "status_change",
    NOTE_ADDED = "note_added",
    FOLLOW_UP = "follow_up",
    MEETING = "meeting",
    CALL = "call",
    EMAIL = "email",
    PROPOSAL_SENT = "proposal_sent",
    DOCUMENT_SHARED = "document_shared"
}
export declare class CrmLeadUpdate {
    id: string;
    type: UpdateType;
    title: string;
    description: string;
    previousStatus: LeadStatus;
    newStatus: LeadStatus;
    attachmentUrl: string;
    attachmentName: string;
    createdAt: Date;
    lead: CrmLead;
    leadId: string;
    createdBy: User;
    createdById: string;
}
