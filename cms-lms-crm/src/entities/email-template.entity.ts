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
import { User } from './user.entity';
import { Campaign } from './campaign.entity';

export enum TemplateType {
  EMAIL = 'email',
  WHATSAPP = 'whatsapp',
  SMS = 'sms',
}

@Entity('email_templates')
export class EmailTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: TemplateType,
    default: TemplateType.EMAIL,
  })
  type: TemplateType;

  @Column({ nullable: true, length: 255 })
  subject: string; // For email templates

  @Column({ type: 'text' })
  htmlContent: string;

  @Column({ nullable: true, type: 'text' })
  textContent: string; // Plain text version

  @Column({ type: 'json', nullable: true })
  variables: string[]; // Available template variables

  @Column({ default: false })
  isDefault: boolean;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column()
  createdById: string;

  @OneToMany(() => Campaign, (campaign) => campaign.emailTemplate)
  campaigns: Campaign[];
}