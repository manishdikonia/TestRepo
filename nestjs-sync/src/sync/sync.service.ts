import { Injectable, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { DatabaseService } from '../database/database.service';

interface DebeziumEvent {
  op: 'c' | 'r' | 'u' | 'd'; // create, read, update, delete
  before?: any;
  after?: any;
  source: {
    table: string;
    db: string;
  };
  ts_ms: number;
}

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  @EventPattern('mysql-source.users')
  async handleUserEvent(@Payload() event: DebeziumEvent) {
    this.logger.log(`Received user event: ${event.op}`, JSON.stringify(event));
    
    try {
      switch (event.op) {
        case 'c':
          await this.createUser(event.after);
          break;
        case 'u':
          await this.updateUser(event.after);
          break;
        case 'd':
          await this.deleteUser(event.before);
          break;
      }
    } catch (error) {
      this.logger.error(`Error handling user event: ${error.message}`, error.stack);
    }
  }

  @EventPattern('mysql-source.products')
  async handleProductEvent(@Payload() event: DebeziumEvent) {
    this.logger.log(`Received product event: ${event.op}`, JSON.stringify(event));
    
    try {
      switch (event.op) {
        case 'c':
          await this.createProduct(event.after);
          break;
        case 'u':
          await this.updateProduct(event.after);
          break;
        case 'd':
          await this.deleteProduct(event.before);
          break;
      }
    } catch (error) {
      this.logger.error(`Error handling product event: ${error.message}`, error.stack);
    }
  }

  @EventPattern('mysql-source.orders')
  async handleOrderEvent(@Payload() event: DebeziumEvent) {
    this.logger.log(`Received order event: ${event.op}`, JSON.stringify(event));
    
    try {
      switch (event.op) {
        case 'c':
          await this.createOrder(event.after);
          break;
        case 'u':
          await this.updateOrder(event.after);
          break;
        case 'd':
          await this.deleteOrder(event.before);
          break;
      }
    } catch (error) {
      this.logger.error(`Error handling order event: ${error.message}`, error.stack);
    }
  }

  private async createUser(data: any) {
    const userData = {
      id: data.id,
      name: data.name,
      email: data.email,
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at),
    };
    
    await this.databaseService.createUser(userData);
    this.logger.log(`Created user: ${data.id}`);
  }

  private async updateUser(data: any) {
    const userData = {
      name: data.name,
      email: data.email,
      updated_at: new Date(data.updated_at),
    };
    
    await this.databaseService.updateUser(data.id, userData);
    this.logger.log(`Updated user: ${data.id}`);
  }

  private async deleteUser(data: any) {
    await this.databaseService.deleteUser(data.id);
    this.logger.log(`Deleted user: ${data.id}`);
  }

  private async createProduct(data: any) {
    const productData = {
      id: data.id,
      name: data.name,
      price: parseFloat(data.price),
      description: data.description,
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at),
    };
    
    await this.databaseService.createProduct(productData);
    this.logger.log(`Created product: ${data.id}`);
  }

  private async updateProduct(data: any) {
    const productData = {
      name: data.name,
      price: parseFloat(data.price),
      description: data.description,
      updated_at: new Date(data.updated_at),
    };
    
    await this.databaseService.updateProduct(data.id, productData);
    this.logger.log(`Updated product: ${data.id}`);
  }

  private async deleteProduct(data: any) {
    await this.databaseService.deleteProduct(data.id);
    this.logger.log(`Deleted product: ${data.id}`);
  }

  private async createOrder(data: any) {
    const orderData = {
      id: data.id,
      user_id: data.user_id,
      product_id: data.product_id,
      quantity: data.quantity,
      total_amount: parseFloat(data.total_amount),
      status: data.status,
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at),
    };
    
    await this.databaseService.createOrder(orderData);
    this.logger.log(`Created order: ${data.id}`);
  }

  private async updateOrder(data: any) {
    const orderData = {
      user_id: data.user_id,
      product_id: data.product_id,
      quantity: data.quantity,
      total_amount: parseFloat(data.total_amount),
      status: data.status,
      updated_at: new Date(data.updated_at),
    };
    
    await this.databaseService.updateOrder(data.id, orderData);
    this.logger.log(`Updated order: ${data.id}`);
  }

  private async deleteOrder(data: any) {
    await this.databaseService.deleteOrder(data.id);
    this.logger.log(`Deleted order: ${data.id}`);
  }
}