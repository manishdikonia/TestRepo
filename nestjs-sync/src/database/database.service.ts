import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Product } from './entities/product.entity';
import { Order } from './entities/order.entity';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async createUser(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return await this.userRepository.save(user);
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    await this.userRepository.update(id, userData);
    return await this.userRepository.findOne({ where: { id } });
  }

  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async createProduct(productData: Partial<Product>): Promise<Product> {
    const product = this.productRepository.create(productData);
    return await this.productRepository.save(product);
  }

  async updateProduct(id: number, productData: Partial<Product>): Promise<Product> {
    await this.productRepository.update(id, productData);
    return await this.productRepository.findOne({ where: { id } });
  }

  async deleteProduct(id: number): Promise<void> {
    await this.productRepository.delete(id);
  }

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    const order = this.orderRepository.create(orderData);
    return await this.orderRepository.save(order);
  }

  async updateOrder(id: number, orderData: Partial<Order>): Promise<Order> {
    await this.orderRepository.update(id, orderData);
    return await this.orderRepository.findOne({ where: { id } });
  }

  async deleteOrder(id: number): Promise<void> {
    await this.orderRepository.delete(id);
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findUserById(id: number): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findProductById(id: number): Promise<Product> {
    return await this.productRepository.findOne({ where: { id } });
  }

  async findOrderById(id: number): Promise<Order> {
    return await this.orderRepository.findOne({ where: { id } });
  }
}