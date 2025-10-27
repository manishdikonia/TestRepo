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
exports.Assessment = exports.AssessmentStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const assessment_question_entity_1 = require("./assessment-question.entity");
const assessment_response_entity_1 = require("./assessment-response.entity");
var AssessmentStatus;
(function (AssessmentStatus) {
    AssessmentStatus["DRAFT"] = "draft";
    AssessmentStatus["PUBLISHED"] = "published";
    AssessmentStatus["ARCHIVED"] = "archived";
})(AssessmentStatus || (exports.AssessmentStatus = AssessmentStatus = {}));
let Assessment = class Assessment {
    id;
    title;
    description;
    trait;
    instructions;
    totalQuestions;
    maxScore;
    timeLimit;
    status;
    scoringLogic;
    resultCriteria;
    publicUrl;
    totalResponses;
    createdAt;
    updatedAt;
    createdBy;
    createdById;
    questions;
    responses;
};
exports.Assessment = Assessment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Assessment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Assessment.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Assessment.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], Assessment.prototype, "trait", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], Assessment.prototype, "instructions", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Assessment.prototype, "totalQuestions", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Assessment.prototype, "maxScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Assessment.prototype, "timeLimit", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AssessmentStatus,
        default: AssessmentStatus.DRAFT,
    }),
    __metadata("design:type", String)
], Assessment.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Assessment.prototype, "scoringLogic", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Assessment.prototype, "resultCriteria", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Assessment.prototype, "publicUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Assessment.prototype, "totalResponses", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Assessment.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Assessment.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.assessments),
    (0, typeorm_1.JoinColumn)({ name: 'createdById' }),
    __metadata("design:type", user_entity_1.User)
], Assessment.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Assessment.prototype, "createdById", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => assessment_question_entity_1.AssessmentQuestion, (question) => question.assessment),
    __metadata("design:type", Array)
], Assessment.prototype, "questions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => assessment_response_entity_1.AssessmentResponse, (response) => response.assessment),
    __metadata("design:type", Array)
], Assessment.prototype, "responses", void 0);
exports.Assessment = Assessment = __decorate([
    (0, typeorm_1.Entity)('assessments')
], Assessment);
//# sourceMappingURL=assessment.entity.js.map