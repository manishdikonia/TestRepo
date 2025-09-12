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
import { AssessmentQuestion } from './assessment-question.entity';
import { AssessmentResponse } from './assessment-response.entity';

export enum AssessmentTrait {
  SALES = 'sales',
  MARKETING = 'marketing',
  HR_MANAGEMENT = 'hr_management',
  PEOPLE_MANAGEMENT = 'people_management',
  LEADERSHIP = 'leadership',
  COMMUNICATION = 'communication',
  TECHNICAL = 'technical',
  CREATIVITY = 'creativity',
}

@Entity('assessments')
export class Assessment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: AssessmentTrait,
  })
  trait: AssessmentTrait;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isPublic: boolean;

  @Column({ nullable: true })
  publicUrl: string;

  @Column({ type: 'json', nullable: true })
  scoringLogic: any; // Store scoring rules and result criteria

  @Column({ type: 'uuid' })
  createdById: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.assessments)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @OneToMany(() => AssessmentQuestion, (question) => question.assessment)
  questions: AssessmentQuestion[];

  @OneToMany(() => AssessmentResponse, (response) => response.assessment)
  responses: AssessmentResponse[];
}