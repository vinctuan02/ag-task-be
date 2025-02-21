// import { Provider } from '@nestjs/common';
// import Redis from 'ioredis';

// export const RedisProvider: Provider = {
//   provide: 'REDIS', // Token để inject
//   useFactory: async () => {
//     // Nếu cần xử lý bất đồng bộ để lấy cấu hình, ví dụ: từ file hoặc service cấu hình
//     const config = await getRedisConfig(); // Tự định nghĩa hàm này nếu cần, hoặc dùng biến môi trường

//     const redis = new Redis({
//       host: config.host,
//       port: config.port,
//       db: config.db,
//     });

//     redis.on('connect', () => {
//       console.log('Kết nối đến Redis thành công!');
//     });

//     redis.on('error', (error) => {
//       console.error('Lỗi kết nối Redis:', error);
//     });

//     return redis;
//   },
// };

// async function getRedisConfig() {
//   // Ví dụ lấy cấu hình từ biến môi trường
//   return {
//     host: process.env.REDIS_HOST || '127.0.0.1',
//     port: Number(process.env.REDIS_PORT) || 6379,
//     db: Number(process.env.REDIS_DB) || 0,
//   };
// }

import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const RedisProvider: Provider = {
	provide: 'REDIS',
	inject: [ConfigService],
	useFactory: (configService: ConfigService) => {
		const redis = new Redis({
			host: configService.get<string>('REDIS_HOST', '127.0.0.1'),
			port: configService.get<number>('REDIS_PORT', 6379),
			db: configService.get<number>('REDIS_DB', 0),
		});

		redis.on('connect', () => {
			console.log('Successfully connected to Redis!');
		});

		redis.on('error', (error) => {
			console.error('Redis connection error:', error);
		});
		return redis;
	},
};
