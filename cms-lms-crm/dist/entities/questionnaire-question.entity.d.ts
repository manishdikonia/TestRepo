import { Questionnaire } from './questionnaire.entity';
import { QuestionnaireQuestionOption } from './questionnaire-question-option.entity';
export declare enum QuestionnaireQuestionType {
    MULTIPLE_CHOICE = "multiple_choice",
    SINGLE_CHOICE = "single_choice",
    TEXT = "text",
    TEXTAREA = "textarea",
    RATING = "rating",
    BOOLEAN = "boolean",
    DATE = "date",
    EMAIL = "email",
    PHONE = "phone",
    NUMBER = "number"
}
export declare class QuestionnaireQuestion {
    id: string;
    questionText: string;
    type: QuestionnaireQuestionType;
    sortOrder: number;
    isRequired: boolean;
    description: string;
    hint: string;
    minRating: number;
    maxRating: number;
    ratingLabel: string;
    minLength: number;
    maxLength: number;
    validationRegex: string;
    validationMessage: string;
    createdAt: Date;
    updatedAt: Date;
    questionnaire: Questionnaire;
    questionnaireId: string;
    options: QuestionnaireQuestionOption[];
}
