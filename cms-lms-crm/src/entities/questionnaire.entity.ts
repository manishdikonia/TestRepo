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
import { User } from './user.entity';
import { QuestionnaireQuestion } from './questionnaire-question.entity';
import { QuestionnaireResponse } from './questionnaire-response.entity';

export enum QuestionnaireStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

@Entity('questionnaires')
export class Questionnaire {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true, type: 'text' })
  instructions: string;

  @Column({
    type: 'enum',
    enum: QuestionnaireStatus,
    default: QuestionnaireStatus.DRAFT,
  })
  status: QuestionnaireStatus;

  @Column({ default: 0 })
  totalQuestions: number;

  @Column({ nullable: true })
  estimatedTime: number; // in minutes

  @Column({ default: 0 })
  totalResponses: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => User, (user) => user.questionnaires)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column()
  createdById: string;

  @OneToMany(() => QuestionnaireQuestion, (question) => question.questionnaire)
  questions: QuestionnaireQuestion[];

  @OneToMany(() => QuestionnaireResponse, (response) => response.questionnaire)
  responses: QuestionnaireResponse[];
}