import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopicModule } from 'src/topic/topic.module';
import { UsersModule } from 'src/users/user.module';
import { Order } from './entities/order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
	imports: [
		TypeOrmModule.forFeature([Order]),
		UsersModule,
		TopicModule,
		// forwardRef(() => FileModule),
		// FileModule
	],
	controllers: [OrderController],
	providers: [OrderService],
	exports: [OrderService],
})
export class OrderModule {}
