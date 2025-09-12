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

export enum SocialPlatform {
  FACEBOOK = 'facebook',
  LINKEDIN = 'linkedin',
  INSTAGRAM = 'instagram',
  TWITTER = 'twitter',
  YOUTUBE = 'youtube',
  OTHER = 'other',
}

@Entity('contact_social_links')
export class ContactSocialLink {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: SocialPlatform,
  })
  platform: SocialPlatform;

  @Column()
  url: string;

  @Column({ nullable: true })
  username: string;

  @Column({ type: 'uuid' })
  contactId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Contact, (contact) => contact.socialLinks)
  @JoinColumn({ name: 'contactId' })
  contact: Contact;
}