import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { QuestionnaireQuestion } from './questionnaire-question.entity';
import { QuestionnaireResponse } from './questionnaire-response.entity';

@Entity('questionnaires')
export class Questionnaire {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'uuid' })
  createdById: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.questionnaires)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @OneToMany(() => QuestionnaireQuestion, (question) => question.questionnaire)
  questions: QuestionnaireQuestion[];

  @OneToMany(() => QuestionnaireResponse, (response) => response.questionnaire)
  responses: QuestionnaireResponse[];
}