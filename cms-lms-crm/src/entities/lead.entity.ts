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
import { User } from './user.entity';
import { CrmTracker } from './crm-tracker.entity';
import { LeadFieldValue } from './lead-field-value.entity';
import { LeadNote } from './lead-note.entity';

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

@Entity('leads')
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: LeadStatus,
    default: LeadStatus.NEW,
  })
  status: LeadStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  estimatedValue: number;

  @Column({ type: 'timestamp', nullable: true })
  expectedCloseDate: Date;

  @Column({ type: 'uuid' })
  contactId: string;

  @Column({ type: 'uuid' })
  trackerId: string;

  @Column({ type: 'uuid', nullable: true })
  assignedToId: string;

  @Column({ type: 'uuid' })
  createdById: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Contact, (contact) => contact.leads)
  @JoinColumn({ name: 'contactId' })
  contact: Contact;

  @ManyToOne(() => CrmTracker, (tracker) => tracker.leads)
  @JoinColumn({ name: 'trackerId' })
  tracker: CrmTracker;

  @ManyToOne(() => User, (user) => user.assignedLeads)
  @JoinColumn({ name: 'assignedToId' })
  assignedTo: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @OneToMany(() => LeadFieldValue, (fieldValue) => fieldValue.lead)
  fieldValues: LeadFieldValue[];

  @OneToMany(() => LeadNote, (note) => note.lead)
  notes: LeadNote[];
}