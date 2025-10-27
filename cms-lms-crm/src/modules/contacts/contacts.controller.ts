import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ContactsService } from './contacts.service';
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
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User, UserRole } from '../../entities/user.entity';
import { ContactType } from '../../entities/contact.entity';

@ApiTags('Contacts')
@Controller('contacts')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.INTERNAL_STAFF)
  @ApiOperation({ summary: 'Create a new contact' })
  @ApiResponse({ status: 201, description: 'Contact created successfully' })
  @ApiResponse({ status: 409, description: 'Contact already exists' })
  async createContact(
    @Body() createContactDto: CreateContactDto,
    @CurrentUser() user: User,
  ) {
    return this.contactsService.createContact(createContactDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all contacts with pagination and filters' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'categoryId', required: false, type: String })
  @ApiQuery({ name: 'type', required: false, enum: ContactType })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Contacts retrieved successfully' })
  async findAllContacts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('categoryId') categoryId?: string,
    @Query('type') type?: ContactType,
    @Query('search') search?: string,
  ) {
    return this.contactsService.findAllContacts(page, limit, categoryId, type, search);
  }

  @Get('duplicates')
  @Roles(UserRole.ADMIN, UserRole.INTERNAL_STAFF)
  @ApiOperation({ summary: 'Find duplicate contacts' })
  @ApiResponse({ status: 200, description: 'Duplicate contacts found' })
  async findDuplicates() {
    return this.contactsService.findDuplicates();
  }

  @Post('merge')
  @Roles(UserRole.ADMIN, UserRole.INTERNAL_STAFF)
  @ApiOperation({ summary: 'Merge duplicate contacts' })
  @ApiResponse({ status: 200, description: 'Contacts merged successfully' })
  async mergeDuplicates(@Body() mergeDto: DuplicateMergeDto) {
    return this.contactsService.mergeDuplicates(mergeDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get contact by ID' })
  @ApiResponse({ status: 200, description: 'Contact retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  async findContactById(@Param('id', ParseUUIDPipe) id: string) {
    return this.contactsService.findContactById(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.INTERNAL_STAFF)
  @ApiOperation({ summary: 'Update contact' })
  @ApiResponse({ status: 200, description: 'Contact updated successfully' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  async updateContact(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateContactDto: UpdateContactDto,
  ) {
    return this.contactsService.updateContact(id, updateContactDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.INTERNAL_STAFF)
  @ApiOperation({ summary: 'Delete contact' })
  @ApiResponse({ status: 200, description: 'Contact deleted successfully' })
  @ApiResponse({ status: 404, description: 'Contact not found' })
  async deleteContact(@Param('id', ParseUUIDPipe) id: string) {
    await this.contactsService.deleteContact(id);
    return { message: 'Contact deleted successfully' };
  }

  // Contact Notes
  @Post(':id/notes')
  @Roles(UserRole.ADMIN, UserRole.INTERNAL_STAFF)
  @ApiOperation({ summary: 'Add note to contact' })
  @ApiResponse({ status: 201, description: 'Note added successfully' })
  async addNote(
    @Param('id', ParseUUIDPipe) contactId: string,
    @Body() createNoteDto: CreateContactNoteDto,
    @CurrentUser() user: User,
  ) {
    return this.contactsService.addNote(contactId, createNoteDto, user.id);
  }

  @Patch('notes/:noteId')
  @Roles(UserRole.ADMIN, UserRole.INTERNAL_STAFF)
  @ApiOperation({ summary: 'Update contact note' })
  @ApiResponse({ status: 200, description: 'Note updated successfully' })
  async updateNote(
    @Param('noteId', ParseUUIDPipe) noteId: string,
    @Body() updateNoteDto: Partial<CreateContactNoteDto>,
  ) {
    return this.contactsService.updateNote(noteId, updateNoteDto);
  }

  @Delete('notes/:noteId')
  @Roles(UserRole.ADMIN, UserRole.INTERNAL_STAFF)
  @ApiOperation({ summary: 'Delete contact note' })
  @ApiResponse({ status: 200, description: 'Note deleted successfully' })
  async deleteNote(@Param('noteId', ParseUUIDPipe) noteId: string) {
    await this.contactsService.deleteNote(noteId);
    return { message: 'Note deleted successfully' };
  }

  // Contact Activities
  @Post(':id/activities')
  @Roles(UserRole.ADMIN, UserRole.INTERNAL_STAFF)
  @ApiOperation({ summary: 'Add activity to contact' })
  @ApiResponse({ status: 201, description: 'Activity added successfully' })
  async addActivity(
    @Param('id', ParseUUIDPipe) contactId: string,
    @Body() createActivityDto: CreateContactActivityDto,
    @CurrentUser() user: User,
  ) {
    return this.contactsService.addActivity(contactId, createActivityDto, user.id);
  }

  @Patch('activities/:activityId')
  @Roles(UserRole.ADMIN, UserRole.INTERNAL_STAFF)
  @ApiOperation({ summary: 'Update contact activity' })
  @ApiResponse({ status: 200, description: 'Activity updated successfully' })
  async updateActivity(
    @Param('activityId', ParseUUIDPipe) activityId: string,
    @Body() updateActivityDto: Partial<CreateContactActivityDto>,
  ) {
    return this.contactsService.updateActivity(activityId, updateActivityDto);
  }

  @Patch('activities/:activityId/complete')
  @Roles(UserRole.ADMIN, UserRole.INTERNAL_STAFF)
  @ApiOperation({ summary: 'Mark activity as completed' })
  @ApiResponse({ status: 200, description: 'Activity marked as completed' })
  async completeActivity(@Param('activityId', ParseUUIDPipe) activityId: string) {
    return this.contactsService.completeActivity(activityId);
  }

  @Delete('activities/:activityId')
  @Roles(UserRole.ADMIN, UserRole.INTERNAL_STAFF)
  @ApiOperation({ summary: 'Delete contact activity' })
  @ApiResponse({ status: 200, description: 'Activity deleted successfully' })
  async deleteActivity(@Param('activityId', ParseUUIDPipe) activityId: string) {
    await this.contactsService.deleteActivity(activityId);
    return { message: 'Activity deleted successfully' };
  }

  // Social Links
  @Post(':id/social-links')
  @Roles(UserRole.ADMIN, UserRole.INTERNAL_STAFF)
  @ApiOperation({ summary: 'Add social link to contact' })
  @ApiResponse({ status: 201, description: 'Social link added successfully' })
  async addSocialLink(
    @Param('id', ParseUUIDPipe) contactId: string,
    @Body() createSocialLinkDto: CreateSocialLinkDto,
  ) {
    return this.contactsService.addSocialLink(contactId, createSocialLinkDto);
  }

  @Patch('social-links/:socialLinkId')
  @Roles(UserRole.ADMIN, UserRole.INTERNAL_STAFF)
  @ApiOperation({ summary: 'Update social link' })
  @ApiResponse({ status: 200, description: 'Social link updated successfully' })
  async updateSocialLink(
    @Param('socialLinkId', ParseUUIDPipe) socialLinkId: string,
    @Body() updateSocialLinkDto: Partial<CreateSocialLinkDto>,
  ) {
    return this.contactsService.updateSocialLink(socialLinkId, updateSocialLinkDto);
  }

  @Delete('social-links/:socialLinkId')
  @Roles(UserRole.ADMIN, UserRole.INTERNAL_STAFF)
  @ApiOperation({ summary: 'Delete social link' })
  @ApiResponse({ status: 200, description: 'Social link deleted successfully' })
  async deleteSocialLink(@Param('socialLinkId', ParseUUIDPipe) socialLinkId: string) {
    await this.contactsService.deleteSocialLink(socialLinkId);
    return { message: 'Social link deleted successfully' };
  }

  // Categories
  @Post('categories')
  @Roles(UserRole.ADMIN, UserRole.INTERNAL_STAFF)
  @ApiOperation({ summary: 'Create contact category' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  async createCategory(@Body() createCategoryDto: CreateContactCategoryDto) {
    return this.contactsService.createCategory(createCategoryDto);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all contact categories' })
  @ApiResponse({ status: 200, description: 'Categories retrieved successfully' })
  async findAllCategories() {
    return this.contactsService.findAllCategories();
  }

  @Patch('categories/:id')
  @Roles(UserRole.ADMIN, UserRole.INTERNAL_STAFF)
  @ApiOperation({ summary: 'Update contact category' })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  async updateCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateContactCategoryDto,
  ) {
    return this.contactsService.updateCategory(id, updateCategoryDto);
  }

  @Delete('categories/:id')
  @Roles(UserRole.ADMIN, UserRole.INTERNAL_STAFF)
  @ApiOperation({ summary: 'Delete contact category' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  async deleteCategory(@Param('id', ParseUUIDPipe) id: string) {
    await this.contactsService.deleteCategory(id);
    return { message: 'Category deleted successfully' };
  }
}