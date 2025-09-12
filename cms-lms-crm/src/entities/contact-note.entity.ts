import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Contact } from './contact.entity';
import { User } from './user.entity';

export enum NoteType {
  GENERAL = 'general',
  MEETING = 'meeting',
  CALL = 'call',
  EMAIL = 'email',
  DOCUMENT = 'document',
}

@Entity('contact_notes')
export class ContactNote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'enum',
    enum: NoteType,
    default: NoteType.GENERAL,
  })
  type: NoteType;

  @Column({ nullable: true, length: 255 })
  title: string;

  @Column({ nullable: true, type: 'text' })
  attachmentUrl: string;

  @Column({ nullable: true, length: 100 })
  attachmentName: string;

  @Column({ nullable: true })
  attachmentSize: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => Contact, (contact) => contact.notes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'contactId' })
  contact: Contact;

  @Column()
  contactId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column()
  createdById: string;
}