import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { OrderModule } from 'src/orders/order.module';
import { RedisModule } from 'src/redis/redis.module';
import { GCSController } from './gcs.controller';
import { GCSService } from './gcs.service';

@Module({
	imports: [HttpModule, forwardRef(() => OrderModule), RedisModule],
	controllers: [GCSController],
	providers: [GCSService],
	exports: [GCSService],
})
export class GCSModule {}
