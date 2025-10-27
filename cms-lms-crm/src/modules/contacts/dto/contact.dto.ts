import { IsString, IsEmail, IsEnum, IsOptional, IsUUID, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ContactType } from '../../../entities/contact.entity';
import { SocialPlatform } from '../../../entities/contact-social-link.entity';
import { ActivityType } from '../../../entities/contact-activity.entity';

export class CreateContactDto {
  @IsString()
  name: string;

  @IsString()
  contactNo: string;

  @IsEmail()
  emailId: string;

  @IsString()
  location: string;

  @IsEnum(ContactType)
  type: ContactType;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  designation?: string;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  innerDrives?: string;

  @IsOptional()
  @IsString()
  baselines?: string;

  @IsOptional()
  @IsString()
  traits?: string;

  @IsOptional()
  @IsString()
  personalityType?: string;

  @IsUUID()
  categoryId: string;
}

export class UpdateContactDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  contactNo?: string;

  @IsOptional()
  @IsEmail()
  emailId?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsEnum(ContactType)
  type?: ContactType;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  designation?: string;

  @IsOptional()
  @IsString()
  industry?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  innerDrives?: string;

  @IsOptional()
  @IsString()
  baselines?: string;

  @IsOptional()
  @IsString()
  traits?: string;

  @IsOptional()
  @IsString()
  personalityType?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;
}

export class CreateContactNoteDto {
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  attachmentUrl?: string;

  @IsOptional()
  @IsString()
  attachmentName?: string;
}

export class CreateContactActivityDto {
  @IsEnum(ActivityType)
  type: ActivityType;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  scheduledAt?: Date;
}

export class CreateSocialLinkDto {
  @IsEnum(SocialPlatform)
  platform: SocialPlatform;

  @IsString()
  url: string;

  @IsOptional()
  @IsString()
  username?: string;
}

export class CreateContactCategoryDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateContactCategoryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  isActive?: boolean;
}

export class DuplicateMergeDto {
  @IsArray()
  @IsUUID(4, { each: true })
  contactIds: string[];

  @IsString()
  primaryContactId: string;
}