import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CrmLead } from './crm-lead.entity';
import { User } from './user.entity';
import { LeadStatus } from './crm-lead.entity';

export enum UpdateType {
  STATUS_CHANGE = 'status_change',
  NOTE_ADDED = 'note_added',
  FOLLOW_UP = 'follow_up',
  MEETING = 'meeting',
  CALL = 'call',
  EMAIL = 'email',
  PROPOSAL_SENT = 'proposal_sent',
  DOCUMENT_SHARED = 'document_shared',
}

@Entity('crm_lead_updates')
export class CrmLeadUpdate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: UpdateType,
  })
  type: UpdateType;

  @Column({ nullable: true, length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true, type: 'enum', enum: LeadStatus })
  previousStatus: LeadStatus;

  @Column({ nullable: true, type: 'enum', enum: LeadStatus })
  newStatus: LeadStatus;

  @Column({ nullable: true, type: 'text' })
  attachmentUrl: string;

  @Column({ nullable: true, length: 100 })
  attachmentName: string;

  @CreateDateColumn()
  createdAt: Date;

  // Relationships
  @ManyToOne(() => CrmLead, (lead) => lead.updates, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'leadId' })
  lead: CrmLead;

  @Column()
  leadId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column()
  createdById: string;
}