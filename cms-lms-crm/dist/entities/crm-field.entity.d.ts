import { CrmTracker } from './crm-tracker.entity';
export declare enum CrmFieldType {
    TEXT = "text",
    NUMBER = "number",
    EMAIL = "email",
    PHONE = "phone",
    DATE = "date",
    DATETIME = "datetime",
    SELECT = "select",
    MULTISELECT = "multiselect",
    TEXTAREA = "textarea",
    BOOLEAN = "boolean",
    URL = "url"
}
export declare class CrmField {
    id: string;
    name: string;
    label: string;
    fieldType: CrmFieldType;
    description: string;
    isRequired: boolean;
    options: string[];
    defaultValue: string;
    placeholder: string;
    minLength: number;
    maxLength: number;
    validationRegex: string;
    validationMessage: string;
    sortOrder: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    trackers: CrmTracker[];
}
