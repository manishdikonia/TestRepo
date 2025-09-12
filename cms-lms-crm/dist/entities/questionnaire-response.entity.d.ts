import { Questionnaire } from './questionnaire.entity';
import { Contact } from './contact.entity';
import { QuestionnaireAnswer } from './questionnaire-answer.entity';
export declare enum QuestionnaireResponseStatus {
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    ABANDONED = "abandoned"
}
export declare class QuestionnaireResponse {
    id: string;
    status: QuestionnaireResponseStatus;
    completionPercentage: number;
    startedAt: Date;
    completedAt: Date;
    timeTaken: number;
    ipAddress: string;
    userAgent: string;
    createdAt: Date;
    updatedAt: Date;
    questionnaire: Questionnaire;
    questionnaireId: string;
    contact: Contact;
    contactId: string;
    answers: QuestionnaireAnswer[];
}
