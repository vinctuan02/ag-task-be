import { IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

export class GetDownloadUrlDto {
	@IsString()
	@IsNotEmpty()
	filePath: string;

	@IsOptional()
	@IsPositive()
	expiresInSeconds: number;
}
