import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { QuestionnaireResponse } from './questionnaire-response.entity';
import { QuestionnaireQuestion } from './questionnaire-question.entity';

@Entity('questionnaire_answers')
export class QuestionnaireAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, type: 'text' })
  textAnswer: string; // For text/textarea/email/phone questions

  @Column({ nullable: true })
  numericAnswer: number; // For rating/numeric questions

  @Column({ nullable: true })
  booleanAnswer: boolean; // For boolean questions

  @Column({ nullable: true })
  dateAnswer: Date; // For date questions

  @Column({ type: 'json', nullable: true })
  selectedOptions: string[]; // Array of option IDs for multiple choice

  @CreateDateColumn()
  createdAt: Date;

  // Relationships
  @ManyToOne(() => QuestionnaireResponse, (response) => response.answers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'responseId' })
  response: QuestionnaireResponse;

  @Column()
  responseId: string;

  @ManyToOne(() => QuestionnaireQuestion)
  @JoinColumn({ name: 'questionId' })
  question: QuestionnaireQuestion;

  @Column()
  questionId: string;
}