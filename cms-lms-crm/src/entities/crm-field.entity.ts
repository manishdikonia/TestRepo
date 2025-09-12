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
import { CrmTracker } from './crm-tracker.entity';
import { LeadFieldValue } from './lead-field-value.entity';

export enum FieldType {
  TEXT = 'text',
  NUMBER = 'number',
  EMAIL = 'email',
  PHONE = 'phone',
  DATE = 'date',
  SELECT = 'select',
  MULTI_SELECT = 'multi_select',
  TEXTAREA = 'textarea',
  BOOLEAN = 'boolean',
}

@Entity('crm_fields')
export class CrmField {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  label: string;

  @Column({
    type: 'enum',
    enum: FieldType,
  })
  type: FieldType;

  @Column({ default: false })
  isRequired: boolean;

  @Column({ type: 'json', nullable: true })
  options: string[]; // For select and multi-select fields

  @Column({ type: 'text', nullable: true })
  placeholder: string;

  @Column({ type: 'text', nullable: true })
  helpText: string;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ type: 'uuid' })
  trackerId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => CrmTracker, (tracker) => tracker.fields)
  @JoinColumn({ name: 'trackerId' })
  tracker: CrmTracker;

  @OneToMany(() => LeadFieldValue, (fieldValue) => fieldValue.field)
  fieldValues: LeadFieldValue[];
}