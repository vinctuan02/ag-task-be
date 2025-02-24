import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpErrorMessage } from 'src/common/dtos/response/error/enums/http.error.message.enum';
import {
	ErrorDetail,
	ErrorResDto,
} from 'src/common/dtos/response/error/errors-response.dto';
import { DataPagination } from 'src/common/dtos/response/pagination/data-pagination.dto';
import { MetadataDto } from 'src/common/dtos/response/pagination/metadata.dto';
import { OrderService } from 'src/orders/order.service';
import { UsersService } from 'src/users/user.service';
import { Brackets, Repository } from 'typeorm';
import { CreateOrderProductDto } from './dto/req/create-order-product.dto';
import { UpdateOrderProductDto } from './dto/req/update-order-product.dto';
import { OrderProduct } from './entities/order-product.entity';
import { Message } from 'src/common/message/message';

@Injectable()
export class OrderProductService {
	constructor(
		@InjectRepository(OrderProduct)
		private readonly orderProductRepository: Repository<OrderProduct>,
		@Inject(forwardRef(() => OrderService))
		private readonly orderService: OrderService,
		private readonly userService: UsersService,
	) {}

	async create(payload: CreateOrderProductDto): Promise<OrderProduct> {
		const { orderId } = payload;
		const errors: ErrorDetail[] = [];

		const isOrderExistsById =
			await this.orderService.checkIsExistsById(orderId);

		if (!isOrderExistsById) {
			errors.push(new ErrorDetail('orderId', Message.orderProduct.find.byId.failed));
		}

		if (errors.length > 0) {
			throw new ErrorResDto(
				HttpStatus.BAD_REQUEST,
				Message.orderProduct.create.failed,
				HttpErrorMessage.BAD_REQUEST,
				errors,
			);
		}

		const newOrderProduct = this.orderProductRepository.create(payload);
		return await this.orderProductRepository.save(newOrderProduct);

		// this.orderProductRepository.save();
	}

	async findAll(
		currentPage: number,
		pageSize: number,
		keyword?: string,
	): Promise<DataPagination<OrderProduct | null>> {
		const skip = (currentPage - 1) * pageSize;
		const queryBuilder = this.orderProductRepository
			.createQueryBuilder('orderProduct')
			// .leftJoin('order.topic', 'topic') // Chỉ join mà không lấy tất cả trường
			// .addSelect(['topic.id', 'topic.code', 'topic.note'])
			.orderBy('orderProduct.dateUpdated', 'DESC')
			.skip(skip)
			.take(pageSize);

		if (keyword) {
			queryBuilder.andWhere(
				new Brackets((qb) => {
					qb.where('orderProduct.type LIKE :keyword', {
						keyword: `%${keyword}%`,
					}).orWhere('orderProduct.note LIKE :keyword', {
						keyword: `%${keyword}%`,
					});
				}),
			);
		}

		const [orderProduct, totalItems] = await queryBuilder.getManyAndCount();

		const totalPages = Math.ceil(totalItems / pageSize);
		const metadata = new MetadataDto(
			currentPage,
			pageSize,
			totalItems,
			totalPages,
		);

		return new DataPagination(orderProduct, metadata);
	}

	async findOne(id: string): Promise<OrderProduct> {
		const orderProductById = await this.orderProductRepository.findOne({
			where: { id },
		});
		if (!orderProductById) {
			throw new ErrorResDto(
				HttpStatus.BAD_REQUEST,
				Message.orderProduct.find.byId.failed,
				HttpErrorMessage.BAD_REQUEST,
				[new ErrorDetail('orderId', Message.orderProduct.find.byId.failed)],
			);
		}

		return orderProductById;
	}

	async update(
		id: string,
		updateOrderProductDto: Partial<UpdateOrderProductDto>,
	): Promise<OrderProduct> {
		const { orderId, assigneeId, productId } = updateOrderProductDto;

		const errors: ErrorDetail[] = [];

		const orderProductById = await this.orderProductRepository.findOne({
			where: { id },
		});

		if (!orderProductById) {
			errors.push(
				new ErrorDetail(
					'orderProductId',
					Message.orderProduct.find.byId.failed
				),
			);
		}

		if (orderId) {
			const isOrderExistsById =
				await this.orderService.checkIsExistsById(orderId);
			if (!isOrderExistsById) {
				errors.push(
					new ErrorDetail('orderId', Message.order.find.byId.failed),
				);
			}
		}

		if (assigneeId) {
			const isUserExistsById =
				await this.userService.checkExistsById(assigneeId);
			if (!isUserExistsById) {
				errors.push(new ErrorDetail('userId', Message.user.find.byId.failed));
			}
		}

		if (productId) {
			console.log('chưa xử lý case này nè');
		}

		if (errors.length > 0 || !orderProductById) {
			throw new ErrorResDto(
				HttpStatus.BAD_REQUEST,
				Message.orderProduct.update.failed,
				HttpErrorMessage.BAD_REQUEST,
				errors,
			);
		}

		Object.assign(orderProductById, updateOrderProductDto);

		return await this.orderProductRepository.save(orderProductById);
	}

	async remove(id: string): Promise<boolean> {
		const orderProduct = await this.orderProductRepository.findOne({
			where: { id },
		});

		if (!orderProduct) {
			throw new ErrorResDto(
				HttpStatus.BAD_REQUEST,
				Message.orderProduct.delete.failed,
				HttpErrorMessage.BAD_REQUEST,
				[
					new ErrorDetail(
						'orderProductId',
						Message.orderProduct.find.byId.failed
					),
				],
			);
		}

		const result = await this.orderProductRepository.delete(id);
		if (result.affected === 0) {
			return false;
		}

		return true;
	}
}
