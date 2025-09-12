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
import { ContactNote } from './contact-note.entity';
import { ContactActivity } from './contact-activity.entity';
import { SocialMediaProfile } from './social-media-profile.entity';
import { CrmLead } from './crm-lead.entity';
import { AssessmentResponse } from './assessment-response.entity';
import { QuestionnaireResponse } from './questionnaire-response.entity';

export enum ContactType {
  ENTREPRENEUR = 'entrepreneur',
  EMPLOYEE = 'employee',
}

@Entity('contacts')
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Standard Information
  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ length: 20 })
  contactNumber: string;

  @Column({ length: 255 })
  email: string;

  @Column({ nullable: true, length: 255 })
  location: string;

  @Column({
    type: 'enum',
    enum: ContactType,
    nullable: true,
  })
  contactType: ContactType;

  @Column({ nullable: true, length: 255 })
  company: string;

  @Column({ nullable: true, length: 100 })
  designation: string;

  @Column({ nullable: true, length: 100 })
  industry: string;

  @Column({ nullable: true, length: 255 })
  website: string;

  // Specific Information (from Assessments)
  @Column({ nullable: true, type: 'text' })
  innerDrives: string;

  @Column({ nullable: true, type: 'text' })
  baselines: string;

  @Column({ nullable: true, type: 'text' })
  traits: string;

  @Column({ nullable: true, length: 100 })
  personalityType: string;

  // Assessment-related fields
  @Column({ nullable: true, length: 100 })
  assessmentTrait: string; // Sales, Marketing, HR Management, etc.

  @Column({ nullable: true })
  assessmentScore: number;

  @Column({ nullable: true })
  assessmentMaxScore: number;

  @Column({ nullable: true, length: 50 })
  assessmentRanking: string;

  // Metadata
  @Column({ default: false })
  isDuplicate: boolean;

  @Column({ nullable: true })
  mergedWithContactId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => User, (user) => user.createdContacts)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column()
  createdById: string;

  @ManyToOne(() => User, (user) => user.updatedContacts, { nullable: true })
  @JoinColumn({ name: 'updatedById' })
  updatedBy: User;

  @Column({ nullable: true })
  updatedById: string;

  @ManyToMany(() => Category, (category) => category.contacts)
  @JoinTable({
    name: 'contact_categories',
    joinColumn: { name: 'contactId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'categoryId', referencedColumnName: 'id' },
  })
  categories: Category[];

  @OneToMany(() => ContactNote, (note) => note.contact)
  notes: ContactNote[];

  @OneToMany(() => ContactActivity, (activity) => activity.contact)
  activities: ContactActivity[];

  @OneToMany(() => SocialMediaProfile, (profile) => profile.contact)
  socialMediaProfiles: SocialMediaProfile[];

  @OneToMany(() => CrmLead, (lead) => lead.contact)
  crmLeads: CrmLead[];

  @OneToMany(() => AssessmentResponse, (response) => response.contact)
  assessmentResponses: AssessmentResponse[];

  @OneToMany(() => QuestionnaireResponse, (response) => response.contact)
  questionnaireResponses: QuestionnaireResponse[];
}