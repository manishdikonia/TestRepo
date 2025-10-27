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
exports.Questionnaire = exports.QuestionnaireStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const questionnaire_question_entity_1 = require("./questionnaire-question.entity");
const questionnaire_response_entity_1 = require("./questionnaire-response.entity");
var QuestionnaireStatus;
(function (QuestionnaireStatus) {
    QuestionnaireStatus["DRAFT"] = "draft";
    QuestionnaireStatus["PUBLISHED"] = "published";
    QuestionnaireStatus["ARCHIVED"] = "archived";
})(QuestionnaireStatus || (exports.QuestionnaireStatus = QuestionnaireStatus = {}));
let Questionnaire = class Questionnaire {
    id;
    title;
    description;
    instructions;
    status;
    totalQuestions;
    estimatedTime;
    totalResponses;
    createdAt;
    updatedAt;
    createdBy;
    createdById;
    questions;
    responses;
};
exports.Questionnaire = Questionnaire;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Questionnaire.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Questionnaire.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Questionnaire.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], Questionnaire.prototype, "instructions", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: QuestionnaireStatus,
        default: QuestionnaireStatus.DRAFT,
    }),
    __metadata("design:type", String)
], Questionnaire.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Questionnaire.prototype, "totalQuestions", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Questionnaire.prototype, "estimatedTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Questionnaire.prototype, "totalResponses", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Questionnaire.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Questionnaire.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.questionnaires),
    (0, typeorm_1.JoinColumn)({ name: 'createdById' }),
    __metadata("design:type", user_entity_1.User)
], Questionnaire.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Questionnaire.prototype, "createdById", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => questionnaire_question_entity_1.QuestionnaireQuestion, (question) => question.questionnaire),
    __metadata("design:type", Array)
], Questionnaire.prototype, "questions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => questionnaire_response_entity_1.QuestionnaireResponse, (response) => response.questionnaire),
    __metadata("design:type", Array)
], Questionnaire.prototype, "responses", void 0);
exports.Questionnaire = Questionnaire = __decorate([
    (0, typeorm_1.Entity)('questionnaires')
], Questionnaire);
//# sourceMappingURL=questionnaire.entity.js.map