import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { AssessmentResponse } from './assessment-response.entity';
import { AssessmentQuestion } from './assessment-question.entity';
import { AssessmentQuestionOption } from './assessment-question-option.entity';

@Entity('assessment_response_answers')
export class AssessmentResponseAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: true })
  answerText: string;

  @Column({ type: 'int', default: 0 })
  points: number;

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

  @ManyToOne(() => AssessmentResponse, (response) => response.answers)
  @JoinColumn({ name: 'responseId' })
  response: AssessmentResponse;

  @ManyToOne(() => AssessmentQuestion)
  @JoinColumn({ name: 'questionId' })
  question: AssessmentQuestion;

  @ManyToOne(() => AssessmentQuestionOption)
  @JoinColumn({ name: 'optionId' })
  option: AssessmentQuestionOption;
}