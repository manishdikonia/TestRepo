import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { CrmLead } from './crm-lead.entity';
import { CrmField } from './crm-field.entity';

@Entity('crm_trackers')
export class CrmTracker {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ length: 100 })
  productName: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => User, (user) => user.crmTrackers)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column()
  createdById: string;

  @OneToMany(() => CrmLead, (lead) => lead.tracker)
  leads: CrmLead[];

  @ManyToMany(() => CrmField, (field) => field.trackers)
  @JoinTable({
    name: 'crm_tracker_fields',
    joinColumn: { name: 'trackerId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'fieldId', referencedColumnName: 'id' },
  })
  selectedFields: CrmField[];

  @ManyToMany(() => User, (user) => user.assignedTrackers)
  @JoinTable({
    name: 'crm_tracker_partners',
    joinColumn: { name: 'trackerId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'partnerId', referencedColumnName: 'id' },
  })
  assignedPartners: User[];
}