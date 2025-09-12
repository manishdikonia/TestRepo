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
import { ContactCategory } from './contact-category.entity';
import { ContactNote } from './contact-note.entity';
import { ContactActivity } from './contact-activity.entity';
import { ContactSocialLink } from './contact-social-link.entity';
import { Lead } from './lead.entity';
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

  @Column()
  name: string;

  @Column({ unique: true })
  contactNo: string;

  @Column({ unique: true })
  emailId: string;

  @Column()
  location: string;

  @Column({
    type: 'enum',
    enum: ContactType,
  })
  type: ContactType;

  @Column({ nullable: true })
  company: string;

  @Column({ nullable: true })
  designation: string;

  @Column({ nullable: true })
  industry: string;

  @Column({ nullable: true })
  website: string;

  // Specific Information Fields
  @Column({ type: 'text', nullable: true })
  innerDrives: string;

  @Column({ type: 'text', nullable: true })
  baselines: string;

  @Column({ type: 'text', nullable: true })
  traits: string;

  @Column({ nullable: true })
  personalityType: string;

  @Column({ type: 'uuid' })
  categoryId: string;

  @Column({ type: 'uuid' })
  createdById: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => ContactCategory, (category) => category.contacts)
  @JoinColumn({ name: 'categoryId' })
  category: ContactCategory;

  @ManyToOne(() => User, (user) => user.contacts)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @OneToMany(() => ContactNote, (note) => note.contact)
  notes: ContactNote[];

  @OneToMany(() => ContactActivity, (activity) => activity.contact)
  activities: ContactActivity[];

  @OneToMany(() => ContactSocialLink, (socialLink) => socialLink.contact)
  socialLinks: ContactSocialLink[];

  @OneToMany(() => Lead, (lead) => lead.contact)
  leads: Lead[];

  @OneToMany(() => AssessmentResponse, (response) => response.contact)
  assessmentResponses: AssessmentResponse[];

  @OneToMany(() => QuestionnaireResponse, (response) => response.contact)
  questionnaireResponses: QuestionnaireResponse[];
}