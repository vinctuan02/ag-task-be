import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ENTITY_TYPE_ENUM } from 'src/files-bancu/enums/entity-type.enum';

export class CreateFileDto {
	@IsEnum(ENTITY_TYPE_ENUM)
	@IsNotEmpty()
	entityType: ENTITY_TYPE_ENUM;

	@IsNotEmpty()
	@IsString()
	entityId: string;

	@IsString()
	@IsNotEmpty()
	fileName: string;

	@IsString()
	@IsNotEmpty()
	contentType: string;

	@IsNotEmpty()
	fileSize: string;

	@IsString()
	@IsNotEmpty()
	gcsPath: string;
}
