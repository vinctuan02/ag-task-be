import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { MetadataDto } from 'src/common/dtos/response/pagination/metadata.dto';
// import { PageResponse } from 'src/common/dtos/response/pagination/page-response.dto';
import { FileService } from 'src/files/file.service';
import { Brackets, Repository } from 'typeorm';
import { CreateOrderDto } from './dto/req/create-order.dto';
import { UpdateOrderDto } from './dto/req/update-order.dto';
import { OrderDto } from './dto/res/order.entity.dto';
import { Order } from './entities/order.entity';
import { UsersService } from 'src/users/user.service';
import { TopicService } from 'src/topic/topic.service';
import { Topic } from 'src/topic/entities/topic.entity';
import { DataPagination } from 'src/common/dtos/response/pagination/data-pagination.dto';

@Injectable()
export class OrderService {
	constructor(
		@InjectRepository(Order)
		private readonly orderRepository: Repository<Order>,
		private readonly userService: UsersService,
		private readonly topicService: TopicService
		// private readonly fileService: FileService,
	) {}

	async create(
		createOrderDto: CreateOrderDto,
		userId: string,
	): Promise<Order> {

		const {topicId} = createOrderDto 

		const isUserExistsById = await this.userService.checkExistsById(userId);
		if (!isUserExistsById) {
			throw new BadRequestException('User not found'); //fix
		}

		const isTopicExistsById = await this.topicService.checkExistsById(topicId);
		if (!isTopicExistsById) {
			throw new BadRequestException('Topic not found'); //fix
		}

		const newOrder = this.orderRepository.create({
			...createOrderDto,
			userCreatorId: userId,
			topic: { id: topicId } as Topic,
		})

		return await this.orderRepository.save(newOrder)
	}

	async findAll(
		currentPage: number,
		pageSize: number,
		keyword?: string,
	): Promise<DataPagination<Order | null>> {
		const skip = (currentPage - 1) * pageSize;
		const queryBuilder = this.orderRepository
			.createQueryBuilder('order')
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
		if (!orderById) throw new NotFoundException('Order not found');

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

		const {topicId} = updateOrderDto

		const order = await this.orderRepository.findOne({ where: { id } });
		if (!order) {
			throw new NotFoundException('Order not found');
		}
		if(topicId) {
			const isTopicExistsById = await this.topicService.checkExistsById(topicId);
			if(!isTopicExistsById)
				throw new NotFoundException('Topic not found');
		}

		Object.assign(order, updateOrderDto);

		return await this.orderRepository.save(order);
	}

	// order chua co file hoac da co file
	async remove(id: string): Promise<true> {
		const order = await this.orderRepository.findOne({ where: { id } });

		if (!order) {
			throw new NotFoundException(`Order with ID ${id} not found`);
		}

		// if (order.gcsFilesId) {
		// 	await this.fileService.remove(order.gcsFilesId);
		// }

		const result = await this.orderRepository.delete(id);

		if (result.affected === 0) {
			throw new NotFoundException(`Delete file on GCS failed`);
		}
		return true;
	}
}
