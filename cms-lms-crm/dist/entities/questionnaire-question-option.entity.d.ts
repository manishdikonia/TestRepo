import { QuestionnaireQuestion } from './questionnaire-question.entity';
export declare class QuestionnaireQuestionOption {
    id: string;
    optionText: string;
    sortOrder: number;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    question: QuestionnaireQuestion;
    questionId: string;
}
