import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

export class GenerateUploadUrlDto {
	@ApiProperty({ description: 'file path on gcs' })
	@IsString()
	@IsNotEmpty()
	filePath: string;

	@IsString()
	@IsNotEmpty()
	contentType: string;

	@IsOptional()
	@IsPositive()
	expiresInSeconds: number;

	constructor(
		filePath: string,
		contentType: string,
		expiresInSeconds: number,
	) {
		this.filePath = filePath;
		this.contentType = contentType;
		this.expiresInSeconds = expiresInSeconds;
	}
}
