import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './common/typeorm/ormconfig';
import { UsersModule } from './users/user.module';
import { TopicModule } from './topic/topic.module';
import { OrderModule } from './orders/order.module';

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
	OrderModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
