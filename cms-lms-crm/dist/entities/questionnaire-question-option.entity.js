"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionnaireQuestionOption = void 0;
const typeorm_1 = require("typeorm");
const questionnaire_question_entity_1 = require("./questionnaire-question.entity");
let QuestionnaireQuestionOption = class QuestionnaireQuestionOption {
    id;
    optionText;
    sortOrder;
    description;
    createdAt;
    updatedAt;
    question;
    questionId;
};
exports.QuestionnaireQuestionOption = QuestionnaireQuestionOption;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], QuestionnaireQuestionOption.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], QuestionnaireQuestionOption.prototype, "optionText", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], QuestionnaireQuestionOption.prototype, "sortOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], QuestionnaireQuestionOption.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], QuestionnaireQuestionOption.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], QuestionnaireQuestionOption.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => questionnaire_question_entity_1.QuestionnaireQuestion, (question) => question.options, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'questionId' }),
    __metadata("design:type", questionnaire_question_entity_1.QuestionnaireQuestion)
], QuestionnaireQuestionOption.prototype, "question", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], QuestionnaireQuestionOption.prototype, "questionId", void 0);
exports.QuestionnaireQuestionOption = QuestionnaireQuestionOption = __decorate([
    (0, typeorm_1.Entity)('questionnaire_question_options')
], QuestionnaireQuestionOption);
//# sourceMappingURL=questionnaire-question-option.entity.js.map