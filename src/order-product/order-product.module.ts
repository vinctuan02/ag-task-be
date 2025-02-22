import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModule } from 'src/orders/order.module';
import { UsersModule } from 'src/users/user.module';
import { OrderProduct } from './entities/order-product.entity';
import { OrderProductController } from './order-product.controller';
import { OrderProductService } from './order-product.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([OrderProduct]),
		OrderModule,
		UsersModule,
	],
	exports: [],
	controllers: [OrderProductController],
	providers: [OrderProductService],
})
export class OrderProductModule {}
