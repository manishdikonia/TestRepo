import { User } from './user.entity';
import { Category } from './category.entity';
import { ContactNote } from './contact-note.entity';
import { ContactActivity } from './contact-activity.entity';
import { SocialMediaProfile } from './social-media-profile.entity';
import { CrmLead } from './crm-lead.entity';
import { AssessmentResponse } from './assessment-response.entity';
import { QuestionnaireResponse } from './questionnaire-response.entity';
export declare enum ContactType {
    ENTREPRENEUR = "entrepreneur",
    EMPLOYEE = "employee"
}
export declare class Contact {
    id: string;
    firstName: string;
    lastName: string;
    contactNumber: string;
    email: string;
    location: string;
    contactType: ContactType;
    company: string;
    designation: string;
    industry: string;
    website: string;
    innerDrives: string;
    baselines: string;
    traits: string;
    personalityType: string;
    assessmentTrait: string;
    assessmentScore: number;
    assessmentMaxScore: number;
    assessmentRanking: string;
    isDuplicate: boolean;
    mergedWithContactId: string;
    createdAt: Date;
    updatedAt: Date;
    createdBy: User;
    createdById: string;
    updatedBy: User;
    updatedById: string;
    categories: Category[];
    notes: ContactNote[];
    activities: ContactActivity[];
    socialMediaProfiles: SocialMediaProfile[];
    crmLeads: CrmLead[];
    assessmentResponses: AssessmentResponse[];
    questionnaireResponses: QuestionnaireResponse[];
}
