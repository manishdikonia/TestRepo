import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AssessmentQuestion } from './assessment-question.entity';

@Entity('assessment_question_options')
export class AssessmentQuestionOption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  optionText: string;

  @Column({ default: 0 })
  sortOrder: number;

  @Column({ default: false })
  isCorrect: boolean;

  @Column({ default: 0 })
  points: number; // Points awarded for selecting this option

  @Column({ nullable: true, type: 'text' })
  explanation: string; // Explanation for why this is correct/incorrect

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => AssessmentQuestion, (question) => question.options, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'questionId' })
  question: AssessmentQuestion;

  @Column()
  questionId: string;
}