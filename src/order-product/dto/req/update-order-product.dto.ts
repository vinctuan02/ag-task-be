import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { CreateOrderProductDto } from './create-order-product.dto';

export class UpdateOrderProductDto extends PartialType(CreateOrderProductDto) {
	@IsOptional()
	@IsString()
	assigneeId: string;

	@IsOptional()
	@IsString()
	productId: string;
}
