import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum AuditAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  VIEW = 'view',
  LOGIN = 'login',
  LOGOUT = 'logout',
  EXPORT = 'export',
  IMPORT = 'import',
}

export enum AuditEntityType {
  USER = 'user',
  CONTACT = 'contact',
  CATEGORY = 'category',
  CRM_TRACKER = 'crm_tracker',
  CRM_LEAD = 'crm_lead',
  ASSESSMENT = 'assessment',
  QUESTIONNAIRE = 'questionnaire',
  CAMPAIGN = 'campaign',
  EMAIL_TEMPLATE = 'email_template',
}

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: AuditAction,
  })
  action: AuditAction;

  @Column({
    type: 'enum',
    enum: AuditEntityType,
  })
  entityType: AuditEntityType;

  @Column({ nullable: true })
  entityId: string;

  @Column({ nullable: true, type: 'text' })
  entityName: string; // Human-readable name of the entity

  @Column({ type: 'json', nullable: true })
  oldValues: any; // Previous values (for updates)

  @Column({ type: 'json', nullable: true })
  newValues: any; // New values (for creates/updates)

  @Column({ nullable: true, type: 'text' })
  description: string; // Human-readable description of the action

  @Column({ nullable: true, length: 45 })
  ipAddress: string;

  @Column({ nullable: true, type: 'text' })
  userAgent: string;

  @CreateDateColumn()
  createdAt: Date;

  // Relationships
  @ManyToOne(() => User, (user) => user.auditLogs, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  userId: string;
}