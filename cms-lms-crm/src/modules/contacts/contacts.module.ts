import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import { Contact } from '../../entities/contact.entity';
import { ContactCategory } from '../../entities/contact-category.entity';
import { ContactNote } from '../../entities/contact-note.entity';
import { ContactActivity } from '../../entities/contact-activity.entity';
import { ContactSocialLink } from '../../entities/contact-social-link.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Contact,
      ContactCategory,
      ContactNote,
      ContactActivity,
      ContactSocialLink,
    ]),
  ],
  controllers: [ContactsController],
  providers: [ContactsService],
  exports: [ContactsService],
})
export class ContactsModule {}