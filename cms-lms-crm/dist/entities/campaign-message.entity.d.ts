import { Campaign } from './campaign.entity';
import { Contact } from './contact.entity';
export declare enum MessageStatus {
    PENDING = "pending",
    SENDING = "sending",
    SENT = "sent",
    DELIVERED = "delivered",
    OPENED = "opened",
    CLICKED = "clicked",
    BOUNCED = "bounced",
    FAILED = "failed",
    UNSUBSCRIBED = "unsubscribed"
}
export declare class CampaignMessage {
    id: string;
    status: MessageStatus;
    subject: string;
    content: string;
    sentAt: Date;
    deliveredAt: Date;
    openedAt: Date;
    clickedAt: Date;
    errorMessage: string;
    externalMessageId: string;
    retryCount: number;
    nextRetryAt: Date;
    createdAt: Date;
    updatedAt: Date;
    campaign: Campaign;
    campaignId: string;
    contact: Contact;
    contactId: string;
}
