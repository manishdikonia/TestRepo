import { User } from './user.entity';
import { Category } from './category.entity';
import { Contact } from './contact.entity';
import { CampaignMessage } from './campaign-message.entity';
import { EmailTemplate } from './email-template.entity';
export declare enum CampaignType {
    EMAIL = "email",
    WHATSAPP = "whatsapp",
    SMS = "sms"
}
export declare enum CampaignStatus {
    DRAFT = "draft",
    SCHEDULED = "scheduled",
    RUNNING = "running",
    PAUSED = "paused",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare class Campaign {
    id: string;
    name: string;
    description: string;
    type: CampaignType;
    status: CampaignStatus;
    subject: string;
    messageContent: string;
    scheduledAt: Date;
    startedAt: Date;
    completedAt: Date;
    totalRecipients: number;
    sentCount: number;
    deliveredCount: number;
    openedCount: number;
    clickedCount: number;
    bounceCount: number;
    unsubscribeCount: number;
    filterCriteria: any;
    createdAt: Date;
    updatedAt: Date;
    createdBy: User;
    createdById: string;
    emailTemplate: EmailTemplate;
    emailTemplateId: string;
    targetCategories: Category[];
    recipients: Contact[];
    messages: CampaignMessage[];
}
