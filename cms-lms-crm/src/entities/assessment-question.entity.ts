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
  SUBJECTIVE = 'subjective',
  RATING_SCALE = 'rating_scale',
  TRUE_FALSE = 'true_false',
}

@Entity('assessment_questions')
export class AssessmentQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  question: string;

  @Column({
    type: 'enum',
    enum: QuestionType,
  })
  type: QuestionType;

  @Column({ type: 'int', default: 0 })
  points: number;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ type: 'uuid' })
  assessmentId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Assessment, (assessment) => assessment.questions)
  @JoinColumn({ name: 'assessmentId' })
  assessment: Assessment;

  @OneToMany(() => AssessmentQuestionOption, (option) => option.question)
  options: AssessmentQuestionOption[];
}