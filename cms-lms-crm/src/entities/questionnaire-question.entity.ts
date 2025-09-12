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
  TEXT = 'text',
  RATING_SCALE = 'rating_scale',
  YES_NO = 'yes_no',
  CHECKBOX = 'checkbox',
}

@Entity('questionnaire_questions')
export class QuestionnaireQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  question: string;

  @Column({
    type: 'enum',
    enum: QuestionnaireQuestionType,
  })
  type: QuestionnaireQuestionType;

  @Column({ default: false })
  isRequired: boolean;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ type: 'text', nullable: true })
  helpText: string;

  @Column({ type: 'uuid' })
  questionnaireId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Questionnaire, (questionnaire) => questionnaire.questions)
  @JoinColumn({ name: 'questionnaireId' })
  questionnaire: Questionnaire;

  @OneToMany(() => QuestionnaireQuestionOption, (option) => option.question)
  options: QuestionnaireQuestionOption[];
}