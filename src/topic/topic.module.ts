import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Topic } from './entities/topic.entity';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';
import { OrderModule } from 'src/orders/order.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([Topic]),
		forwardRef(() => OrderModule),
	],
	controllers: [TopicController],
	providers: [TopicService],
	exports: [TopicService],
})
export class TopicModule {}
