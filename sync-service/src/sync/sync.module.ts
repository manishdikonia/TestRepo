import { Module } from '@nestjs/common';
import { KafkaModule } from '../kafka/kafka.module';
import { DatabaseModule } from '../database/database.module';
import { SyncService } from './sync.service';
import { DataMapperService } from './data-mapper.service';
import { ConflictResolverService } from './conflict-resolver.service';
import { TableMappingService } from './table-mapping.service';

@Module({
  imports: [KafkaModule, DatabaseModule],
  providers: [
    SyncService,
    DataMapperService,
    ConflictResolverService,
    TableMappingService,
  ],
})
export class SyncModule {}