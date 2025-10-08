import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class PostgresDatabaseService {
  private readonly logger = new Logger(PostgresDatabaseService.name);

  constructor(
    @InjectDataSource('postgres')
    private dataSource: DataSource,
  ) {}

  async executeQuery(query: string, parameters?: any[]): Promise<any> {
    try {
      return await this.dataSource.query(query, parameters);
    } catch (error) {
      this.logger.error(`PostgreSQL query failed: ${query}`, error);
      throw error;
    }
  }

  async insertData(table: string, data: Record<string, any>): Promise<any> {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = columns.map((_, index) => `$${index + 1}`).join(', ');

    const query = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders}) RETURNING *`;
    
    return await this.executeQuery(query, values);
  }

  async updateData(
    table: string,
    data: Record<string, any>,
    where: Record<string, any>,
  ): Promise<any> {
    const dataKeys = Object.keys(data);
    const whereKeys = Object.keys(where);
    
    const setClause = dataKeys
      .map((key, index) => `${key} = $${index + 1}`)
      .join(', ');
    
    const whereClause = whereKeys
      .map((key, index) => `${key} = $${dataKeys.length + index + 1}`)
      .join(' AND ');

    const query = `UPDATE ${table} SET ${setClause} WHERE ${whereClause} RETURNING *`;
    const values = [...Object.values(data), ...Object.values(where)];

    return await this.executeQuery(query, values);
  }

  async deleteData(table: string, where: Record<string, any>): Promise<any> {
    const whereKeys = Object.keys(where);
    const whereClause = whereKeys
      .map((key, index) => `${key} = $${index + 1}`)
      .join(' AND ');

    const query = `DELETE FROM ${table} WHERE ${whereClause} RETURNING *`;
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
    const placeholders = columns.map((_, index) => `$${index + 1}`).join(', ');

    const updateClause = columns
      .filter(col => !conflictColumns.includes(col))
      .map(col => `${col} = EXCLUDED.${col}`)
      .join(', ');

    const query = `
      INSERT INTO ${table} (${columns.join(', ')}) 
      VALUES (${placeholders})
      ON CONFLICT (${conflictColumns.join(', ')}) 
      DO UPDATE SET ${updateClause}
      RETURNING *
    `;

    return await this.executeQuery(query, values);
  }

  async getTableSchema(table: string): Promise<any[]> {
    const query = `
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = $1
      ORDER BY ordinal_position
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