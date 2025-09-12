import { Assessment } from './assessment.entity';
import { AssessmentQuestionOption } from './assessment-question-option.entity';
export declare enum QuestionType {
    MULTIPLE_CHOICE = "multiple_choice",
    SINGLE_CHOICE = "single_choice",
    TEXT = "text",
    TEXTAREA = "textarea",
    RATING = "rating",
    BOOLEAN = "boolean"
}
export declare class AssessmentQuestion {
    id: string;
    questionText: string;
    type: QuestionType;
    sortOrder: number;
    isRequired: boolean;
    description: string;
    hint: string;
    points: number;
    minRating: number;
    maxRating: number;
    ratingLabel: string;
    createdAt: Date;
    updatedAt: Date;
    assessment: Assessment;
    assessmentId: string;
    options: AssessmentQuestionOption[];
}
