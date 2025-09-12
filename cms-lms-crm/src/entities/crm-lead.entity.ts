import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Contact } from './contact.entity';
import { CrmTracker } from './crm-tracker.entity';
import { User } from './user.entity';
import { CrmLeadUpdate } from './crm-lead-update.entity';

export enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  QUALIFIED = 'qualified',
  PROPOSAL = 'proposal',
  NEGOTIATION = 'negotiation',
  CLOSED_WON = 'closed_won',
  CLOSED_LOST = 'closed_lost',
  ON_HOLD = 'on_hold',
}

export enum LeadPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

@Entity('crm_leads')
export class CrmLead {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: LeadStatus,
    default: LeadStatus.NEW,
  })
  status: LeadStatus;

  @Column({
    type: 'enum',
    enum: LeadPriority,
    default: LeadPriority.MEDIUM,
  })
  priority: LeadPriority;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  estimatedValue: number;

  @Column({ nullable: true })
  expectedCloseDate: Date;

  @Column({ nullable: true, type: 'text' })
  notes: string;

  @Column({ type: 'json', nullable: true })
  customFieldValues: Record<string, any>; // Dynamic field values

  @Column({ nullable: true })
  lastContactDate: Date;

  @Column({ nullable: true })
  nextFollowUpDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => Contact, (contact) => contact.crmLeads)
  @JoinColumn({ name: 'contactId' })
  contact: Contact;

  @Column()
  contactId: string;

  @ManyToOne(() => CrmTracker, (tracker) => tracker.leads)
  @JoinColumn({ name: 'trackerId' })
  tracker: CrmTracker;

  @Column()
  trackerId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'assignedToId' })
  assignedTo: User;

  @Column({ nullable: true })
  assignedToId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column()
  createdById: string;

  @OneToMany(() => CrmLeadUpdate, (update) => update.lead)
  updates: CrmLeadUpdate[];
}