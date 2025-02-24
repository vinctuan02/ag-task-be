import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopicModule } from 'src/topic/topic.module';
import { UsersModule } from 'src/users/user.module';
import { Order } from './entities/order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderProductModule } from 'src/order-product/order-product.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([Order]),
		UsersModule,
		forwardRef(() => OrderProductModule),
		TopicModule,
		// forwardRef(() => FileModule),
		// FileModule
	],
	controllers: [OrderController],
	providers: [OrderService],
	exports: [OrderService],
})
export class OrderModule {}
