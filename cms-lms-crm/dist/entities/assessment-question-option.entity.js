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
exports.AssessmentQuestionOption = void 0;
const typeorm_1 = require("typeorm");
const assessment_question_entity_1 = require("./assessment-question.entity");
let AssessmentQuestionOption = class AssessmentQuestionOption {
    id;
    optionText;
    sortOrder;
    isCorrect;
    points;
    explanation;
    createdAt;
    updatedAt;
    question;
    questionId;
};
exports.AssessmentQuestionOption = AssessmentQuestionOption;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AssessmentQuestionOption.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], AssessmentQuestionOption.prototype, "optionText", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], AssessmentQuestionOption.prototype, "sortOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], AssessmentQuestionOption.prototype, "isCorrect", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], AssessmentQuestionOption.prototype, "points", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], AssessmentQuestionOption.prototype, "explanation", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AssessmentQuestionOption.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], AssessmentQuestionOption.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => assessment_question_entity_1.AssessmentQuestion, (question) => question.options, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'questionId' }),
    __metadata("design:type", assessment_question_entity_1.AssessmentQuestion)
], AssessmentQuestionOption.prototype, "question", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AssessmentQuestionOption.prototype, "questionId", void 0);
exports.AssessmentQuestionOption = AssessmentQuestionOption = __decorate([
    (0, typeorm_1.Entity)('assessment_question_options')
], AssessmentQuestionOption);
//# sourceMappingURL=assessment-question-option.entity.js.map