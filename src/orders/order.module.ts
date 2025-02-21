import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileModule } from 'src/files/file.module';
import { Order } from './entities/order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { UsersModule } from 'src/users/user.module';
import { TopicModule } from 'src/topic/topic.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([Order]),
		UsersModule,
		TopicModule
		// forwardRef(() => FileModule),
		// FileModule
	],
	controllers: [OrderController],
	providers: [OrderService],
	// exports: [OrderService],
})
export class OrderModule {}
