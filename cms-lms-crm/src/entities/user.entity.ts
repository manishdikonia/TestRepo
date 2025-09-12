import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcryptjs';
import { Contact } from './contact.entity';
import { Lead } from './lead.entity';
import { Assessment } from './assessment.entity';
import { Questionnaire } from './questionnaire.entity';

export enum UserRole {
  ADMIN = 'admin',
  INTERNAL_STAFF = 'internal_staff',
  PARTNER = 'partner',
  LEAD = 'lead',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.INTERNAL_STAFF,
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  company: string;

  @Column({ nullable: true })
  designation: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Contact, (contact) => contact.createdBy)
  contacts: Contact[];

  @OneToMany(() => Lead, (lead) => lead.assignedTo)
  assignedLeads: Lead[];

  @OneToMany(() => Assessment, (assessment) => assessment.createdBy)
  assessments: Assessment[];

  @OneToMany(() => Questionnaire, (questionnaire) => questionnaire.createdBy)
  questionnaires: Questionnaire[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 12);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}