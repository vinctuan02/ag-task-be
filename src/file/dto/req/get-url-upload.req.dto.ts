import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetUploadUrlDto {
	id: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	fileName: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	contentType: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsNumber()
	fileSize: string;
}
