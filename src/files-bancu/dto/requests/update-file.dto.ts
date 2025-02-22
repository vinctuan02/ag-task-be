import { IsOptional, IsString } from 'class-validator';

export class UpdateFileDto {
	@IsOptional()
	@IsString()
	fileName?: string;

	@IsOptional()
	@IsString()
	contentType?: string;

	@IsOptional()
	@IsString()
	gcsPath?: string;
}
