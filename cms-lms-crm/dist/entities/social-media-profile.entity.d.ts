import { Contact } from './contact.entity';
export declare enum SocialMediaPlatform {
    FACEBOOK = "facebook",
    LINKEDIN = "linkedin",
    INSTAGRAM = "instagram",
    TWITTER = "twitter",
    YOUTUBE = "youtube",
    WHATSAPP = "whatsapp",
    TELEGRAM = "telegram",
    OTHER = "other"
}
export declare class SocialMediaProfile {
    id: string;
    platform: SocialMediaPlatform;
    profileUrl: string;
    username: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    contact: Contact;
    contactId: string;
}
