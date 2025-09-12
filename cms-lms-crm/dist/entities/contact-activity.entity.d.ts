import { Contact } from './contact.entity';
import { User } from './user.entity';
export declare enum ActivityType {
    REMINDER = "reminder",
    TODO = "todo",
    MEETING = "meeting",
    CALL = "call",
    EMAIL = "email",
    FOLLOW_UP = "follow_up"
}
export declare enum ActivityStatus {
    PENDING = "pending",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare class ContactActivity {
    id: string;
    title: string;
    description: string;
    type: ActivityType;
    status: ActivityStatus;
    dueDate: Date;
    completedAt: Date;
    isAllDay: boolean;
    startTime: Date;
    endTime: Date;
    location: string;
    createdAt: Date;
    updatedAt: Date;
    contact: Contact;
    contactId: string;
    createdBy: User;
    createdById: string;
    assignedTo: User;
    assignedToId: string;
}
