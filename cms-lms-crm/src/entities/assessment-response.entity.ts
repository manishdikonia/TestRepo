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
import { AssessmentAnswer } from './assessment-answer.entity';

export enum ResponseStatus {
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned',
}

@Entity('assessment_responses')
export class AssessmentResponse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ResponseStatus,
    default: ResponseStatus.IN_PROGRESS,
  })
  status: ResponseStatus;

  @Column({ default: 0 })
  totalScore: number;

  @Column({ default: 0 })
  maxPossibleScore: number;

  @Column({ nullable: true })
  completionPercentage: number;

  @Column({ nullable: true })
  startedAt: Date;

  @Column({ nullable: true })
  completedAt: Date;

  @Column({ nullable: true })
  timeTaken: number; // in minutes

  @Column({ nullable: true, length: 50 })
  resultRanking: string; // Based on scoring criteria

  @Column({ nullable: true, type: 'text' })
  resultDescription: string;

  @Column({ nullable: true, length: 100 })
  personalityType: string;

  @Column({ nullable: true, type: 'text' })
  traits: string;

  @Column({ nullable: true, type: 'text' })
  innerDrives: string;

  @Column({ nullable: true, type: 'text' })
  baselines: string;

  @Column({ nullable: true, length: 45 })
  ipAddress: string;

  @Column({ nullable: true, type: 'text' })
  userAgent: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => Assessment, (assessment) => assessment.responses)
  @JoinColumn({ name: 'assessmentId' })
  assessment: Assessment;

  @Column()
  assessmentId: string;

  @ManyToOne(() => Contact, (contact) => contact.assessmentResponses, { nullable: true })
  @JoinColumn({ name: 'contactId' })
  contact: Contact;

  @Column({ nullable: true })
  contactId: string;

  @OneToMany(() => AssessmentAnswer, (answer) => answer.response)
  answers: AssessmentAnswer[];
}