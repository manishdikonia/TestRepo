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
import { QuestionnaireResponseAnswer } from './questionnaire-response-answer.entity';

@Entity('questionnaire_responses')
export class QuestionnaireResponse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  questionnaireId: string;

  @Column({ type: 'uuid' })
  contactId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Questionnaire, (questionnaire) => questionnaire.responses)
  @JoinColumn({ name: 'questionnaireId' })
  questionnaire: Questionnaire;

  @ManyToOne(() => Contact, (contact) => contact.questionnaireResponses)
  @JoinColumn({ name: 'contactId' })
  contact: Contact;

  @OneToMany(() => QuestionnaireResponseAnswer, (answer) => answer.response)
  answers: QuestionnaireResponseAnswer[];
}