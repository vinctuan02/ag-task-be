import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// export function setupSwagger(app: INestApplication) {
//     const config = new DocumentBuilder()
//         .setTitle('API Documentation')
//         .setDescription('API Docs for MyApp')
//         .setVersion('1.0')
//         .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT')
//         .build();

//     const document = SwaggerModule.createDocument(app, config);
//     SwaggerModule.setup('api', app, document);
// }

export const setupSwagger = (app: INestApplication): void => {
	const config = new DocumentBuilder()
		.setTitle('API Documentation')
		// .setDescription('The API description')
		// .setVersion('1.0')
		.addBearerAuth(
			{
				type: 'http',
				scheme: 'Bearer',
				bearerFormat: 'JWT',
				in: 'header',
			},
			'token',
		)
		.addSecurityRequirements('token')
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api-docs', app, document, {
		swaggerOptions: { persistAuthorization: true },
	});
};
