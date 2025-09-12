import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { QuestionnaireQuestion } from './questionnaire-question.entity';

@Entity('questionnaire_question_options')
export class QuestionnaireQuestionOption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ type: 'uuid' })
  questionId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => QuestionnaireQuestion, (question) => question.options)
  @JoinColumn({ name: 'questionId' })
  question: QuestionnaireQuestion;
}