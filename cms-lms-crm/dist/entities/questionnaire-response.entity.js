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
exports.QuestionnaireResponse = exports.QuestionnaireResponseStatus = void 0;
const typeorm_1 = require("typeorm");
const questionnaire_entity_1 = require("./questionnaire.entity");
const contact_entity_1 = require("./contact.entity");
const questionnaire_answer_entity_1 = require("./questionnaire-answer.entity");
var QuestionnaireResponseStatus;
(function (QuestionnaireResponseStatus) {
    QuestionnaireResponseStatus["IN_PROGRESS"] = "in_progress";
    QuestionnaireResponseStatus["COMPLETED"] = "completed";
    QuestionnaireResponseStatus["ABANDONED"] = "abandoned";
})(QuestionnaireResponseStatus || (exports.QuestionnaireResponseStatus = QuestionnaireResponseStatus = {}));
let QuestionnaireResponse = class QuestionnaireResponse {
    id;
    status;
    completionPercentage;
    startedAt;
    completedAt;
    timeTaken;
    ipAddress;
    userAgent;
    createdAt;
    updatedAt;
    questionnaire;
    questionnaireId;
    contact;
    contactId;
    answers;
};
exports.QuestionnaireResponse = QuestionnaireResponse;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], QuestionnaireResponse.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: QuestionnaireResponseStatus,
        default: QuestionnaireResponseStatus.IN_PROGRESS,
    }),
    __metadata("design:type", String)
], QuestionnaireResponse.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], QuestionnaireResponse.prototype, "completionPercentage", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], QuestionnaireResponse.prototype, "startedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], QuestionnaireResponse.prototype, "completedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], QuestionnaireResponse.prototype, "timeTaken", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 45 }),
    __metadata("design:type", String)
], QuestionnaireResponse.prototype, "ipAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], QuestionnaireResponse.prototype, "userAgent", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], QuestionnaireResponse.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], QuestionnaireResponse.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => questionnaire_entity_1.Questionnaire, (questionnaire) => questionnaire.responses),
    (0, typeorm_1.JoinColumn)({ name: 'questionnaireId' }),
    __metadata("design:type", questionnaire_entity_1.Questionnaire)
], QuestionnaireResponse.prototype, "questionnaire", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], QuestionnaireResponse.prototype, "questionnaireId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => contact_entity_1.Contact, (contact) => contact.questionnaireResponses),
    (0, typeorm_1.JoinColumn)({ name: 'contactId' }),
    __metadata("design:type", contact_entity_1.Contact)
], QuestionnaireResponse.prototype, "contact", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], QuestionnaireResponse.prototype, "contactId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => questionnaire_answer_entity_1.QuestionnaireAnswer, (answer) => answer.response),
    __metadata("design:type", Array)
], QuestionnaireResponse.prototype, "answers", void 0);
exports.QuestionnaireResponse = QuestionnaireResponse = __decorate([
    (0, typeorm_1.Entity)('questionnaire_responses')
], QuestionnaireResponse);
//# sourceMappingURL=questionnaire-response.entity.js.map