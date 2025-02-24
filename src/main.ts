import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
	ErrorDetail,
	ErrorResDto,
} from './common/dtos/response/error/errors-response.dto';
import { setupSwagger } from './swagger/swagger.config';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
			exceptionFactory: (errors) => {
				const errorDetails: ErrorDetail[] = [];

				// Duyệt qua từng error nhận được từ ValidationPipe
				errors.forEach((error) => {
					// Nếu có các constraint, tạo một ErrorDetail cho mỗi constraint
					if (error.constraints) {
						Object.entries(error.constraints).forEach(
							([, rawMessage]) => {
								const msg = String(rawMessage);
								errorDetails.push(
									new ErrorDetail(error.property, msg),
								);
							},
						);
					} else {
						// Nếu không có constraint nào, tạo một ErrorDetail mặc định
						errorDetails.push(
							new ErrorDetail(error.property, 'Validation error'),
						);
					}
				});

				return new ErrorResDto(
					HttpStatus.BAD_REQUEST,
					'Validation Error',
					'Bad Request',
					errorDetails,
				);
			},
		}),
	);

	setupSwagger(app);

	app.enableCors({
		origin: '*',
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization'],
		credentials: true,
		optionsSuccessStatus: 200,
	});

	await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
