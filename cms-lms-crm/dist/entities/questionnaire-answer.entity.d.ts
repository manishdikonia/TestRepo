import { QuestionnaireResponse } from './questionnaire-response.entity';
import { QuestionnaireQuestion } from './questionnaire-question.entity';
export declare class QuestionnaireAnswer {
    id: string;
    textAnswer: string;
    numericAnswer: number;
    booleanAnswer: boolean;
    dateAnswer: Date;
    selectedOptions: string[];
    createdAt: Date;
    response: QuestionnaireResponse;
    responseId: string;
    question: QuestionnaireQuestion;
    questionId: string;
}
