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
  text: string;

  @Column({ type: 'int', default: 0 })
  points: number;

  @Column({ default: false })
  isCorrect: boolean;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ type: 'uuid' })
  questionId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => AssessmentQuestion, (question) => question.options)
  @JoinColumn({ name: 'questionId' })
  question: AssessmentQuestion;
}