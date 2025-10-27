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
exports.EmailTemplate = exports.TemplateType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const campaign_entity_1 = require("./campaign.entity");
var TemplateType;
(function (TemplateType) {
    TemplateType["EMAIL"] = "email";
    TemplateType["WHATSAPP"] = "whatsapp";
    TemplateType["SMS"] = "sms";
})(TemplateType || (exports.TemplateType = TemplateType = {}));
let EmailTemplate = class EmailTemplate {
    id;
    name;
    description;
    type;
    subject;
    htmlContent;
    textContent;
    variables;
    isDefault;
    isActive;
    createdAt;
    updatedAt;
    createdBy;
    createdById;
    campaigns;
};
exports.EmailTemplate = EmailTemplate;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], EmailTemplate.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], EmailTemplate.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], EmailTemplate.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TemplateType,
        default: TemplateType.EMAIL,
    }),
    __metadata("design:type", String)
], EmailTemplate.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 255 }),
    __metadata("design:type", String)
], EmailTemplate.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], EmailTemplate.prototype, "htmlContent", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], EmailTemplate.prototype, "textContent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Array)
], EmailTemplate.prototype, "variables", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], EmailTemplate.prototype, "isDefault", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], EmailTemplate.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], EmailTemplate.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], EmailTemplate.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'createdById' }),
    __metadata("design:type", user_entity_1.User)
], EmailTemplate.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], EmailTemplate.prototype, "createdById", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => campaign_entity_1.Campaign, (campaign) => campaign.emailTemplate),
    __metadata("design:type", Array)
], EmailTemplate.prototype, "campaigns", void 0);
exports.EmailTemplate = EmailTemplate = __decorate([
    (0, typeorm_1.Entity)('email_templates')
], EmailTemplate);
//# sourceMappingURL=email-template.entity.js.map