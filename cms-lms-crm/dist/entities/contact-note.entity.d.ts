import { Contact } from './contact.entity';
import { User } from './user.entity';
export declare enum NoteType {
    GENERAL = "general",
    MEETING = "meeting",
    CALL = "call",
    EMAIL = "email",
    DOCUMENT = "document"
}
export declare class ContactNote {
    id: string;
    content: string;
    type: NoteType;
    title: string;
    attachmentUrl: string;
    attachmentName: string;
    attachmentSize: number;
    createdAt: Date;
    updatedAt: Date;
    contact: Contact;
    contactId: string;
    createdBy: User;
    createdById: string;
}
