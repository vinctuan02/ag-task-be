import {
	
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
	Request,
} from '@nestjs/common';
import { ApiOperation, ApiParam } from '@nestjs/swagger';
import { FindAllDto } from 'src/common/dtos/request/find-all.dto';
// import { PageResponse } from 'src/common/dtos/response/pagination/page-response.dto';
import { SuccessResDto } from 'src/common/dtos/response/success/success-reponse.dto';
import { CreateOrderDto } from './dto/req/create-order.dto';
import { UpdateOrderDto } from './dto/req/update-order.dto';
import { OrderDto } from './dto/res/order.entity.dto';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';
import { DataPagination } from 'src/common/dtos/response/pagination/data-pagination.dto';

@Controller('orders')
export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	@ApiOperation({ summary: 'Create new order' })
	@Post()
	async createOrder(
		@Body() createOrderDto: CreateOrderDto,
		// @Request() req: RequestWithUser,
	): Promise<SuccessResDto<Order>> {
		const userId: string = "38306fb4-3e40-4dc1-9411-6b4e17b59d12"; // fix

		const result = await this.orderService.create(createOrderDto, userId);
		return new SuccessResDto(201, 'Create new order oke', result);
	}

	@ApiOperation({ summary: 'Get all orders' })
	@Get()
	async findAll(
		@Query() query: FindAllDto,
	): Promise<SuccessResDto<DataPagination<Order | null>>> {
		const result = await this.orderService.findAll(
			query.page ?? 1,
			query.pageSize ?? 10,
			query?.keyword,
		);
		return new SuccessResDto(200, 'Get orders oke', result);
	}

	@ApiOperation({ summary: 'Get order by id' })
	@ApiParam({
		name: 'id',
		required: true,
		example: '4ac9a511-1d81-473e-a4bc-0290a7ae6506',
	})
	@Get(':id')
	async findOne(
		@Param('id') id: string,
	): Promise<SuccessResDto<Order>> {
		const result = await this.orderService.findOne(id);
		return new SuccessResDto(200, 'Get order by id oke', result);
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
		return new SuccessResDto(200, 'Update order ok', result);
	}

	// // @Public() // dev-test public
	// // @ApiOperation({ summary: 'Update resource url' })
	// // @ApiParam({ name: 'id', required: true, example: '4ac9a511-1d81-473e-a4bc-0290a7ae6506' })
	// // @Patch('update-resource-url/:id')
	// // updateResourceUrl(
	// //   @Param('id') id: string,
	// //   @Body('url') url: string
	// // ): Promise<SuccessResDto<Order>> {
	// //   return this.orderService.updateResourceUrl(id, url);
	// // }

	// @ApiOperation({ summary: 'Delete order oke' })
	// @ApiParam({ name: 'id', required: true, example: '' })
	// @Delete(':id')
	// async remove(
	// 	@Param('id') id: string,
	// ): Promise<SuccessResDto<boolean>> {
	// 	await this.orderService.remove(id);
	// 	return new SuccessResDto(204, 'Delete order oke');
	// }
}
