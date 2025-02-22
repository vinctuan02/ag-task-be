import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppDataSource } from './common/typeorm/ormconfig';
import { FileModule } from './file/file.module';
import { OrderProductModule } from './order-product/order-product.module';
import { OrderModule } from './orders/order.module';
import { ProductModule } from './product/product.module';
import { TopicModule } from './topic/topic.module';
import { UsersModule } from './users/user.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: AppDataSource,
		}),
		UsersModule,
		TopicModule,
		OrderModule,
		OrderProductModule,
		ProductModule,
		FileModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
