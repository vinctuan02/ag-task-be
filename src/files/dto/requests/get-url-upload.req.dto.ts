import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ENTITY_TYPE_ENUM } from 'src/files/enums/entity-type.enum';

export class GetUploadUrlDto {
	@ApiProperty({
		enum: ENTITY_TYPE_ENUM,
		default: ENTITY_TYPE_ENUM.ORDER,
		description:
			'Entity type. Valid values: ' +
			Object.values(ENTITY_TYPE_ENUM).join(', '),
	})
	@IsNotEmpty()
	@IsEnum(ENTITY_TYPE_ENUM)
	entityType: ENTITY_TYPE_ENUM;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	entityId: string;

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
