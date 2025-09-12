import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { QuestionnaireResponse } from './questionnaire-response.entity';
import { QuestionnaireQuestion } from './questionnaire-question.entity';
import { QuestionnaireQuestionOption } from './questionnaire-question-option.entity';

@Entity('questionnaire_response_answers')
export class QuestionnaireResponseAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: true })
  answerText: string;

  @Column({ type: 'uuid' })
  responseId: string;

  @Column({ type: 'uuid' })
  questionId: string;

  @Column({ type: 'uuid', nullable: true })
  optionId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => QuestionnaireResponse, (response) => response.answers)
  @JoinColumn({ name: 'responseId' })
  response: QuestionnaireResponse;

  @ManyToOne(() => QuestionnaireQuestion)
  @JoinColumn({ name: 'questionId' })
  question: QuestionnaireQuestion;

  @ManyToOne(() => QuestionnaireQuestionOption)
  @JoinColumn({ name: 'optionId' })
  option: QuestionnaireQuestionOption;
}