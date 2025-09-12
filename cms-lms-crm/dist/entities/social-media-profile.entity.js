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
exports.SocialMediaProfile = exports.SocialMediaPlatform = void 0;
const typeorm_1 = require("typeorm");
const contact_entity_1 = require("./contact.entity");
var SocialMediaPlatform;
(function (SocialMediaPlatform) {
    SocialMediaPlatform["FACEBOOK"] = "facebook";
    SocialMediaPlatform["LINKEDIN"] = "linkedin";
    SocialMediaPlatform["INSTAGRAM"] = "instagram";
    SocialMediaPlatform["TWITTER"] = "twitter";
    SocialMediaPlatform["YOUTUBE"] = "youtube";
    SocialMediaPlatform["WHATSAPP"] = "whatsapp";
    SocialMediaPlatform["TELEGRAM"] = "telegram";
    SocialMediaPlatform["OTHER"] = "other";
})(SocialMediaPlatform || (exports.SocialMediaPlatform = SocialMediaPlatform = {}));
let SocialMediaProfile = class SocialMediaProfile {
    id;
    platform;
    profileUrl;
    username;
    isActive;
    createdAt;
    updatedAt;
    contact;
    contactId;
};
exports.SocialMediaProfile = SocialMediaProfile;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SocialMediaProfile.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: SocialMediaPlatform,
    }),
    __metadata("design:type", String)
], SocialMediaProfile.prototype, "platform", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], SocialMediaProfile.prototype, "profileUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, length: 100 }),
    __metadata("design:type", String)
], SocialMediaProfile.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], SocialMediaProfile.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], SocialMediaProfile.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], SocialMediaProfile.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => contact_entity_1.Contact, (contact) => contact.socialMediaProfiles, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'contactId' }),
    __metadata("design:type", contact_entity_1.Contact)
], SocialMediaProfile.prototype, "contact", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SocialMediaProfile.prototype, "contactId", void 0);
exports.SocialMediaProfile = SocialMediaProfile = __decorate([
    (0, typeorm_1.Entity)('social_media_profiles')
], SocialMediaProfile);
//# sourceMappingURL=social-media-profile.entity.js.map