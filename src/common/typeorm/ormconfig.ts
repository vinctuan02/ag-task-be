import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Order } from 'src/orders/entities/order.entity';
import { Topic } from 'src/topic/entities/topic.entity';
import { User } from 'src/users/entities/user.entity';

export const AppDataSource = (
	configService: ConfigService,
): TypeOrmModuleOptions => ({
	type: 'mariadb',
	host: configService.get<string>('DB_HOST'),
	port: configService.get<number>('DB_PORT'),
	username: configService.get<string>('DB_USER'),
	password: configService.get<string>('DB_PASS'),
	database: configService.get<string>('DB_NAME'),
	// entities: [__dirname + '/**/*.entity.{ts,js}'], // Point to your entities
	entities: [User, Topic, Order],
	synchronize: true, // Set true for development, false in production
});
