import { Assessment } from './assessment.entity';
import { Contact } from './contact.entity';
import { AssessmentAnswer } from './assessment-answer.entity';
export declare enum ResponseStatus {
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    ABANDONED = "abandoned"
}
export declare class AssessmentResponse {
    id: string;
    status: ResponseStatus;
    totalScore: number;
    maxPossibleScore: number;
    completionPercentage: number;
    startedAt: Date;
    completedAt: Date;
    timeTaken: number;
    resultRanking: string;
    resultDescription: string;
    personalityType: string;
    traits: string;
    innerDrives: string;
    baselines: string;
    ipAddress: string;
    userAgent: string;
    createdAt: Date;
    updatedAt: Date;
    assessment: Assessment;
    assessmentId: string;
    contact: Contact;
    contactId: string;
    answers: AssessmentAnswer[];
}
