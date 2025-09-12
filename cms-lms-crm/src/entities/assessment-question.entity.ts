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
import { AssessmentQuestionOption } from './assessment-question-option.entity';

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  SINGLE_CHOICE = 'single_choice',
  TEXT = 'text',
  TEXTAREA = 'textarea',
  RATING = 'rating',
  BOOLEAN = 'boolean',
}

@Entity('assessment_questions')
export class AssessmentQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  questionText: string;

  @Column({
    type: 'enum',
    enum: QuestionType,
  })
  type: QuestionType;

  @Column({ default: 0 })
  sortOrder: number;

  @Column({ default: false })
  isRequired: boolean;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ nullable: true, type: 'text' })
  hint: string;

  @Column({ default: 0 })
  points: number; // Points for correct answer

  @Column({ nullable: true })
  minRating: number; // For rating questions

  @Column({ nullable: true })
  maxRating: number; // For rating questions

  @Column({ nullable: true, length: 100 })
  ratingLabel: string; // Label for rating scale

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => Assessment, (assessment) => assessment.questions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'assessmentId' })
  assessment: Assessment;

  @Column()
  assessmentId: string;

  @OneToMany(() => AssessmentQuestionOption, (option) => option.question)
  options: AssessmentQuestionOption[];
}