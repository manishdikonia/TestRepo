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
exports.Contact = exports.ContactType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const category_entity_1 = require("./category.entity");
const contact_note_entity_1 = require("./contact-note.entity");
const contact_activity_entity_1 = require("./contact-activity.entity");
const social_media_profile_entity_1 = require("./social-media-profile.entity");
const crm_lead_entity_1 = require("./crm-lead.entity");
const assessment_response_entity_1 = require("./assessment-response.entity");
const questionnaire_response_entity_1 = require("./questionnaire-response.entity");
var ContactType;
(function (ContactType) {
    ContactType["ENTREPRENEUR"] = "entrepreneur";
    ContactType["EMPLOYEE"] = "employee";
})(ContactType || (exports.ContactType = ContactType = {}));
let Contact = class Contact {
    id;
    firstName;
    lastName;
    contactNumber;
    email;
    location;
    contactType;
    company;
    designation;
    industry;
    website;
    innerDrives;
    baselines;
    traits;
    personalityType;
    assessmentTrait;
    assessmentScore;
    assessmentMaxScore;
    assessmentRanking;
    isDuplicate;
    mergedWithContactId;
    createdAt;
    updatedAt;
    createdBy;
    createdById;
    updatedBy;
    updatedById;
    categories;
    notes;
    activities;
    socialMediaProfiles;
    crmLeads;
    assessmentResponses;
    questionnaireResponses;
};
exports.Contact = Contact;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Contact.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], Contact.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], Contact.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20 }),
    __metadata("design:type", String)
], Contact.prototype, "contactNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Contact.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 255 }),
    __metadata("design:type", String)
], Contact.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ContactType,
        nullable: true,
    }),
    __metadata("design:type", String)
], Contact.prototype, "contactType", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 255 }),
    __metadata("design:type", String)
], Contact.prototype, "company", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 100 }),
    __metadata("design:type", String)
], Contact.prototype, "designation", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 100 }),
    __metadata("design:type", String)
], Contact.prototype, "industry", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 255 }),
    __metadata("design:type", String)
], Contact.prototype, "website", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], Contact.prototype, "innerDrives", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], Contact.prototype, "baselines", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], Contact.prototype, "traits", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 100 }),
    __metadata("design:type", String)
], Contact.prototype, "personalityType", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 100 }),
    __metadata("design:type", String)
], Contact.prototype, "assessmentTrait", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Contact.prototype, "assessmentScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Contact.prototype, "assessmentMaxScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 50 }),
    __metadata("design:type", String)
], Contact.prototype, "assessmentRanking", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Contact.prototype, "isDuplicate", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Contact.prototype, "mergedWithContactId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Contact.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Contact.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.createdContacts),
    (0, typeorm_1.JoinColumn)({ name: 'createdById' }),
    __metadata("design:type", user_entity_1.User)
], Contact.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Contact.prototype, "createdById", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.updatedContacts, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'updatedById' }),
    __metadata("design:type", user_entity_1.User)
], Contact.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Contact.prototype, "updatedById", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => category_entity_1.Category, (category) => category.contacts),
    (0, typeorm_1.JoinTable)({
        name: 'contact_categories',
        joinColumn: { name: 'contactId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'categoryId', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], Contact.prototype, "categories", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => contact_note_entity_1.ContactNote, (note) => note.contact),
    __metadata("design:type", Array)
], Contact.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => contact_activity_entity_1.ContactActivity, (activity) => activity.contact),
    __metadata("design:type", Array)
], Contact.prototype, "activities", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => social_media_profile_entity_1.SocialMediaProfile, (profile) => profile.contact),
    __metadata("design:type", Array)
], Contact.prototype, "socialMediaProfiles", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => crm_lead_entity_1.CrmLead, (lead) => lead.contact),
    __metadata("design:type", Array)
], Contact.prototype, "crmLeads", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => assessment_response_entity_1.AssessmentResponse, (response) => response.contact),
    __metadata("design:type", Array)
], Contact.prototype, "assessmentResponses", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => questionnaire_response_entity_1.QuestionnaireResponse, (response) => response.contact),
    __metadata("design:type", Array)
], Contact.prototype, "questionnaireResponses", void 0);
exports.Contact = Contact = __decorate([
    (0, typeorm_1.Entity)('contacts')
], Contact);
//# sourceMappingURL=contact.entity.js.map