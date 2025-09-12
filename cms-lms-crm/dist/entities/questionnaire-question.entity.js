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
exports.QuestionnaireQuestion = exports.QuestionnaireQuestionType = void 0;
const typeorm_1 = require("typeorm");
const questionnaire_entity_1 = require("./questionnaire.entity");
const questionnaire_question_option_entity_1 = require("./questionnaire-question-option.entity");
var QuestionnaireQuestionType;
(function (QuestionnaireQuestionType) {
    QuestionnaireQuestionType["MULTIPLE_CHOICE"] = "multiple_choice";
    QuestionnaireQuestionType["SINGLE_CHOICE"] = "single_choice";
    QuestionnaireQuestionType["TEXT"] = "text";
    QuestionnaireQuestionType["TEXTAREA"] = "textarea";
    QuestionnaireQuestionType["RATING"] = "rating";
    QuestionnaireQuestionType["BOOLEAN"] = "boolean";
    QuestionnaireQuestionType["DATE"] = "date";
    QuestionnaireQuestionType["EMAIL"] = "email";
    QuestionnaireQuestionType["PHONE"] = "phone";
    QuestionnaireQuestionType["NUMBER"] = "number";
})(QuestionnaireQuestionType || (exports.QuestionnaireQuestionType = QuestionnaireQuestionType = {}));
let QuestionnaireQuestion = class QuestionnaireQuestion {
    id;
    questionText;
    type;
    sortOrder;
    isRequired;
    description;
    hint;
    minRating;
    maxRating;
    ratingLabel;
    minLength;
    maxLength;
    validationRegex;
    validationMessage;
    createdAt;
    updatedAt;
    questionnaire;
    questionnaireId;
    options;
};
exports.QuestionnaireQuestion = QuestionnaireQuestion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], QuestionnaireQuestion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], QuestionnaireQuestion.prototype, "questionText", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: QuestionnaireQuestionType,
    }),
    __metadata("design:type", String)
], QuestionnaireQuestion.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], QuestionnaireQuestion.prototype, "sortOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], QuestionnaireQuestion.prototype, "isRequired", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], QuestionnaireQuestion.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], QuestionnaireQuestion.prototype, "hint", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], QuestionnaireQuestion.prototype, "minRating", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], QuestionnaireQuestion.prototype, "maxRating", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 100 }),
    __metadata("design:type", String)
], QuestionnaireQuestion.prototype, "ratingLabel", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], QuestionnaireQuestion.prototype, "minLength", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], QuestionnaireQuestion.prototype, "maxLength", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], QuestionnaireQuestion.prototype, "validationRegex", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 255 }),
    __metadata("design:type", String)
], QuestionnaireQuestion.prototype, "validationMessage", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], QuestionnaireQuestion.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], QuestionnaireQuestion.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => questionnaire_entity_1.Questionnaire, (questionnaire) => questionnaire.questions, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'questionnaireId' }),
    __metadata("design:type", questionnaire_entity_1.Questionnaire)
], QuestionnaireQuestion.prototype, "questionnaire", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], QuestionnaireQuestion.prototype, "questionnaireId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => questionnaire_question_option_entity_1.QuestionnaireQuestionOption, (option) => option.question),
    __metadata("design:type", Array)
], QuestionnaireQuestion.prototype, "options", void 0);
exports.QuestionnaireQuestion = QuestionnaireQuestion = __decorate([
    (0, typeorm_1.Entity)('questionnaire_questions')
], QuestionnaireQuestion);
//# sourceMappingURL=questionnaire-question.entity.js.map