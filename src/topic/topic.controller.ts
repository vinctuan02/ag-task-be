import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SuccessResDto } from 'src/common/dtos/response/success/success-reponse.dto';
import { CreateTopicDto } from './dto/req/create-topic.dto';
import { UpdateTopicDto } from './dto/req/update-topic.dto';
import { UpdateTopicsPositionDto } from './dto/req/update-topics-position.dto';
import { Topic } from './entities/topic.entity';
import { TopicService } from './topic.service';

@ApiTags('Topics')
@Controller('topics')
export class TopicController {
	constructor(private readonly topicService: TopicService) {}

	@Post()
	@ApiOperation({ summary: 'Create a new topic' })
	@ApiResponse({
		status: 200,
		description: 'Topic created successfully',
		type: SuccessResDto,
	})
	async create(
		@Body() createTopicDto: CreateTopicDto,
	): Promise<SuccessResDto<Topic>> {
		const topic = await this.topicService.create(createTopicDto);
		return new SuccessResDto(200, 'message.createTopicSuccessfully', topic);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get topic by id' })
	@ApiResponse({
		status: 200,
		description: 'Get topic by id successfully',
		type: SuccessResDto,
	})
	async getTopicById(@Param('id') id: string) {
		const topic = await this.topicService.getTopicById(id);
		return new SuccessResDto(
			200,
			'message.getTopicByIdSuccessfully',
			topic,
		);
	}

	@Get()
	@ApiOperation({ summary: 'Get all topics (full tree)' })
	@ApiResponse({
		status: 200,
		description: 'Get all topics successfully',
		type: SuccessResDto,
	})
	async findAll() {
		const allTopics = await this.topicService.finAll();
		return new SuccessResDto(
			200,
			'message.getAllTopicSuccessfully',
			allTopics,
		);
	}

	@Patch('update-position')
	async updateTopicsPosition(
		@Body() updateTopicsPositionDto: UpdateTopicsPositionDto,
	): Promise<SuccessResDto<null>> {
		await this.topicService.updateTopicsPosition(updateTopicsPositionDto);
		return new SuccessResDto(
			200,
			'message.updateTopicsPositionSuccessfully',
		);
	}

	@Patch(':id')
	async updateTopic(
		@Param('id') id: string,
		@Body() updateTopicDto: UpdateTopicDto,
	): Promise<SuccessResDto<Topic>> {
		const topic = await this.topicService.update(id, updateTopicDto);
		return new SuccessResDto(200, 'Update topic oke', topic);
	}

	@Delete('clear')
	@ApiOperation({ summary: 'Delete all topics' })
	@ApiResponse({
		status: 200,
		description: 'All topics deleted successfully',
		type: SuccessResDto,
	})
	async deleteAllTopics(): Promise<SuccessResDto<null>> {
		await this.topicService.deleteAllTopics();
		return new SuccessResDto(204, 'All topics deleted successfully');
	}

	@Delete(':id')
	async deleteTopic(@Param('id') id: string): Promise<SuccessResDto<null>> {
		await this.topicService.deleteByTopicById(id);
		return new SuccessResDto(204, 'message.deleteTopicSucessfully');
	}
}
