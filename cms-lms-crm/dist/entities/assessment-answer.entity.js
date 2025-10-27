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
exports.AssessmentAnswer = void 0;
const typeorm_1 = require("typeorm");
const assessment_response_entity_1 = require("./assessment-response.entity");
const assessment_question_entity_1 = require("./assessment-question.entity");
let AssessmentAnswer = class AssessmentAnswer {
    id;
    textAnswer;
    numericAnswer;
    booleanAnswer;
    selectedOptions;
    pointsAwarded;
    createdAt;
    response;
    responseId;
    question;
    questionId;
};
exports.AssessmentAnswer = AssessmentAnswer;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AssessmentAnswer.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], AssessmentAnswer.prototype, "textAnswer", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], AssessmentAnswer.prototype, "numericAnswer", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Boolean)
], AssessmentAnswer.prototype, "booleanAnswer", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], AssessmentAnswer.prototype, "selectedOptions", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], AssessmentAnswer.prototype, "pointsAwarded", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AssessmentAnswer.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => assessment_response_entity_1.AssessmentResponse, (response) => response.answers, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'responseId' }),
    __metadata("design:type", assessment_response_entity_1.AssessmentResponse)
], AssessmentAnswer.prototype, "response", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AssessmentAnswer.prototype, "responseId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => assessment_question_entity_1.AssessmentQuestion),
    (0, typeorm_1.JoinColumn)({ name: 'questionId' }),
    __metadata("design:type", assessment_question_entity_1.AssessmentQuestion)
], AssessmentAnswer.prototype, "question", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AssessmentAnswer.prototype, "questionId", void 0);
exports.AssessmentAnswer = AssessmentAnswer = __decorate([
    (0, typeorm_1.Entity)('assessment_answers')
], AssessmentAnswer);
//# sourceMappingURL=assessment-answer.entity.js.map