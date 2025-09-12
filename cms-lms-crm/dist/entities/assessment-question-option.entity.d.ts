import { AssessmentQuestion } from './assessment-question.entity';
export declare class AssessmentQuestionOption {
    id: string;
    optionText: string;
    sortOrder: number;
    isCorrect: boolean;
    points: number;
    explanation: string;
    createdAt: Date;
    updatedAt: Date;
    question: AssessmentQuestion;
    questionId: string;
}
