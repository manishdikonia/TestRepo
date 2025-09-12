import { User } from './user.entity';
import { Campaign } from './campaign.entity';
export declare enum TemplateType {
    EMAIL = "email",
    WHATSAPP = "whatsapp",
    SMS = "sms"
}
export declare class EmailTemplate {
    id: string;
    name: string;
    description: string;
    type: TemplateType;
    subject: string;
    htmlContent: string;
    textContent: string;
    variables: string[];
    isDefault: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    createdBy: User;
    createdById: string;
    campaigns: Campaign[];
}
