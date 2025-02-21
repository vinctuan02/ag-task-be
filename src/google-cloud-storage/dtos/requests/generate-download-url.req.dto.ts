import { IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

export class GenerateDownloadUrlDto {
	@IsString()
	@IsNotEmpty()
	filePath: string;

	@IsOptional()
	@IsPositive()
	expiresInSeconds?: number;

	constructor(filePath: string, expiresInSeconds: number) {
		this.filePath = filePath;
		this.expiresInSeconds = expiresInSeconds;
	}
}
