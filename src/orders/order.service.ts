import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MetadataDto } from 'src/common/dtos/response/pagination/metadata.dto';
// import { PageResponse } from 'src/common/dtos/response/pagination/page-response.dto';
// import { FileService } from 'src/files/file.service';
import { HttpErrorMessage } from 'src/common/dtos/response/error/enums/http.error.message.enum';
import {
	ErrorDetail,
	ErrorResDto,
} from 'src/common/dtos/response/error/errors-response.dto';
import { DataPagination } from 'src/common/dtos/response/pagination/data-pagination.dto';
import { Topic } from 'src/topic/entities/topic.entity';
import { TopicService } from 'src/topic/topic.service';
import { UsersService } from 'src/users/user.service';
import { Brackets, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/req/create-order.dto';
import { UpdateOrderDto } from './dto/req/update-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrderService {
	constructor(
		@InjectRepository(Order)
		private readonly orderRepository: Repository<Order>,
		private readonly userService: UsersService,
		private readonly topicService: TopicService,
		// private readonly fileService: FileService,
	) {}

	async create(
		createOrderDto: CreateOrderDto,
		userId: string,
	): Promise<Order> {
		const { topicId } = createOrderDto;

		const errors: ErrorDetail[] = [];

		const isUserExistsById = await this.userService.checkExistsById(userId);
		if (!isUserExistsById) {
			errors.push(new ErrorDetail('userId', 'message.userNotFound'));
		}

		const isTopicExistsById =
			await this.topicService.checkExistsById(topicId);
		if (!isTopicExistsById) {
			errors.push(new ErrorDetail('topicId', 'message.topicNotFound'));
		}

		const newOrder = this.orderRepository.create({
			...createOrderDto,
			userCreatorId: userId,
			topic: { id: topicId } as Topic,
		});

		if (errors.length > 0) {
			throw new ErrorResDto(
				HttpStatus.BAD_REQUEST,
				'message.createOrderFailed',
				HttpErrorMessage.BAD_REQUEST,
				errors,
			);
		}

		return await this.orderRepository.save(newOrder);
	}

	async findAll(
		currentPage: number,
		pageSize: number,
		keyword?: string,
	): Promise<DataPagination<Order | null>> {
		const skip = (currentPage - 1) * pageSize;
		const queryBuilder = this.orderRepository
			.createQueryBuilder('order')
			.leftJoin('order.topic', 'topic') // Chỉ join mà không lấy tất cả trường
			.addSelect(['topic.id', 'topic.code', 'topic.note'])
			.orderBy('order.dateUpdated', 'DESC')
			.skip(skip)
			.take(pageSize);

		if (keyword) {
			queryBuilder.andWhere(
				new Brackets((qb) => {
					qb.where('order.type LIKE :keyword', {
						keyword: `%${keyword}%`,
					})
						.orWhere('order.content LIKE :keyword', {
							keyword: `%${keyword}%`,
						})
						.orWhere('order.note LIKE :keyword', {
							keyword: `%${keyword}%`,
						})
						.orWhere('order.status LIKE :keyword', {
							keyword: `%${keyword}%`,
						});
				}),
			);
		}

		const [orders, totalItems] = await queryBuilder.getManyAndCount();

		// Chuyển đổi từng order sang OrderDto và thêm resourceUrl
		// const ordersWithResourceUrl: OrderDto[] = await Promise.all(
		// 	orders.map(async (order) => {
		// 		const orderDto = plainToInstance(OrderDto, order);
		// 		if (order.gcsFilesId) {
		// 			const resGetDownloadUrl =
		// 				await this.fileService.getDownloadUrlById(
		// 					order.gcsFilesId,
		// 				);
		// 			orderDto.resourceUrl = resGetDownloadUrl.url;
		// 		}
		// 		return orderDto;
		// 	}),
		// );

		const totalPages = Math.ceil(totalItems / pageSize);
		const metadata = new MetadataDto(
			currentPage,
			pageSize,
			totalItems,
			totalPages,
		);

		return new DataPagination(orders, metadata);
	}

	// async isOrderExist(id: string): Promise<boolean> {
	// 	const count = await this.orderRepository.count({ where: { id } });
	// 	return count > 0;
	// }

	async findOne(id: string): Promise<Order> {
		const orderById = await this.orderRepository.findOne({ where: { id } });
		if (!orderById) {
			throw new ErrorResDto(
				HttpStatus.BAD_REQUEST,
				'message.findOrderByIdFailed',
				HttpErrorMessage.BAD_REQUEST,
				[new ErrorDetail('orderId', 'message.orderNotFound')],
			);
		}

		// const orderDto = plainToInstance(OrderDto, orderById);

		// const resGetDownloadUrl = await this.fileService.getDownloadUrlById(
		// 	orderDto.gcsFilesId,
		// );

		// orderDto.resourceUrl = resGetDownloadUrl.url;

		return orderById;
	}

	async update(
		id: string,
		updateOrderDto: Partial<UpdateOrderDto>,
	): Promise<Order> {
		const { topicId } = updateOrderDto;

		const errors: ErrorDetail[] = [];

		const order = await this.orderRepository.findOne({ where: { id } });
		if (!order) {
			errors.push(new ErrorDetail('orderId', 'message.orderNotFound'));
		}

		if (topicId) {
			const isTopicExistsById =
				await this.topicService.checkExistsById(topicId);
			if (!isTopicExistsById) {
				errors.push(
					new ErrorDetail('topicId', 'message.topicNotFound'),
				);
			}
		}

		if (errors.length > 0 || !order) {
			throw new ErrorResDto(
				HttpStatus.BAD_REQUEST,
				'message.updateOrderFailed',
				HttpErrorMessage.BAD_REQUEST,
				errors,
			);
		}

		Object.assign(order, updateOrderDto);

		return await this.orderRepository.save(order);
	}

	async remove(id: string): Promise<boolean> {
		const order = await this.orderRepository.findOne({ where: { id } });

		if (!order) {
			throw new ErrorResDto(
				HttpStatus.BAD_REQUEST,
				'message.deleteOrderByIdFailed',
				HttpErrorMessage.BAD_REQUEST,
				[new ErrorDetail('orderId', 'message.orderNotFound')],
			);
		}

		const result = await this.orderRepository.delete(id);
		if (result.affected === 0) {
			return false;
		}

		return true;
	}

	async checkIsExistsById(id: string): Promise<boolean> {
		return await this.orderRepository.existsBy({ id });
	}
}
