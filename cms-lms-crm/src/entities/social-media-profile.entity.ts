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

export enum SocialMediaPlatform {
  FACEBOOK = 'facebook',
  LINKEDIN = 'linkedin',
  INSTAGRAM = 'instagram',
  TWITTER = 'twitter',
  YOUTUBE = 'youtube',
  WHATSAPP = 'whatsapp',
  TELEGRAM = 'telegram',
  OTHER = 'other',
}

@Entity('social_media_profiles')
export class SocialMediaProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: SocialMediaPlatform,
  })
  platform: SocialMediaPlatform;

  @Column({ length: 255 })
  profileUrl: string;

  @Column({ nullable: true, length: 100 })
  username: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => Contact, (contact) => contact.socialMediaProfiles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'contactId' })
  contact: Contact;

  @Column()
  contactId: string;
}