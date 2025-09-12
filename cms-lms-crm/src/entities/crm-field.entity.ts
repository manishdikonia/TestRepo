import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { CrmTracker } from './crm-tracker.entity';

export enum CrmFieldType {
  TEXT = 'text',
  NUMBER = 'number',
  EMAIL = 'email',
  PHONE = 'phone',
  DATE = 'date',
  DATETIME = 'datetime',
  SELECT = 'select',
  MULTISELECT = 'multiselect',
  TEXTAREA = 'textarea',
  BOOLEAN = 'boolean',
  URL = 'url',
}

@Entity('crm_fields')
export class CrmField {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100 })
  label: string;

  @Column({
    type: 'enum',
    enum: CrmFieldType,
  })
  fieldType: CrmFieldType;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ default: false })
  isRequired: boolean;

  @Column({ nullable: true, type: 'json' })
  options: string[]; // For select/multiselect fields

  @Column({ nullable: true, type: 'text' })
  defaultValue: string;

  @Column({ nullable: true, length: 255 })
  placeholder: string;

  @Column({ nullable: true })
  minLength: number;

  @Column({ nullable: true })
  maxLength: number;

  @Column({ nullable: true, type: 'text' })
  validationRegex: string;

  @Column({ nullable: true, length: 255 })
  validationMessage: string;

  @Column({ default: 0 })
  sortOrder: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @ManyToMany(() => CrmTracker, (tracker) => tracker.selectedFields)
  trackers: CrmTracker[];
}