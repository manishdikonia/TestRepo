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
exports.CrmLead = exports.LeadPriority = exports.LeadStatus = void 0;
const typeorm_1 = require("typeorm");
const contact_entity_1 = require("./contact.entity");
const crm_tracker_entity_1 = require("./crm-tracker.entity");
const user_entity_1 = require("./user.entity");
const crm_lead_update_entity_1 = require("./crm-lead-update.entity");
var LeadStatus;
(function (LeadStatus) {
    LeadStatus["NEW"] = "new";
    LeadStatus["CONTACTED"] = "contacted";
    LeadStatus["QUALIFIED"] = "qualified";
    LeadStatus["PROPOSAL"] = "proposal";
    LeadStatus["NEGOTIATION"] = "negotiation";
    LeadStatus["CLOSED_WON"] = "closed_won";
    LeadStatus["CLOSED_LOST"] = "closed_lost";
    LeadStatus["ON_HOLD"] = "on_hold";
})(LeadStatus || (exports.LeadStatus = LeadStatus = {}));
var LeadPriority;
(function (LeadPriority) {
    LeadPriority["LOW"] = "low";
    LeadPriority["MEDIUM"] = "medium";
    LeadPriority["HIGH"] = "high";
    LeadPriority["URGENT"] = "urgent";
})(LeadPriority || (exports.LeadPriority = LeadPriority = {}));
let CrmLead = class CrmLead {
    id;
    status;
    priority;
    estimatedValue;
    expectedCloseDate;
    notes;
    customFieldValues;
    lastContactDate;
    nextFollowUpDate;
    createdAt;
    updatedAt;
    contact;
    contactId;
    tracker;
    trackerId;
    assignedTo;
    assignedToId;
    createdBy;
    createdById;
    updates;
};
exports.CrmLead = CrmLead;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CrmLead.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: LeadStatus,
        default: LeadStatus.NEW,
    }),
    __metadata("design:type", String)
], CrmLead.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: LeadPriority,
        default: LeadPriority.MEDIUM,
    }),
    __metadata("design:type", String)
], CrmLead.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], CrmLead.prototype, "estimatedValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], CrmLead.prototype, "expectedCloseDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], CrmLead.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], CrmLead.prototype, "customFieldValues", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], CrmLead.prototype, "lastContactDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], CrmLead.prototype, "nextFollowUpDate", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CrmLead.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], CrmLead.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => contact_entity_1.Contact, (contact) => contact.crmLeads),
    (0, typeorm_1.JoinColumn)({ name: 'contactId' }),
    __metadata("design:type", contact_entity_1.Contact)
], CrmLead.prototype, "contact", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CrmLead.prototype, "contactId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => crm_tracker_entity_1.CrmTracker, (tracker) => tracker.leads),
    (0, typeorm_1.JoinColumn)({ name: 'trackerId' }),
    __metadata("design:type", crm_tracker_entity_1.CrmTracker)
], CrmLead.prototype, "tracker", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CrmLead.prototype, "trackerId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'assignedToId' }),
    __metadata("design:type", user_entity_1.User)
], CrmLead.prototype, "assignedTo", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CrmLead.prototype, "assignedToId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'createdById' }),
    __metadata("design:type", user_entity_1.User)
], CrmLead.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CrmLead.prototype, "createdById", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => crm_lead_update_entity_1.CrmLeadUpdate, (update) => update.lead),
    __metadata("design:type", Array)
], CrmLead.prototype, "updates", void 0);
exports.CrmLead = CrmLead = __decorate([
    (0, typeorm_1.Entity)('crm_leads')
], CrmLead);
//# sourceMappingURL=crm-lead.entity.js.map