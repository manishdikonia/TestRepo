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
import { Assessment } from './assessment.entity';
import { Contact } from './contact.entity';
import { AssessmentResponseAnswer } from './assessment-response-answer.entity';

@Entity('assessment_responses')
export class AssessmentResponse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', default: 0 })
  totalScore: number;

  @Column({ type: 'int', default: 0 })
  maxScore: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  percentage: number;

  @Column({ nullable: true })
  personalityType: string;

  @Column({ nullable: true })
  traits: string;

  @Column({ nullable: true })
  ranking: string;

  @Column({ type: 'uuid' })
  assessmentId: string;

  @Column({ type: 'uuid' })
  contactId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Assessment, (assessment) => assessment.responses)
  @JoinColumn({ name: 'assessmentId' })
  assessment: Assessment;

  @ManyToOne(() => Contact, (contact) => contact.assessmentResponses)
  @JoinColumn({ name: 'contactId' })
  contact: Contact;

  @OneToMany(() => AssessmentResponseAnswer, (answer) => answer.response)
  answers: AssessmentResponseAnswer[];
}