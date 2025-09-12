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
exports.AssessmentResponse = exports.ResponseStatus = void 0;
const typeorm_1 = require("typeorm");
const assessment_entity_1 = require("./assessment.entity");
const contact_entity_1 = require("./contact.entity");
const assessment_answer_entity_1 = require("./assessment-answer.entity");
var ResponseStatus;
(function (ResponseStatus) {
    ResponseStatus["IN_PROGRESS"] = "in_progress";
    ResponseStatus["COMPLETED"] = "completed";
    ResponseStatus["ABANDONED"] = "abandoned";
})(ResponseStatus || (exports.ResponseStatus = ResponseStatus = {}));
let AssessmentResponse = class AssessmentResponse {
    id;
    status;
    totalScore;
    maxPossibleScore;
    completionPercentage;
    startedAt;
    completedAt;
    timeTaken;
    resultRanking;
    resultDescription;
    personalityType;
    traits;
    innerDrives;
    baselines;
    ipAddress;
    userAgent;
    createdAt;
    updatedAt;
    assessment;
    assessmentId;
    contact;
    contactId;
    answers;
};
exports.AssessmentResponse = AssessmentResponse;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AssessmentResponse.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ResponseStatus,
        default: ResponseStatus.IN_PROGRESS,
    }),
    __metadata("design:type", String)
], AssessmentResponse.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], AssessmentResponse.prototype, "totalScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], AssessmentResponse.prototype, "maxPossibleScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], AssessmentResponse.prototype, "completionPercentage", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], AssessmentResponse.prototype, "startedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], AssessmentResponse.prototype, "completedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], AssessmentResponse.prototype, "timeTaken", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 50 }),
    __metadata("design:type", String)
], AssessmentResponse.prototype, "resultRanking", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], AssessmentResponse.prototype, "resultDescription", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 100 }),
    __metadata("design:type", String)
], AssessmentResponse.prototype, "personalityType", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], AssessmentResponse.prototype, "traits", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], AssessmentResponse.prototype, "innerDrives", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], AssessmentResponse.prototype, "baselines", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 45 }),
    __metadata("design:type", String)
], AssessmentResponse.prototype, "ipAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], AssessmentResponse.prototype, "userAgent", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AssessmentResponse.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], AssessmentResponse.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => assessment_entity_1.Assessment, (assessment) => assessment.responses),
    (0, typeorm_1.JoinColumn)({ name: 'assessmentId' }),
    __metadata("design:type", assessment_entity_1.Assessment)
], AssessmentResponse.prototype, "assessment", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AssessmentResponse.prototype, "assessmentId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => contact_entity_1.Contact, (contact) => contact.assessmentResponses, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'contactId' }),
    __metadata("design:type", contact_entity_1.Contact)
], AssessmentResponse.prototype, "contact", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AssessmentResponse.prototype, "contactId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => assessment_answer_entity_1.AssessmentAnswer, (answer) => answer.response),
    __metadata("design:type", Array)
], AssessmentResponse.prototype, "answers", void 0);
exports.AssessmentResponse = AssessmentResponse = __decorate([
    (0, typeorm_1.Entity)('assessment_responses')
], AssessmentResponse);
//# sourceMappingURL=assessment-response.entity.js.map