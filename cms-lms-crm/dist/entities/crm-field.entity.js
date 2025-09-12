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
exports.CrmField = exports.CrmFieldType = void 0;
const typeorm_1 = require("typeorm");
const crm_tracker_entity_1 = require("./crm-tracker.entity");
var CrmFieldType;
(function (CrmFieldType) {
    CrmFieldType["TEXT"] = "text";
    CrmFieldType["NUMBER"] = "number";
    CrmFieldType["EMAIL"] = "email";
    CrmFieldType["PHONE"] = "phone";
    CrmFieldType["DATE"] = "date";
    CrmFieldType["DATETIME"] = "datetime";
    CrmFieldType["SELECT"] = "select";
    CrmFieldType["MULTISELECT"] = "multiselect";
    CrmFieldType["TEXTAREA"] = "textarea";
    CrmFieldType["BOOLEAN"] = "boolean";
    CrmFieldType["URL"] = "url";
})(CrmFieldType || (exports.CrmFieldType = CrmFieldType = {}));
let CrmField = class CrmField {
    id;
    name;
    label;
    fieldType;
    description;
    isRequired;
    options;
    defaultValue;
    placeholder;
    minLength;
    maxLength;
    validationRegex;
    validationMessage;
    sortOrder;
    isActive;
    createdAt;
    updatedAt;
    trackers;
};
exports.CrmField = CrmField;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CrmField.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], CrmField.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], CrmField.prototype, "label", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: CrmFieldType,
    }),
    __metadata("design:type", String)
], CrmField.prototype, "fieldType", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], CrmField.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], CrmField.prototype, "isRequired", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'json' }),
    __metadata("design:type", Array)
], CrmField.prototype, "options", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], CrmField.prototype, "defaultValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 255 }),
    __metadata("design:type", String)
], CrmField.prototype, "placeholder", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], CrmField.prototype, "minLength", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], CrmField.prototype, "maxLength", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], CrmField.prototype, "validationRegex", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 255 }),
    __metadata("design:type", String)
], CrmField.prototype, "validationMessage", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], CrmField.prototype, "sortOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], CrmField.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CrmField.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], CrmField.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => crm_tracker_entity_1.CrmTracker, (tracker) => tracker.selectedFields),
    __metadata("design:type", Array)
], CrmField.prototype, "trackers", void 0);
exports.CrmField = CrmField = __decorate([
    (0, typeorm_1.Entity)('crm_fields')
], CrmField);
//# sourceMappingURL=crm-field.entity.js.map