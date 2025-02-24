import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from 'src/orders/enums/status-order.enum';
import { TypeOrderProductEnum } from 'src/orders/enums/type-order.enum';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Content of the order',
    example: 'Order for new office supplies',
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiPropertyOptional({
    description: 'ID of the illustrative image',
    example: 'abc123imageId',
  })
  @IsOptional()
  @IsString()
  illustrative_image_id?: string;

  @ApiPropertyOptional({
    description: 'Additional note for the order',
    example: 'Please deliver between 9 AM and 5 PM',
  })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({
    description: 'Deadline for the order',
    example: '2025-03-15T00:00:00.000Z',
  })
  @Type(() => Date)
  @IsDate()
  deadline: Date;

  @ApiPropertyOptional({
    description: 'Current status of the order',
    enum: OrderStatus,
    example: OrderStatus.NOT_RECEIVED,
  })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiProperty({
    description: 'Type of the order product',
    enum: TypeOrderProductEnum,
    example: TypeOrderProductEnum.IMAGE,
  })
  @IsNotEmpty()
  @IsEnum(TypeOrderProductEnum)
  type: TypeOrderProductEnum;

  @ApiProperty({
    description: 'Topic ID associated with the order',
    example: 'topic123',
  })
  @IsNotEmpty()
  @IsString()
  topicId: string;
}
