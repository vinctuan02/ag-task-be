import { Type } from 'class-transformer';
import {
	IsDate,
	IsEnum,
	IsNotEmpty,
	IsOptional,
	IsString,
} from 'class-validator';
import { OrderStatus } from 'src/orders/enums/status-order.enum';
import { TypeOrderProductEnum } from 'src/orders/enums/type-order.enum';

export class CreateOrderDto {
	@IsNotEmpty()
	@IsString()
	content: string;

	@IsOptional()
	@IsString()
	illustrative_image_id?: string;

	@IsOptional()
	@IsString()
	note?: string;

	@Type(() => Date)
	@IsDate()
	deadline: Date;

	// @IsNotEmpty()
	// @IsString()
	// userCreatorId: string;

	@IsOptional()
	@IsEnum(OrderStatus)
	status?: OrderStatus;

	@IsNotEmpty()
	@IsEnum(TypeOrderProductEnum)
	type: TypeOrderProductEnum;

	@IsNotEmpty()
	@IsString()
	topicId: string;
}
