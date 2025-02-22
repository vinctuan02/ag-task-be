import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GCSModule } from 'src/google-cloud-storage/gcs.module';
import { OrderModule } from 'src/orders/order.module';
import { RedisModule } from 'src/redis/redis.module';
import { File } from './entities/file.entity';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
	// imports: [HttpModule, OrderModule, RedisModule],
	imports: [
		TypeOrmModule.forFeature([File]),
		GCSModule,
		RedisModule,
		forwardRef(() => OrderModule),
	],
	controllers: [FileController],
	providers: [FileService],
	exports: [FileService],
})
export class FileModule {}
