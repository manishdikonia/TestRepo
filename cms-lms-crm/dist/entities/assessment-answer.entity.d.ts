import { AssessmentResponse } from './assessment-response.entity';
import { AssessmentQuestion } from './assessment-question.entity';
export declare class AssessmentAnswer {
    id: string;
    textAnswer: string;
    numericAnswer: number;
    booleanAnswer: boolean;
    selectedOptions: string[];
    pointsAwarded: number;
    createdAt: Date;
    response: AssessmentResponse;
    responseId: string;
    question: AssessmentQuestion;
    questionId: string;
}
