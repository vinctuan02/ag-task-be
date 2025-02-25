import { BadRequestException, forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
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
import { TypeOrderProductEnum } from './enums/type-order.enum';
import { OrderProductService } from 'src/order-product/order-product.service';
import { CreateOrderProductDto } from 'src/order-product/dto/req/create-order-product.dto';
import { Message } from 'src/common/message/message';

@Injectable()
export class OrderService {
	constructor(
		@InjectRepository(Order)
		private readonly orderRepository: Repository<Order>,
		private readonly userService: UsersService,

		@Inject(forwardRef(() => TopicService))
		private readonly topicService: TopicService,

		@Inject(forwardRef(() => OrderProductService))
		private readonly orderProductService: OrderProductService
		// private readonly fileService: FileService,
	) {}


	async create(
		createOrderDto: CreateOrderDto,
		userId: string,
	): Promise<Order> {
		const { topicId, type } = createOrderDto;

		const errors: ErrorDetail[] = [];

		const isUserExistsById = await this.userService.checkExistsById(userId);
		if (!isUserExistsById) {
			errors.push(new ErrorDetail('userId', Message.userNotFound));
		}

		// codeOrder // check topic root
		let codeOrder: string = '';
		try {
			const topicById = await this.topicService.getTopicById(topicId);

			if(!topicById.parent) {
				errors.push(new ErrorDetail('topicId', Message.topicIsRoot));
			}

			const codeTopic = topicById.code;

			codeOrder = await this.generateCodeOrder(codeTopic);
			
		} catch (error) {
			errors.push(new ErrorDetail('topicId', Message.topicNotFound));
		} 

		if (errors.length > 0) {
			throw new ErrorResDto(
				HttpStatus.BAD_REQUEST,
				Message.createOrderFailed,
				HttpErrorMessage.BAD_REQUEST,
				errors,
			);
		}

		const newOrder = this.orderRepository.create({
			...createOrderDto,
			code: codeOrder,
			userCreatorId: userId,
			topic: { id: topicId } as Topic,
		});

		const savedOrder = await this.orderRepository.save(newOrder);

		this.createOrderProducts(savedOrder, type)

		return savedOrder;
	}

	async createOrderProducts (savedOrder: Order, type: TypeOrderProductEnum){
		if(type=== TypeOrderProductEnum.VIDEO) { 
			// api tao order-product 

			const createOrderProductThumbnailDto: CreateOrderProductDto = {
					type: TypeOrderProductEnum.IMAGE,
					orderId: savedOrder.id
			}

			const createOrderProductVideoDto: CreateOrderProductDto = {
				type: TypeOrderProductEnum.VIDEO,
				orderId: savedOrder.id
			}

			await this.orderProductService.create(createOrderProductThumbnailDto)
			await this.orderProductService.create(createOrderProductVideoDto)
		}else {
			const createOrderProductDto: CreateOrderProductDto = {
				type: savedOrder.type,
				orderId: savedOrder.id
			}

			await this.orderProductService.create(createOrderProductDto)
		}
	}

	async findAll(
		currentPage: number,
		pageSize: number,
		keyword?: string,
		type?: TypeOrderProductEnum,
		deadline?: Date
	): Promise<DataPagination<Order | null>> {
		const skip = (currentPage - 1) * pageSize;
		const queryBuilder = this.orderRepository
			.createQueryBuilder('order')
			.leftJoin('order.topic', 'topic')
			.addSelect(['topic.id', 'topic.code', 'topic.note'])
			.orderBy('order.dateUpdated', 'DESC')
			.skip(skip)
			.take(pageSize);

		if (type) {
			queryBuilder.andWhere('order.type = :type', { type });
		}

		if (deadline) {
			queryBuilder.andWhere('order.deadline = :deadline', { deadline });
		}

		if (keyword) {
			queryBuilder.andWhere(
				new Brackets((qb) => {
					qb.where('order.content LIKE :keyword', {
						keyword: `%${keyword}%`,
					})
						.orWhere('order.code LIKE :keyword', {
							keyword: `%${keyword}%`,
						})
						.orWhere('order.status LIKE :keyword', {
							keyword: `%${keyword}%`,
						})
						.orWhere('order.topic LIKE :keyword', {
							keyword: `%${keyword}%`,
						})
				}),
			);
		}

		const [orders, totalItems] = await queryBuilder.getManyAndCount();

		const totalPages = Math.ceil(totalItems / pageSize);
		const metadata = new MetadataDto(
			currentPage,
			pageSize,
			totalItems,
			totalPages,
		);

		return new DataPagination(orders, metadata);
	}

	async findOne(id: string): Promise<Order> {
		const orderById = await this.orderRepository
							.createQueryBuilder('order')
							.leftJoin('order.orderProduct', 'orderProduct')
							.addSelect(['orderProduct.id', 'orderProduct.assigneeId','orderProduct.type'])
							.where('order.id = :id', {id})
							.getOne()

		if (!orderById) {
			throw new ErrorResDto(
				HttpStatus.BAD_REQUEST,
				Message.getOrderByIdFailed,
				HttpErrorMessage.BAD_REQUEST,
				[new ErrorDetail('orderId', Message.orderNotFound)],
			);
		}

		return orderById;
	}

	async update(
		id: string,
		updateOrderDto: Partial<UpdateOrderDto>,
	): Promise<Order> {
		const { topicId, type } = updateOrderDto;
		
		const errors: ErrorDetail[] = [];

		// const order = await this.orderRepository.findOne({ where: { id } });

		const order = await this.orderRepository
			.createQueryBuilder('order')
			.leftJoin('order.orderProduct', 'orderProduct')
			.addSelect(['orderProduct.id', 'orderProduct.assigneeId'])
			.where('order.id = :id', { id })
			.getOne();

		if (!order) {
			errors.push(new ErrorDetail('orderId', Message.orderNotFound));
		}

		if(type && type !== order?.type){
			if(type !== order?.type){
				const orderProducts = order?.orderProduct;
				orderProducts?.map((orderProduct) => {
					if(orderProduct.assigneeId) {
						errors.push(new ErrorDetail('assigneeId', Message.assigneeIdExists));
						return
					}
				})
			}
			
		}

		// if(order?.userCreatorId)
		let codeOrder: string = '';
		if (topicId) {
			try {
				const topicById = await this.topicService.getTopicById(topicId);
	
				if(!topicById.parent) {
					errors.push(new ErrorDetail('topicId', Message.topicIsRoot));
				}

				const codeTopic = topicById.code;

				codeOrder = await this.generateCodeOrder(codeTopic);

			} catch (error) {
				errors.push(new ErrorDetail('topicId', Message.topicNotFound));
			} 
		}

		if (errors.length > 0 || !order) {
			throw new ErrorResDto(
				HttpStatus.BAD_REQUEST,
				Message.updateOrderFailed,
				HttpErrorMessage.BAD_REQUEST,
				errors,
			);
		}

		const oldType = order.type

		Object.assign(order, updateOrderDto);
		order.code = codeOrder;

		const savedOrder = await this.orderRepository.save(order);

		// xoa order product, tao lai
		if(type && type !== oldType) {
			const orderProducts = order?.orderProduct;
			const orderProductIds: string[] = []
			orderProducts.forEach((orderProduct) => {
				orderProductIds.push(orderProduct.id)
			})

			await this.orderProductService.deleteManyOrderProductById(orderProductIds)

			await this.createOrderProducts(savedOrder, type)
		}

		return await this.findOne(savedOrder.id)
	}

	async remove(id: string): Promise<boolean> {
		const order = await this.orderRepository.findOne({ where: { id } });

		// if(order?.status.)

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

	async checkOrderExistsByTopicId(topicId: string): Promise<boolean> {
		const order = await this.orderRepository.findOne({
		  where: { topic: { id: topicId } },
		});
		return !!order;
	}
 
	async findOrderByTopicId(topicId) {
		const topic = await this.orderRepository.findOne({where: {topic: topicId}})

		if (!topic) {
			throw new ErrorResDto(
				HttpStatus.BAD_REQUEST,
				Message.getOrderByIdFailed,
				HttpErrorMessage.BAD_REQUEST,
				[new ErrorDetail('topicId', Message.orderNotFound)],
			);
		}

		return topic
	}

	async generateCodeOrder(codeTopic: string): Promise<string> {
		const result = await this.orderRepository
		  .createQueryBuilder('order')
		  .select('order.code', 'orderCode')
		  .where('order.code like :prefix', { prefix: `${codeTopic}_%` })
		  .orderBy('order.code', 'DESC')
		  .getRawOne<{ orderCode: string }>();
	  
		let newSuffix: number;
		if (!result || !result.orderCode) {
		  newSuffix = 1;
		} else {
		  const suffixStr = result.orderCode.substring(codeTopic.length + 1);
		  const lastNumber = Number(suffixStr);
		  newSuffix = lastNumber + 1;
		}
	  
		return `${codeTopic}_${newSuffix}`;
	}

	async updateCodeOrder(topicId: string, oldTopicCode: string, newTopicCode: string): Promise<void> {
		const orders = await this.orderRepository.find({ where: { topic: { id: topicId } } });
	  
		orders.forEach((order) => {
		  // Lấy phần hậu tố của order.code sau khi bỏ đi oldTopicCode
		  const suffix = order.code.substring(oldTopicCode.length);
		  order.code = `${newTopicCode}${suffix}`;
		});
	  
		await this.orderRepository.save(orders);
	}

	
}
