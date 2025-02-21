import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { SuccessResDto } from 'src/common/dtos/response/success/success-reponse.dto';
import { GenerateUploadUrlDto } from './dtos/requests/generate-upload-url-req.dto';
import { GCSService } from './gcs.service';

@Controller('gcs')
export class GCSController {
	constructor(private readonly gcsService: GCSService) {}

	@ApiOperation({ summary: 'Generate url upload by gcsService' })
	@Post('generate-url-upload')
	async generateUploadURL(@Body() getUploadUrlDto: GenerateUploadUrlDto) {
		return this.gcsService.generateUploadURL(getUploadUrlDto);
	}

	@ApiOperation({ summary: 'Generate url upload by gcsService' })
	@Post('generate-url-download')
	async generateDownloadURL(@Body() getUploadUrlDto: GenerateUploadUrlDto) {
		return this.gcsService.generateUploadURL(getUploadUrlDto);
	}

	@ApiOperation({ summary: 'Get all files' })
	@Get()
	async findAll(): Promise<SuccessResDto<string[]>> {
		const fileNames = await this.gcsService.findAll();

		return new SuccessResDto(200, 'Get all files oke', fileNames);
	}

	// @ApiOperation({ summary: "" })
	@Delete()
	async deleteFile(
		@Body('filePath') filePath: string,
	): Promise<SuccessResDto<null>> {
		await this.gcsService.deleteFile(filePath);

		return new SuccessResDto(200, 'Delete file on GCS oke');
	}
}
