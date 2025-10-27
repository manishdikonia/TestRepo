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
exports.User = exports.UserStatus = exports.UserRole = void 0;
const typeorm_1 = require("typeorm");
const contact_entity_1 = require("./contact.entity");
const crm_tracker_entity_1 = require("./crm-tracker.entity");
const assessment_entity_1 = require("./assessment.entity");
const questionnaire_entity_1 = require("./questionnaire.entity");
const campaign_entity_1 = require("./campaign.entity");
const audit_log_entity_1 = require("./audit-log.entity");
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["INTERNAL_STAFF"] = "internal_staff";
    UserRole["PARTNER"] = "partner";
    UserRole["CLIENT"] = "client";
})(UserRole || (exports.UserRole = UserRole = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "active";
    UserStatus["INACTIVE"] = "inactive";
    UserStatus["SUSPENDED"] = "suspended";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
let User = class User {
    id;
    firstName;
    lastName;
    email;
    phoneNumber;
    password;
    role;
    status;
    company;
    designation;
    profilePicture;
    isEmailVerified;
    lastLoginAt;
    createdAt;
    updatedAt;
    createdContacts;
    updatedContacts;
    crmTrackers;
    assignedTrackers;
    assessments;
    questionnaires;
    campaigns;
    auditLogs;
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true, length: 255 }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 20 }),
    __metadata("design:type", String)
], User.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: UserRole,
        default: UserRole.CLIENT,
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: UserStatus,
        default: UserStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], User.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 255 }),
    __metadata("design:type", String)
], User.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 100 }),
    __metadata("design:type", String)
], User.prototype, "designation", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], User.prototype, "profilePicture", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isEmailVerified", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "lastLoginAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => contact_entity_1.Contact, (contact) => contact.createdBy),
    __metadata("design:type", Array)
], User.prototype, "createdContacts", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => contact_entity_1.Contact, (contact) => contact.updatedBy),
    __metadata("design:type", Array)
], User.prototype, "updatedContacts", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => crm_tracker_entity_1.CrmTracker, (tracker) => tracker.createdBy),
    __metadata("design:type", Array)
], User.prototype, "crmTrackers", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => crm_tracker_entity_1.CrmTracker, (tracker) => tracker.assignedPartners),
    __metadata("design:type", Array)
], User.prototype, "assignedTrackers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => assessment_entity_1.Assessment, (assessment) => assessment.createdBy),
    __metadata("design:type", Array)
], User.prototype, "assessments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => questionnaire_entity_1.Questionnaire, (questionnaire) => questionnaire.createdBy),
    __metadata("design:type", Array)
], User.prototype, "questionnaires", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => campaign_entity_1.Campaign, (campaign) => campaign.createdBy),
    __metadata("design:type", Array)
], User.prototype, "campaigns", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => audit_log_entity_1.AuditLog, (auditLog) => auditLog.user),
    __metadata("design:type", Array)
], User.prototype, "auditLogs", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users')
], User);
//# sourceMappingURL=user.entity.js.map