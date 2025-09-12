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
import { Questionnaire } from './questionnaire.entity';
import { QuestionnaireQuestionOption } from './questionnaire-question-option.entity';

export enum QuestionnaireQuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  SINGLE_CHOICE = 'single_choice',
  TEXT = 'text',
  TEXTAREA = 'textarea',
  RATING = 'rating',
  BOOLEAN = 'boolean',
  DATE = 'date',
  EMAIL = 'email',
  PHONE = 'phone',
  NUMBER = 'number',
}

@Entity('questionnaire_questions')
export class QuestionnaireQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  questionText: string;

  @Column({
    type: 'enum',
    enum: QuestionnaireQuestionType,
  })
  type: QuestionnaireQuestionType;

  @Column({ default: 0 })
  sortOrder: number;

  @Column({ default: false })
  isRequired: boolean;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ nullable: true, type: 'text' })
  hint: string;

  @Column({ nullable: true })
  minRating: number; // For rating questions

  @Column({ nullable: true })
  maxRating: number; // For rating questions

  @Column({ nullable: true, length: 100 })
  ratingLabel: string; // Label for rating scale

  @Column({ nullable: true })
  minLength: number; // For text questions

  @Column({ nullable: true })
  maxLength: number; // For text questions

  @Column({ nullable: true, type: 'text' })
  validationRegex: string;

  @Column({ nullable: true, length: 255 })
  validationMessage: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => Questionnaire, (questionnaire) => questionnaire.questions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'questionnaireId' })
  questionnaire: Questionnaire;

  @Column()
  questionnaireId: string;

  @OneToMany(() => QuestionnaireQuestionOption, (option) => option.question)
  options: QuestionnaireQuestionOption[];
}