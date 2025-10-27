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
exports.CrmTracker = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const crm_lead_entity_1 = require("./crm-lead.entity");
const crm_field_entity_1 = require("./crm-field.entity");
let CrmTracker = class CrmTracker {
    id;
    name;
    description;
    productName;
    isActive;
    createdAt;
    updatedAt;
    createdBy;
    createdById;
    leads;
    selectedFields;
    assignedPartners;
};
exports.CrmTracker = CrmTracker;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CrmTracker.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], CrmTracker.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], CrmTracker.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], CrmTracker.prototype, "productName", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], CrmTracker.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CrmTracker.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], CrmTracker.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.crmTrackers),
    (0, typeorm_1.JoinColumn)({ name: 'createdById' }),
    __metadata("design:type", user_entity_1.User)
], CrmTracker.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CrmTracker.prototype, "createdById", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => crm_lead_entity_1.CrmLead, (lead) => lead.tracker),
    __metadata("design:type", Array)
], CrmTracker.prototype, "leads", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => crm_field_entity_1.CrmField, (field) => field.trackers),
    (0, typeorm_1.JoinTable)({
        name: 'crm_tracker_fields',
        joinColumn: { name: 'trackerId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'fieldId', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], CrmTracker.prototype, "selectedFields", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => user_entity_1.User, (user) => user.assignedTrackers),
    (0, typeorm_1.JoinTable)({
        name: 'crm_tracker_partners',
        joinColumn: { name: 'trackerId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'partnerId', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], CrmTracker.prototype, "assignedPartners", void 0);
exports.CrmTracker = CrmTracker = __decorate([
    (0, typeorm_1.Entity)('crm_trackers')
], CrmTracker);
//# sourceMappingURL=crm-tracker.entity.js.map