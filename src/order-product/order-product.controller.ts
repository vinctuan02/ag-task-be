import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
} from '@nestjs/common';
import { FindAllDto } from 'src/common/dtos/request/find-all.dto';
import { DataPagination } from 'src/common/dtos/response/pagination/data-pagination.dto';
import { SuccessResDto } from 'src/common/dtos/response/success/success-reponse.dto';
import { CreateOrderProductDto } from './dto/req/create-order-product.dto';
import { UpdateOrderProductDto } from './dto/req/update-order-product.dto';
import { OrderProduct } from './entities/order-product.entity';
import { OrderProductService } from './order-product.service';
import { Message } from 'src/common/message/message';

@Controller('order-product')
export class OrderProductController {
	constructor(private readonly orderProductService: OrderProductService) {}

	@Post()
	async create(
		@Body() createOrderProductDto: CreateOrderProductDto,
	): Promise<SuccessResDto<OrderProduct>> {
		const newOrderProduct = await this.orderProductService.create(
			createOrderProductDto,
		);
		return new SuccessResDto(
			200,
			Message.createOrderProductSuccessfully,
			newOrderProduct,
		);
	}

	@Get()
	async findAll(
		@Query() query: FindAllDto,
	): Promise<SuccessResDto<DataPagination<OrderProduct | null>>> {
		const result = await this.orderProductService.findAll(
			query.page ?? 1,
			query.pageSize ?? 10,
			query?.keyword,
		);
		return new SuccessResDto(
			200,
			Message.getAllOrderProductsSuccessfully,
			result,
		);
	}

	@Get(':id')
	async findOne(
		@Param('id') id: string,
	): Promise<SuccessResDto<OrderProduct>> {
		const result = await this.orderProductService.findOne(id);
		return new SuccessResDto(
			200,
			Message.getOrderProductByIdSuccessfully,
			result,
		);
	}

	@Patch(':id')
	async update(
		@Param('id') id: string,
		@Body() updateOrderProductDto: UpdateOrderProductDto,
	): Promise<SuccessResDto<OrderProduct>> {
		const result = await this.orderProductService.update(
			id,
			updateOrderProductDto,
		);
		return new SuccessResDto(
			200,
			Message.updateOrderProductSuccessfully,
			result,
		);
	}

	@Delete(':id')
	async remove(@Param('id') id: string): Promise<SuccessResDto<boolean>> {
		await this.orderProductService.remove(id);
		return new SuccessResDto(204, Message.deleteOrderProductSuccessfully);
	}
}
