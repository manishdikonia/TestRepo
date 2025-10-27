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
exports.QuestionnaireAnswer = void 0;
const typeorm_1 = require("typeorm");
const questionnaire_response_entity_1 = require("./questionnaire-response.entity");
const questionnaire_question_entity_1 = require("./questionnaire-question.entity");
let QuestionnaireAnswer = class QuestionnaireAnswer {
    id;
    textAnswer;
    numericAnswer;
    booleanAnswer;
    dateAnswer;
    selectedOptions;
    createdAt;
    response;
    responseId;
    question;
    questionId;
};
exports.QuestionnaireAnswer = QuestionnaireAnswer;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], QuestionnaireAnswer.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], QuestionnaireAnswer.prototype, "textAnswer", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], QuestionnaireAnswer.prototype, "numericAnswer", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Boolean)
], QuestionnaireAnswer.prototype, "booleanAnswer", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], QuestionnaireAnswer.prototype, "dateAnswer", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], QuestionnaireAnswer.prototype, "selectedOptions", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], QuestionnaireAnswer.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => questionnaire_response_entity_1.QuestionnaireResponse, (response) => response.answers, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'responseId' }),
    __metadata("design:type", questionnaire_response_entity_1.QuestionnaireResponse)
], QuestionnaireAnswer.prototype, "response", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], QuestionnaireAnswer.prototype, "responseId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => questionnaire_question_entity_1.QuestionnaireQuestion),
    (0, typeorm_1.JoinColumn)({ name: 'questionId' }),
    __metadata("design:type", questionnaire_question_entity_1.QuestionnaireQuestion)
], QuestionnaireAnswer.prototype, "question", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], QuestionnaireAnswer.prototype, "questionId", void 0);
exports.QuestionnaireAnswer = QuestionnaireAnswer = __decorate([
    (0, typeorm_1.Entity)('questionnaire_answers')
], QuestionnaireAnswer);
//# sourceMappingURL=questionnaire-answer.entity.js.map