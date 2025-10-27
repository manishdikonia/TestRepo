import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Contact } from './contact.entity';
import { CrmTracker } from './crm-tracker.entity';
import { Assessment } from './assessment.entity';
import { Questionnaire } from './questionnaire.entity';
import { Campaign } from './campaign.entity';
import { AuditLog } from './audit-log.entity';

export enum UserRole {
  ADMIN = 'admin',
  INTERNAL_STAFF = 'internal_staff',
  PARTNER = 'partner',
  CLIENT = 'client',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ nullable: true, length: 20 })
  phoneNumber: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CLIENT,
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column({ nullable: true, length: 255 })
  company: string;

  @Column({ nullable: true, length: 100 })
  designation: string;

  @Column({ nullable: true, type: 'text' })
  profilePicture: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ nullable: true })
  lastLoginAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @OneToMany(() => Contact, (contact) => contact.createdBy)
  createdContacts: Contact[];

  @OneToMany(() => Contact, (contact) => contact.updatedBy)
  updatedContacts: Contact[];

  @OneToMany(() => CrmTracker, (tracker) => tracker.createdBy)
  crmTrackers: CrmTracker[];

  @ManyToMany(() => CrmTracker, (tracker) => tracker.assignedPartners)
  assignedTrackers: CrmTracker[];

  @OneToMany(() => Assessment, (assessment) => assessment.createdBy)
  assessments: Assessment[];

  @OneToMany(() => Questionnaire, (questionnaire) => questionnaire.createdBy)
  questionnaires: Questionnaire[];

  @OneToMany(() => Campaign, (campaign) => campaign.createdBy)
  campaigns: Campaign[];

  @OneToMany(() => AuditLog, (auditLog) => auditLog.user)
  auditLogs: AuditLog[];
}