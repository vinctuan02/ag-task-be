import { BadRequestException, forwardRef, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpErrorMessage } from 'src/common/dtos/response/error/enums/http.error.message.enum';
import {
	ErrorDetail,
	ErrorResDto,
} from 'src/common/dtos/response/error/errors-response.dto';
import { In, TreeRepository } from 'typeorm';
import { CreateTopicDto } from './dto/req/create-topic.dto';
import { UpdateTopicDto } from './dto/req/update-topic.dto';
import { UpdateTopicsPositionDto } from './dto/req/update-topics-position.dto';
import { Topic } from './entities/topic.entity';
import { OrderService } from 'src/orders/order.service';
import { Message } from 'src/common/message/message';

@Injectable()
export class TopicService {
	constructor(
		@InjectRepository(Topic)
		private readonly topicRepository: TreeRepository<Topic>,

		@Inject(forwardRef(() => OrderService))
		private readonly orderService: OrderService
	) {}

	async create(payload: CreateTopicDto): Promise<Topic> {
		const { code, parentId } = payload;
		const errors: ErrorDetail[] = [];

		const isExistByCode: boolean = await this.checkIsExistByCode(code);

		if (isExistByCode) {
			errors.push(
				new ErrorDetail('code', 'message.codeTopicAlreadyExists'),
			);
		}

		let parent: Topic | null = null;
		if (parentId) {
			parent = await this.topicRepository.findOne({
				where: { id: parentId },
			});

			if (!parent) {
				errors.push(
					new ErrorDetail('parentId', 'message.parentTopicNotFound'),
				);
			}
		}

		if (errors.length > 0) {
			throw new ErrorResDto(
				HttpStatus.BAD_REQUEST,
				'message.createTopicFailed',
				HttpErrorMessage.BAD_REQUEST,
				errors,
			);
		}

		const topic: Partial<Topic> = {
			code: payload.code,
			description: payload.description,
			note: payload.note,
			order: payload.order,
			parent: parent ?? undefined,
		};

		const newTopic = this.topicRepository.create(topic);

		return await this.topicRepository.save(newTopic);
	}

	async getTopicById(id: string): Promise<Topic> {
		const topic = await this.topicRepository.findOne({ 
			where: { id },
			relations: ['parent'],
		});
		if (!topic) {
			throw new ErrorResDto(
				HttpStatus.BAD_REQUEST,
				'message.getTopicByIdFailed',
				HttpErrorMessage.BAD_REQUEST,
				[new ErrorDetail('id', 'message.topicNotFound')],
			);
		}

		return await this.topicRepository.findDescendantsTree(topic);
	}

	async findAll(): Promise<Topic[]> {
		const trees = await this.topicRepository.findTrees({
			relations: ['parent']
		});
		// return trees
		const sortTree = (nodes: Topic[]): void => {
			nodes.sort((a, b) => a.order - b.order);
			nodes.forEach((node) => {
				if (node.children && node.children.length > 0) {
					sortTree(node.children);
				}
			});
		};

		sortTree(trees);
		return trees;
	}

	async checkIsExistByCode(code: string): Promise<boolean> {
		const topic = await this.topicRepository.existsBy({ code });

		if (!topic) return false;
		else return true;
	}

	async checkIsExistById(id: string) {
		const topic = await this.topicRepository.existsBy({ id });

		if (!topic) return false;
		else return true;
	}

	async updateTopicsPosition(
		payload: UpdateTopicsPositionDto,
	): Promise<Topic[]> {
		// Lọc bỏ các trường thừa, chỉ lấy id và order
		const cleanTopics = payload.data.map(({ id, order }) => ({
			id,
			order,
		}));

		const ids = cleanTopics.map((topic) => topic.id);
		const cases = cleanTopics
			.map((topic) => `WHEN id = '${topic.id}' THEN ${topic.order}`)
			.join(' ');

		await this.topicRepository
			.createQueryBuilder()
			.update(Topic)
			.set({ order: () => `CASE ${cases} ELSE order END` })
			.where('id IN (:...ids)', { ids })
			.execute();

		return await this.topicRepository.findBy({ id: In(ids) });
	}

	async update(id: string, payload: UpdateTopicDto): Promise<Topic> {
		const { code, parentId } = payload;
		const errors: ErrorDetail[] = [];

		const topicById = await this.topicRepository.findOne({ where: { id } });

		if (!topicById) {
			errors.push({ key: 'id', message: 'message.topicNotFound' });
		}

		if (code && topicById?.code !== code) {
			const isExistByCode: boolean = await this.checkIsExistByCode(code);

			if (isExistByCode) {
				errors.push({
					key: 'code',
					message: 'message.codeTopicAlreadyExists',
				});
			}
		}

		let parent: Topic | null = null;

		if (parentId) {
			parent = await this.topicRepository.findOne({
				where: { id: parentId },
			});

			if (!parent) {
				errors.push({
					key: 'parentId',
					message: 'message.parentTopicNotFound',
				});
			}
		}

		if (errors.length > 0 || !topicById) {
			throw new ErrorResDto(
				HttpStatus.BAD_REQUEST,
				'message.updateTopicByIdFailed',
				HttpErrorMessage.BAD_REQUEST,
				errors,
			);
		}

		const oldTopicCode = topicById.code

		topicById.code = payload.code ?? topicById.code;
		topicById.description = payload.description ?? topicById.description;
		topicById.note = payload.note ?? topicById.note;
		topicById.order = payload.order ?? topicById.order;
		topicById.parent = parent ?? topicById.parent;

		if(payload.code){
			await this.orderService.updateCodeOrder(topicById.id, oldTopicCode, payload.code)
		}

		return await this.topicRepository.save(topicById);
	}

	async deleteByTopicById(id: string) {
		const topic = await this.topicRepository.findOne({ 
			where: { id }, 
			relations: ['children'] 
		});
		const errors: ErrorDetail[] = [];

		if (!topic) {
			throw new ErrorResDto(
				HttpStatus.BAD_REQUEST,
				Message.topic.delete.failed,
				HttpErrorMessage.BAD_REQUEST,
				[new ErrorDetail('topicId', Message.topic.find.byId.failed)]
			);
		}

		if(topic.children && topic.children.length > 0) {
			errors.push(new ErrorDetail('topicId', Message.topic.topicChildrenExists))
		}

		const isOrderExist = await this.orderService.checkOrderExistsByTopicId(topic.id)
		if(isOrderExist) {
				errors.push(new ErrorDetail('topicId', Message.topic.orderExists))
		}

		if(errors.length > 0) {
			throw new ErrorResDto(
				HttpStatus.BAD_REQUEST,
				Message.topic.delete.failed,
				HttpErrorMessage.BAD_REQUEST,
				errors
			)
		}

		const descendants = await this.topicRepository.findDescendants(topic);
		await this.topicRepository.remove(descendants);
	}

	// async deleteAllTopics(): Promise<void> {
	// 	// Tắt kiểm tra khóa ngoại
	// 	await this.topicRepository.query('SET FOREIGN_KEY_CHECKS=0');
	// 	// Xoá tất cả dữ liệu trong bảng closure
	// 	await this.topicRepository.query('DELETE FROM topics_closure');
	// 	// Xoá tất cả dữ liệu trong bảng topics
	// 	await this.topicRepository.query('DELETE FROM topics');
	// 	// Bật lại kiểm tra khóa ngoại
	// 	await this.topicRepository.query('SET FOREIGN_KEY_CHECKS=1');
	// }

	async checkExistsById(id: string): Promise<boolean> {
		return await this.topicRepository.existsBy({ id });
	}
}
