import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MysqlDatabaseService } from './mysql-database.service';
import { PostgresDatabaseService } from './postgres-database.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: 'mysql',
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('mysql.host'),
        port: configService.get('mysql.port'),
        username: configService.get('mysql.username'),
        password: configService.get('mysql.password'),
        database: configService.get('mysql.database'),
        synchronize: false,
        logging: configService.get('sync.logLevel') === 'debug',
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      name: 'postgres',
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('postgres.host'),
        port: configService.get('postgres.port'),
        username: configService.get('postgres.username'),
        password: configService.get('postgres.password'),
        database: configService.get('postgres.database'),
        synchronize: false,
        logging: configService.get('sync.logLevel') === 'debug',
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MysqlDatabaseService, PostgresDatabaseService],
  exports: [MysqlDatabaseService, PostgresDatabaseService],
})
export class DatabaseModule {}