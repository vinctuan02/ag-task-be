import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateTopicDto {
  @ApiPropertyOptional({
    description: 'ID of the parent topic (UUID), if available',
    type: String,
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID('4', { message: 'message.parentIdNotUUID' })
  parentId: string;

  @ApiProperty({
    description: 'Identifier code of the topic',
    example: 'T001',
  })
  @IsNotEmpty({ message: 'message.codeEmpty' })
  @IsString({ message: 'message.codeShouldBeString' })
  code: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the topic',
    example: 'Detailed description about the topic',
  })
  @IsOptional()
  @IsString({ message: 'message.descriptionShouldBeString' })
  description: string;

  @ApiPropertyOptional({
    description: 'Notes related to the topic',
    example: 'Some related notes',
  })
  @IsOptional()
  @IsString({ message: 'message.noteShouldBeString' })
  note: string;

  @ApiProperty({
    description: 'Order of the topic',
    type: Number,
    example: 1,
  })
  @IsNotEmpty({ message: 'message.orderEmpty' })
  @IsNumber({}, { message: 'message.orderShouldBeNumber' })
  order: number;
}
