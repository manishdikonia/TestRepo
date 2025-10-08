import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class MysqlDatabaseService {
  private readonly logger = new Logger(MysqlDatabaseService.name);

  constructor(
    @InjectDataSource('mysql')
    private dataSource: DataSource,
  ) {}

  async executeQuery(query: string, parameters?: any[]): Promise<any> {
    try {
      return await this.dataSource.query(query, parameters);
    } catch (error) {
      this.logger.error(`MySQL query failed: ${query}`, error);
      throw error;
    }
  }

  async insertData(table: string, data: Record<string, any>): Promise<any> {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = columns.map(() => '?').join(', ');

    const query = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`;
    
    return await this.executeQuery(query, values);
  }

  async updateData(
    table: string,
    data: Record<string, any>,
    where: Record<string, any>,
  ): Promise<any> {
    const setClause = Object.keys(data)
      .map(key => `${key} = ?`)
      .join(', ');
    
    const whereClause = Object.keys(where)
      .map(key => `${key} = ?`)
      .join(' AND ');

    const query = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;
    const values = [...Object.values(data), ...Object.values(where)];

    return await this.executeQuery(query, values);
  }

  async deleteData(table: string, where: Record<string, any>): Promise<any> {
    const whereClause = Object.keys(where)
      .map(key => `${key} = ?`)
      .join(' AND ');

    const query = `DELETE FROM ${table} WHERE ${whereClause}`;
    const values = Object.values(where);

    return await this.executeQuery(query, values);
  }

  async upsertData(
    table: string,
    data: Record<string, any>,
    conflictColumns: string[],
  ): Promise<any> {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = columns.map(() => '?').join(', ');

    const updateClause = columns
      .filter(col => !conflictColumns.includes(col))
      .map(col => `${col} = VALUES(${col})`)
      .join(', ');

    const query = `
      INSERT INTO ${table} (${columns.join(', ')}) 
      VALUES (${placeholders})
      ON DUPLICATE KEY UPDATE ${updateClause}
    `;

    return await this.executeQuery(query, values);
  }

  async getTableSchema(table: string): Promise<any[]> {
    const query = `
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_KEY, EXTRA
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?
    `;
    
    return await this.executeQuery(query, [table]);
  }

  async beginTransaction(): Promise<any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    return queryRunner;
  }
}