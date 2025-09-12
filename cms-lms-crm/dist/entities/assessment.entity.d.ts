import { User } from './user.entity';
import { AssessmentQuestion } from './assessment-question.entity';
import { AssessmentResponse } from './assessment-response.entity';
export declare enum AssessmentStatus {
    DRAFT = "draft",
    PUBLISHED = "published",
    ARCHIVED = "archived"
}
export declare class Assessment {
    id: string;
    title: string;
    description: string;
    trait: string;
    instructions: string;
    totalQuestions: number;
    maxScore: number;
    timeLimit: number;
    status: AssessmentStatus;
    scoringLogic: any;
    resultCriteria: any;
    publicUrl: string;
    totalResponses: number;
    createdAt: Date;
    updatedAt: Date;
    createdBy: User;
    createdById: string;
    questions: AssessmentQuestion[];
    responses: AssessmentResponse[];
}
