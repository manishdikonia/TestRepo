import { User } from './user.entity';
import { QuestionnaireQuestion } from './questionnaire-question.entity';
import { QuestionnaireResponse } from './questionnaire-response.entity';
export declare enum QuestionnaireStatus {
    DRAFT = "draft",
    PUBLISHED = "published",
    ARCHIVED = "archived"
}
export declare class Questionnaire {
    id: string;
    title: string;
    description: string;
    instructions: string;
    status: QuestionnaireStatus;
    totalQuestions: number;
    estimatedTime: number;
    totalResponses: number;
    createdAt: Date;
    updatedAt: Date;
    createdBy: User;
    createdById: string;
    questions: QuestionnaireQuestion[];
    responses: QuestionnaireResponse[];
}
