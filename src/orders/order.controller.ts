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
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { FindAllDto } from 'src/common/dtos/request/find-all.dto';
import { DataPagination } from 'src/common/dtos/response/pagination/data-pagination.dto';
import { SuccessResDto } from 'src/common/dtos/response/success/success-reponse.dto';
import { CreateOrderDto } from './dto/req/create-order.dto';
import { UpdateOrderDto } from './dto/req/update-order.dto';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';
import { GetAllOrdersDto } from './dto/req/get-all-order.dto';
import { Message } from 'src/common/message/message';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	@ApiOperation({ summary: 'Create new order' })
	@Post()
	async createOrder(
		@Body() createOrderDto: CreateOrderDto,
	): Promise<SuccessResDto<Order>> {
		const userId: string = '38306fb4-3e40-4dc1-9411-6b4e17b59d12'; // fix

		const result = await this.orderService.create(createOrderDto, userId);
		return new SuccessResDto(
			201,
			Message.createOrderSuccessfully,
			result,
		);
	}

	@ApiOperation({ summary: 'Get all orders' })
	@Get()
	async findAll(
		@Query() query: GetAllOrdersDto,
	): Promise<SuccessResDto<DataPagination<Order | null>>> {
		const result = await this.orderService.findAll(
			query.page ?? 1,
			query.pageSize ?? 10,
			query?.keyword,
			query?.type,
			query?.deadline
		);
		return new SuccessResDto(
			200,
			Message.getAllOrdersSuccessfully,
			result,
		);
	}

	@ApiOperation({ summary: 'Get order by id' })
	@ApiParam({
		name: 'id',
		required: true,
		example: '4ac9a511-1d81-473e-a4bc-0290a7ae6506',
	})
	@Get(':id')
	async findOne(@Param('id') id: string): Promise<SuccessResDto<Order>> {
		const result = await this.orderService.findOne(id);
		return new SuccessResDto(
			200,
			Message.getOrderByIdSuccessfully,
			result,
		);
	}

	@ApiOperation({ summary: 'Update a order' })
	@ApiParam({
		name: 'id',
		required: true,
		example: '4ac9a511-1d81-473e-a4bc-0290a7ae6506',
	})
	@Patch(':id')
	async update(
		@Param('id') id: string,
		@Body() updateOrderDto: UpdateOrderDto,
	): Promise<SuccessResDto<Order>> {
		const result = await this.orderService.update(id, updateOrderDto);
		return new SuccessResDto(
			200,
			Message.updateOrderSuccessfully,
			result,
		);
	}

	@ApiOperation({ summary: 'Delete order' })
	@ApiParam({ name: 'id', required: true, example: '4ac9a511-1d81-473e-a4bc-0290a7ae6506' })
	@Delete(':id')
	async remove(@Param('id') id: string): Promise<SuccessResDto<boolean>> {
		await this.orderService.remove(id);
		return new SuccessResDto(204, Message.deleteOrderSuccessfully);
	}
}
