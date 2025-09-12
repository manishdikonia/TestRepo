import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Lead } from './lead.entity';
import { CrmField } from './crm-field.entity';

@Entity('lead_field_values')
export class LeadFieldValue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: true })
  value: string;

  @Column({ type: 'uuid' })
  leadId: string;

  @Column({ type: 'uuid' })
  fieldId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Lead, (lead) => lead.fieldValues)
  @JoinColumn({ name: 'leadId' })
  lead: Lead;

  @ManyToOne(() => CrmField, (field) => field.fieldValues)
  @JoinColumn({ name: 'fieldId' })
  field: CrmField;
}