import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AssessmentResponse } from './assessment-response.entity';
import { AssessmentQuestion } from './assessment-question.entity';
import { AssessmentQuestionOption } from './assessment-question-option.entity';

@Entity('assessment_answers')
export class AssessmentAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, type: 'text' })
  textAnswer: string; // For text/textarea questions

  @Column({ nullable: true })
  numericAnswer: number; // For rating/numeric questions

  @Column({ nullable: true })
  booleanAnswer: boolean; // For boolean questions

  @Column({ type: 'json', nullable: true })
  selectedOptions: string[]; // Array of option IDs for multiple choice

  @Column({ default: 0 })
  pointsAwarded: number;

  @CreateDateColumn()
  createdAt: Date;

  // Relationships
  @ManyToOne(() => AssessmentResponse, (response) => response.answers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'responseId' })
  response: AssessmentResponse;

  @Column()
  responseId: string;

  @ManyToOne(() => AssessmentQuestion)
  @JoinColumn({ name: 'questionId' })
  question: AssessmentQuestion;

  @Column()
  questionId: string;
}