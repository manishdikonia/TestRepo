import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Contact, ContactType } from '../../entities/contact.entity';
import { ContactCategory } from '../../entities/contact-category.entity';
import { ContactNote } from '../../entities/contact-note.entity';
import { ContactActivity } from '../../entities/contact-activity.entity';
import { ContactSocialLink } from '../../entities/contact-social-link.entity';
import { User } from '../../entities/user.entity';
import {
  CreateContactDto,
  UpdateContactDto,
  CreateContactNoteDto,
  CreateContactActivityDto,
  CreateSocialLinkDto,
  CreateContactCategoryDto,
  UpdateContactCategoryDto,
  DuplicateMergeDto,
} from './dto/contact.dto';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
    @InjectRepository(ContactCategory)
    private categoryRepository: Repository<ContactCategory>,
    @InjectRepository(ContactNote)
    private noteRepository: Repository<ContactNote>,
    @InjectRepository(ContactActivity)
    private activityRepository: Repository<ContactActivity>,
    @InjectRepository(ContactSocialLink)
    private socialLinkRepository: Repository<ContactSocialLink>,
  ) {}

  // Contact CRUD operations
  async createContact(createContactDto: CreateContactDto, userId: string): Promise<Contact> {
    // Check for duplicates
    const existingContact = await this.contactRepository.findOne({
      where: [
        { contactNo: createContactDto.contactNo },
        { emailId: createContactDto.emailId },
      ],
    });

    if (existingContact) {
      throw new ConflictException('Contact with this phone number or email already exists');
    }

    const contact = this.contactRepository.create({
      ...createContactDto,
      createdById: userId,
    });

    return this.contactRepository.save(contact);
  }

  async findAllContacts(
    page: number = 1,
    limit: number = 10,
    categoryId?: string,
    type?: ContactType,
    search?: string,
  ): Promise<{ contacts: Contact[]; total: number }> {
    const queryBuilder = this.contactRepository
      .createQueryBuilder('contact')
      .leftJoinAndSelect('contact.category', 'category')
      .leftJoinAndSelect('contact.createdBy', 'createdBy')
      .leftJoinAndSelect('contact.notes', 'notes')
      .leftJoinAndSelect('contact.activities', 'activities')
      .leftJoinAndSelect('contact.socialLinks', 'socialLinks');

    if (categoryId) {
      queryBuilder.andWhere('contact.categoryId = :categoryId', { categoryId });
    }

    if (type) {
      queryBuilder.andWhere('contact.type = :type', { type });
    }

    if (search) {
      queryBuilder.andWhere(
        '(contact.name ILIKE :search OR contact.emailId ILIKE :search OR contact.contactNo ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const [contacts, total] = await queryBuilder
      .orderBy('contact.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { contacts, total };
  }

  async findContactById(id: string): Promise<Contact> {
    const contact = await this.contactRepository.findOne({
      where: { id },
      relations: [
        'category',
        'createdBy',
        'notes',
        'activities',
        'socialLinks',
        'leads',
        'assessmentResponses',
        'questionnaireResponses',
      ],
    });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    return contact;
  }

  async updateContact(id: string, updateContactDto: UpdateContactDto): Promise<Contact> {
    const contact = await this.findContactById(id);

    // Check for duplicates if contactNo or emailId is being updated
    if (updateContactDto.contactNo || updateContactDto.emailId) {
      const existingContact = await this.contactRepository.findOne({
        where: [
          { contactNo: updateContactDto.contactNo },
          { emailId: updateContactDto.emailId },
        ],
      });

      if (existingContact && existingContact.id !== id) {
        throw new ConflictException('Contact with this phone number or email already exists');
      }
    }

    Object.assign(contact, updateContactDto);
    return this.contactRepository.save(contact);
  }

  async deleteContact(id: string): Promise<void> {
    const contact = await this.findContactById(id);
    await this.contactRepository.remove(contact);
  }

  // Contact Categories
  async createCategory(createCategoryDto: CreateContactCategoryDto): Promise<ContactCategory> {
    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  async findAllCategories(): Promise<ContactCategory[]> {
    return this.categoryRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async updateCategory(id: string, updateCategoryDto: UpdateContactCategoryDto): Promise<ContactCategory> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    Object.assign(category, updateCategoryDto);
    return this.categoryRepository.save(category);
  }

  async deleteCategory(id: string): Promise<void> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Check if category has contacts
    const contactCount = await this.contactRepository.count({ where: { categoryId: id } });
    if (contactCount > 0) {
      throw new BadRequestException('Cannot delete category with existing contacts');
    }

    await this.categoryRepository.remove(category);
  }

  // Contact Notes
  async addNote(contactId: string, createNoteDto: CreateContactNoteDto, userId: string): Promise<ContactNote> {
    const contact = await this.findContactById(contactId);
    
    const note = this.noteRepository.create({
      ...createNoteDto,
      contactId: contact.id,
      createdById: userId,
    });

    return this.noteRepository.save(note);
  }

  async updateNote(noteId: string, updateNoteDto: Partial<CreateContactNoteDto>): Promise<ContactNote> {
    const note = await this.noteRepository.findOne({ where: { id: noteId } });
    if (!note) {
      throw new NotFoundException('Note not found');
    }

    Object.assign(note, updateNoteDto);
    return this.noteRepository.save(note);
  }

  async deleteNote(noteId: string): Promise<void> {
    const note = await this.noteRepository.findOne({ where: { id: noteId } });
    if (!note) {
      throw new NotFoundException('Note not found');
    }

    await this.noteRepository.remove(note);
  }

  // Contact Activities
  async addActivity(contactId: string, createActivityDto: CreateContactActivityDto, userId: string): Promise<ContactActivity> {
    const contact = await this.findContactById(contactId);
    
    const activity = this.activityRepository.create({
      ...createActivityDto,
      contactId: contact.id,
      createdById: userId,
    });

    return this.activityRepository.save(activity);
  }

  async updateActivity(activityId: string, updateActivityDto: Partial<CreateContactActivityDto>): Promise<ContactActivity> {
    const activity = await this.activityRepository.findOne({ where: { id: activityId } });
    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    Object.assign(activity, updateActivityDto);
    return this.activityRepository.save(activity);
  }

  async completeActivity(activityId: string): Promise<ContactActivity> {
    const activity = await this.activityRepository.findOne({ where: { id: activityId } });
    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    activity.isCompleted = true;
    return this.activityRepository.save(activity);
  }

  async deleteActivity(activityId: string): Promise<void> {
    const activity = await this.activityRepository.findOne({ where: { id: activityId } });
    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    await this.activityRepository.remove(activity);
  }

  // Social Links
  async addSocialLink(contactId: string, createSocialLinkDto: CreateSocialLinkDto): Promise<ContactSocialLink> {
    const contact = await this.findContactById(contactId);
    
    const socialLink = this.socialLinkRepository.create({
      ...createSocialLinkDto,
      contactId: contact.id,
    });

    return this.socialLinkRepository.save(socialLink);
  }

  async updateSocialLink(socialLinkId: string, updateSocialLinkDto: Partial<CreateSocialLinkDto>): Promise<ContactSocialLink> {
    const socialLink = await this.socialLinkRepository.findOne({ where: { id: socialLinkId } });
    if (!socialLink) {
      throw new NotFoundException('Social link not found');
    }

    Object.assign(socialLink, updateSocialLinkDto);
    return this.socialLinkRepository.save(socialLink);
  }

  async deleteSocialLink(socialLinkId: string): Promise<void> {
    const socialLink = await this.socialLinkRepository.findOne({ where: { id: socialLinkId } });
    if (!socialLink) {
      throw new NotFoundException('Social link not found');
    }

    await this.socialLinkRepository.remove(socialLink);
  }

  // Duplicate Management
  async findDuplicates(): Promise<Contact[]> {
    const duplicates = await this.contactRepository
      .createQueryBuilder('contact')
      .select('contact.name, contact.contactNo')
      .groupBy('contact.name, contact.contactNo')
      .having('COUNT(*) > 1')
      .getRawMany();

    if (duplicates.length === 0) {
      return [];
    }

    const duplicateContacts = await this.contactRepository.find({
      where: duplicates.map(dup => ({
        name: dup.contact_name,
        contactNo: dup.contact_contactNo,
      })),
      relations: ['category', 'createdBy'],
    });

    return duplicateContacts;
  }

  async mergeDuplicates(mergeDto: DuplicateMergeDto): Promise<Contact> {
    const { contactIds, primaryContactId } = mergeDto;

    if (!contactIds.includes(primaryContactId)) {
      throw new BadRequestException('Primary contact must be included in the merge list');
    }

    const contacts = await this.contactRepository.find({
      where: { id: In(contactIds) },
      relations: ['notes', 'activities', 'socialLinks', 'leads'],
    });

    if (contacts.length !== contactIds.length) {
      throw new NotFoundException('One or more contacts not found');
    }

    const primaryContact = contacts.find(c => c.id === primaryContactId);
    const otherContacts = contacts.filter(c => c.id !== primaryContactId);

    if (!primaryContact) {
      throw new NotFoundException('Primary contact not found');
    }

    // Merge data from other contacts
    for (const contact of otherContacts) {
      // Merge notes
      for (const note of contact.notes) {
        note.contactId = primaryContact.id;
        await this.noteRepository.save(note);
      }

      // Merge activities
      for (const activity of contact.activities) {
        activity.contactId = primaryContact.id;
        await this.activityRepository.save(activity);
      }

      // Merge social links
      for (const socialLink of contact.socialLinks) {
        socialLink.contactId = primaryContact.id;
        await this.socialLinkRepository.save(socialLink);
      }

      // Update leads
      for (const lead of contact.leads) {
        lead.contactId = primaryContact.id;
        await this.contactRepository.manager.save(lead);
      }

      // Delete the duplicate contact
      await this.contactRepository.remove(contact);
    }

    return this.findContactById(primaryContact.id);
  }
}