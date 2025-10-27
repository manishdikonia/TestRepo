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
exports.CrmLeadUpdate = exports.UpdateType = void 0;
const typeorm_1 = require("typeorm");
const crm_lead_entity_1 = require("./crm-lead.entity");
const user_entity_1 = require("./user.entity");
const crm_lead_entity_2 = require("./crm-lead.entity");
var UpdateType;
(function (UpdateType) {
    UpdateType["STATUS_CHANGE"] = "status_change";
    UpdateType["NOTE_ADDED"] = "note_added";
    UpdateType["FOLLOW_UP"] = "follow_up";
    UpdateType["MEETING"] = "meeting";
    UpdateType["CALL"] = "call";
    UpdateType["EMAIL"] = "email";
    UpdateType["PROPOSAL_SENT"] = "proposal_sent";
    UpdateType["DOCUMENT_SHARED"] = "document_shared";
})(UpdateType || (exports.UpdateType = UpdateType = {}));
let CrmLeadUpdate = class CrmLeadUpdate {
    id;
    type;
    title;
    description;
    previousStatus;
    newStatus;
    attachmentUrl;
    attachmentName;
    createdAt;
    lead;
    leadId;
    createdBy;
    createdById;
};
exports.CrmLeadUpdate = CrmLeadUpdate;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CrmLeadUpdate.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: UpdateType,
    }),
    __metadata("design:type", String)
], CrmLeadUpdate.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 255 }),
    __metadata("design:type", String)
], CrmLeadUpdate.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], CrmLeadUpdate.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'enum', enum: crm_lead_entity_2.LeadStatus }),
    __metadata("design:type", String)
], CrmLeadUpdate.prototype, "previousStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'enum', enum: crm_lead_entity_2.LeadStatus }),
    __metadata("design:type", String)
], CrmLeadUpdate.prototype, "newStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], CrmLeadUpdate.prototype, "attachmentUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 100 }),
    __metadata("design:type", String)
], CrmLeadUpdate.prototype, "attachmentName", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CrmLeadUpdate.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => crm_lead_entity_1.CrmLead, (lead) => lead.updates, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'leadId' }),
    __metadata("design:type", crm_lead_entity_1.CrmLead)
], CrmLeadUpdate.prototype, "lead", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CrmLeadUpdate.prototype, "leadId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'createdById' }),
    __metadata("design:type", user_entity_1.User)
], CrmLeadUpdate.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CrmLeadUpdate.prototype, "createdById", void 0);
exports.CrmLeadUpdate = CrmLeadUpdate = __decorate([
    (0, typeorm_1.Entity)('crm_lead_updates')
], CrmLeadUpdate);
//# sourceMappingURL=crm-lead-update.entity.js.map