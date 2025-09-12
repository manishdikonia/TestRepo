import { User } from './user.entity';
import { CrmLead } from './crm-lead.entity';
import { CrmField } from './crm-field.entity';
export declare class CrmTracker {
    id: string;
    name: string;
    description: string;
    productName: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    createdBy: User;
    createdById: string;
    leads: CrmLead[];
    selectedFields: CrmField[];
    assignedPartners: User[];
}
