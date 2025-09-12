import { Contact } from './contact.entity';
import { User } from './user.entity';
export declare class Category {
    id: string;
    name: string;
    description: string;
    color: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    createdBy: User;
    createdById: string;
    contacts: Contact[];
}
