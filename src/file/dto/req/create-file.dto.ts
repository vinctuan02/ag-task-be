import { IsNotEmpty } from 'class-validator';

export class CreateFileDto {
	@IsNotEmpty()
	contentType: string; // fix -> enum

	@IsNotEmpty()
	extension: string;

	@IsNotEmpty()
	fileSizeInByte: string;

	@IsNotEmpty()
	fileName: string; // fix -> khong co khoang trong, ky tu dac biet
}
