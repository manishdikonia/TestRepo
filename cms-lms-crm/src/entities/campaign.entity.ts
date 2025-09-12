import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Category } from './category.entity';
import { Contact } from './contact.entity';
import { CampaignMessage } from './campaign-message.entity';
import { EmailTemplate } from './email-template.entity';

export enum CampaignType {
  EMAIL = 'email',
  WHATSAPP = 'whatsapp',
  SMS = 'sms',
}

export enum CampaignStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  RUNNING = 'running',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('campaigns')
export class Campaign {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: CampaignType,
  })
  type: CampaignType;

  @Column({
    type: 'enum',
    enum: CampaignStatus,
    default: CampaignStatus.DRAFT,
  })
  status: CampaignStatus;

  @Column({ nullable: true, length: 255 })
  subject: string; // For email campaigns

  @Column({ nullable: true, type: 'text' })
  messageContent: string;

  @Column({ nullable: true })
  scheduledAt: Date;

  @Column({ nullable: true })
  startedAt: Date;

  @Column({ nullable: true })
  completedAt: Date;

  @Column({ default: 0 })
  totalRecipients: number;

  @Column({ default: 0 })
  sentCount: number;

  @Column({ default: 0 })
  deliveredCount: number;

  @Column({ default: 0 })
  openedCount: number; // For email campaigns

  @Column({ default: 0 })
  clickedCount: number; // For email campaigns

  @Column({ default: 0 })
  bounceCount: number;

  @Column({ default: 0 })
  unsubscribeCount: number;

  @Column({ type: 'json', nullable: true })
  filterCriteria: any; // Advanced filtering criteria

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => User, (user) => user.campaigns)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column()
  createdById: string;

  @ManyToOne(() => EmailTemplate, { nullable: true })
  @JoinColumn({ name: 'emailTemplateId' })
  emailTemplate: EmailTemplate;

  @Column({ nullable: true })
  emailTemplateId: string;

  @ManyToMany(() => Category)
  @JoinTable({
    name: 'campaign_categories',
    joinColumn: { name: 'campaignId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'categoryId', referencedColumnName: 'id' },
  })
  targetCategories: Category[];

  @ManyToMany(() => Contact)
  @JoinTable({
    name: 'campaign_recipients',
    joinColumn: { name: 'campaignId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'contactId', referencedColumnName: 'id' },
  })
  recipients: Contact[];

  @OneToMany(() => CampaignMessage, (message) => message.campaign)
  messages: CampaignMessage[];
}