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
exports.AssessmentQuestion = exports.QuestionType = void 0;
const typeorm_1 = require("typeorm");
const assessment_entity_1 = require("./assessment.entity");
const assessment_question_option_entity_1 = require("./assessment-question-option.entity");
var QuestionType;
(function (QuestionType) {
    QuestionType["MULTIPLE_CHOICE"] = "multiple_choice";
    QuestionType["SINGLE_CHOICE"] = "single_choice";
    QuestionType["TEXT"] = "text";
    QuestionType["TEXTAREA"] = "textarea";
    QuestionType["RATING"] = "rating";
    QuestionType["BOOLEAN"] = "boolean";
})(QuestionType || (exports.QuestionType = QuestionType = {}));
let AssessmentQuestion = class AssessmentQuestion {
    id;
    questionText;
    type;
    sortOrder;
    isRequired;
    description;
    hint;
    points;
    minRating;
    maxRating;
    ratingLabel;
    createdAt;
    updatedAt;
    assessment;
    assessmentId;
    options;
};
exports.AssessmentQuestion = AssessmentQuestion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AssessmentQuestion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], AssessmentQuestion.prototype, "questionText", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: QuestionType,
    }),
    __metadata("design:type", String)
], AssessmentQuestion.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], AssessmentQuestion.prototype, "sortOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], AssessmentQuestion.prototype, "isRequired", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], AssessmentQuestion.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], AssessmentQuestion.prototype, "hint", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], AssessmentQuestion.prototype, "points", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], AssessmentQuestion.prototype, "minRating", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], AssessmentQuestion.prototype, "maxRating", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 100 }),
    __metadata("design:type", String)
], AssessmentQuestion.prototype, "ratingLabel", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AssessmentQuestion.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], AssessmentQuestion.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => assessment_entity_1.Assessment, (assessment) => assessment.questions, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'assessmentId' }),
    __metadata("design:type", assessment_entity_1.Assessment)
], AssessmentQuestion.prototype, "assessment", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AssessmentQuestion.prototype, "assessmentId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => assessment_question_option_entity_1.AssessmentQuestionOption, (option) => option.question),
    __metadata("design:type", Array)
], AssessmentQuestion.prototype, "options", void 0);
exports.AssessmentQuestion = AssessmentQuestion = __decorate([
    (0, typeorm_1.Entity)('assessment_questions')
], AssessmentQuestion);
//# sourceMappingURL=assessment-question.entity.js.map