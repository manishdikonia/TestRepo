import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Product } from './entities/product.entity';
import { Order } from './entities/order.entity';
import { DatabaseService } from './database.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Product, Order])],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}