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
import { Contact } from './contact.entity';
import { QuestionnaireAnswer } from './questionnaire-answer.entity';

export enum QuestionnaireResponseStatus {
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ABANDONED = 'abandoned',
}

@Entity('questionnaire_responses')
export class QuestionnaireResponse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: QuestionnaireResponseStatus,
    default: QuestionnaireResponseStatus.IN_PROGRESS,
  })
  status: QuestionnaireResponseStatus;

  @Column({ nullable: true })
  completionPercentage: number;

  @Column({ nullable: true })
  startedAt: Date;

  @Column({ nullable: true })
  completedAt: Date;

  @Column({ nullable: true })
  timeTaken: number; // in minutes

  @Column({ nullable: true, length: 45 })
  ipAddress: string;

  @Column({ nullable: true, type: 'text' })
  userAgent: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => Questionnaire, (questionnaire) => questionnaire.responses)
  @JoinColumn({ name: 'questionnaireId' })
  questionnaire: Questionnaire;

  @Column()
  questionnaireId: string;

  @ManyToOne(() => Contact, (contact) => contact.questionnaireResponses)
  @JoinColumn({ name: 'contactId' })
  contact: Contact;

  @Column()
  contactId: string;

  @OneToMany(() => QuestionnaireAnswer, (answer) => answer.response)
  answers: QuestionnaireAnswer[];
}