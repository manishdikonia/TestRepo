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
exports.ContactNote = exports.NoteType = void 0;
const typeorm_1 = require("typeorm");
const contact_entity_1 = require("./contact.entity");
const user_entity_1 = require("./user.entity");
var NoteType;
(function (NoteType) {
    NoteType["GENERAL"] = "general";
    NoteType["MEETING"] = "meeting";
    NoteType["CALL"] = "call";
    NoteType["EMAIL"] = "email";
    NoteType["DOCUMENT"] = "document";
})(NoteType || (exports.NoteType = NoteType = {}));
let ContactNote = class ContactNote {
    id;
    content;
    type;
    title;
    attachmentUrl;
    attachmentName;
    attachmentSize;
    createdAt;
    updatedAt;
    contact;
    contactId;
    createdBy;
    createdById;
};
exports.ContactNote = ContactNote;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ContactNote.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], ContactNote.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: NoteType,
        default: NoteType.GENERAL,
    }),
    __metadata("design:type", String)
], ContactNote.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 255 }),
    __metadata("design:type", String)
], ContactNote.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], ContactNote.prototype, "attachmentUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 100 }),
    __metadata("design:type", String)
], ContactNote.prototype, "attachmentName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], ContactNote.prototype, "attachmentSize", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ContactNote.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ContactNote.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => contact_entity_1.Contact, (contact) => contact.notes, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'contactId' }),
    __metadata("design:type", contact_entity_1.Contact)
], ContactNote.prototype, "contact", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ContactNote.prototype, "contactId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'createdById' }),
    __metadata("design:type", user_entity_1.User)
], ContactNote.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ContactNote.prototype, "createdById", void 0);
exports.ContactNote = ContactNote = __decorate([
    (0, typeorm_1.Entity)('contact_notes')
], ContactNote);
//# sourceMappingURL=contact-note.entity.js.map