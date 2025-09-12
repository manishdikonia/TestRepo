import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { getDatabaseConfig } from './config/database.config';

// Import all entities
import { User } from './entities/user.entity';
import { Contact } from './entities/contact.entity';
import { ContactCategory } from './entities/contact-category.entity';
import { ContactNote } from './entities/contact-note.entity';
import { ContactActivity } from './entities/contact-activity.entity';
import { ContactSocialLink } from './entities/contact-social-link.entity';
import { Lead } from './entities/lead.entity';
import { CrmTracker } from './entities/crm-tracker.entity';
import { CrmField } from './entities/crm-field.entity';
import { LeadFieldValue } from './entities/lead-field-value.entity';
import { LeadNote } from './entities/lead-note.entity';
import { Assessment } from './entities/assessment.entity';
import { AssessmentQuestion } from './entities/assessment-question.entity';
import { AssessmentQuestionOption } from './entities/assessment-question-option.entity';
import { AssessmentResponse } from './entities/assessment-response.entity';
import { AssessmentResponseAnswer } from './entities/assessment-response-answer.entity';
import { Questionnaire } from './entities/questionnaire.entity';
import { QuestionnaireQuestion } from './entities/questionnaire-question.entity';
import { QuestionnaireQuestionOption } from './entities/questionnaire-question-option.entity';
import { QuestionnaireResponse } from './entities/questionnaire-response.entity';
import { QuestionnaireResponseAnswer } from './entities/questionnaire-response-answer.entity';
import { MarketingCampaign } from './entities/marketing-campaign.entity';
import { MarketingMessage } from './entities/marketing-message.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      User,
      Contact,
      ContactCategory,
      ContactNote,
      ContactActivity,
      ContactSocialLink,
      Lead,
      CrmTracker,
      CrmField,
      LeadFieldValue,
      LeadNote,
      Assessment,
      AssessmentQuestion,
      AssessmentQuestionOption,
      AssessmentResponse,
      AssessmentResponseAnswer,
      Questionnaire,
      QuestionnaireQuestion,
      QuestionnaireQuestionOption,
      QuestionnaireResponse,
      QuestionnaireResponseAnswer,
      MarketingCampaign,
      MarketingMessage,
    ]),
    AuthModule,
    ContactsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
