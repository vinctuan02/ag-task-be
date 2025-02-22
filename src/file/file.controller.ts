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
import { CreateFileDto } from './dto/req/create-file.dto';
import { UpdateFileDto } from './dto/req/update-file.dto';
import { File } from './entities/file.entity';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
	constructor(private readonly fileSerivce: FileService) {}

	@Post()
	async createFile(
		@Body() createFileDto: CreateFileDto,
		// @Request() req: RequestWithUser,
	): Promise<SuccessResDto<File>> {
		// const userId: string = "38306fb4-3e40-4dc1-9411-6b4e17b59d12"; // fix

		const result = await this.fileSerivce.create(createFileDto);
		return new SuccessResDto(201, 'message.createFileSuccessfully', result);
	}

	@Get()
	async findAll(
		@Query() query: FindAllDto,
	): Promise<SuccessResDto<DataPagination<File | null>>> {
		const result = await this.fileSerivce.findAll(
			query.page ?? 1,
			query.pageSize ?? 10,
			query?.keyword,
		);
		return new SuccessResDto(
			200,
			'message.getAllFilesSuccessfully',
			result,
		);
	}

	@Get(':id')
	async findOne(@Param('id') id: string): Promise<SuccessResDto<File>> {
		const result = await this.fileSerivce.findOne(id);
		return new SuccessResDto(200, 'message.getFileByIdSucessfully', result);
	}

	@Patch(':id')
	async update(
		@Param('id') id: string,
		@Body() updateFileDto: UpdateFileDto,
	): Promise<SuccessResDto<File>> {
		const result = await this.fileSerivce.update(id, updateFileDto);
		return new SuccessResDto(
			200,
			'message.updateFileByIdSuccessfully',
			result,
		);
	}

	@Delete(':id')
	async remove(@Param('id') id: string): Promise<SuccessResDto<boolean>> {
		await this.fileSerivce.remove(id);
		return new SuccessResDto(204, 'message.deleteFileByIdSuccessfully');
	}
}
