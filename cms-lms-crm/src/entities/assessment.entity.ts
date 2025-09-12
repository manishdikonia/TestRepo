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
import { AssessmentQuestion } from './assessment-question.entity';
import { AssessmentResponse } from './assessment-response.entity';

export enum AssessmentStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

@Entity('assessments')
export class Assessment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ length: 100 })
  trait: string; // Sales, Marketing, HR Management, People Management, etc.

  @Column({ nullable: true, type: 'text' })
  instructions: string;

  @Column({ default: 0 })
  totalQuestions: number;

  @Column({ default: 0 })
  maxScore: number;

  @Column({ nullable: true })
  timeLimit: number; // in minutes

  @Column({
    type: 'enum',
    enum: AssessmentStatus,
    default: AssessmentStatus.DRAFT,
  })
  status: AssessmentStatus;

  @Column({ type: 'json', nullable: true })
  scoringLogic: any; // Complex scoring rules

  @Column({ type: 'json', nullable: true })
  resultCriteria: any; // Result mapping based on scores

  @Column({ unique: true })
  publicUrl: string; // Unique URL for sharing

  @Column({ default: 0 })
  totalResponses: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => User, (user) => user.assessments)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column()
  createdById: string;

  @OneToMany(() => AssessmentQuestion, (question) => question.assessment)
  questions: AssessmentQuestion[];

  @OneToMany(() => AssessmentResponse, (response) => response.assessment)
  responses: AssessmentResponse[];
}