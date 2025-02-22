import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TypeOrderProductEnum } from 'src/orders/enums/type-order.enum';

export class CreateOrderProductDto {
	@IsOptional()
	@IsString()
	note: string;

	// @IsOptional()
	// assigneeId: string;

	// @IsOptional()
	@IsNotEmpty()
	@IsEnum(TypeOrderProductEnum)
	type: TypeOrderProductEnum;

	@IsNotEmpty()
	orderId: string;
}
