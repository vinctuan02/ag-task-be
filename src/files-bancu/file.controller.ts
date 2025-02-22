import { Controller } from '@nestjs/common';

@Controller('file')
export class FileController {
	// constructor(private readonly fileService: FileService) {}
	// // crud
	// @Post()
	// async create(
	// 	@Body() createFileDto: CreateFileDto,
	// ): Promise<SuccessResDto<File>> {
	// 	const result = await this.fileService.create(createFileDto);
	// 	return new SuccessResDto(201, 'Create file dto oke', result);
	// }
	// @Get()
	// async getAll(): Promise<SuccessResDto<File[]>> {
	// 	const result = await this.fileService.findAll();
	// 	return new SuccessResDto(200, 'Get all file oke', result);
	// }
	// @Get(':id')
	// async findOne(@Param('id') id: string): Promise<SuccessResDto<File>> {
	// 	const result = await this.fileService.findOne(id);
	// 	return new SuccessResDto(200, 'Get file by id oke', result);
	// }
	// @Get('entity/:entityType/:entityId')
	// async findByEntity(
	// 	@Param('entityType') entityType: ENTITY_TYPE_ENUM,
	// 	@Param('entityId') entityId: string,
	// ): Promise<SuccessResDto<File | null>> {
	// 	const result = await this.fileService.findByEntity(
	// 		entityType,
	// 		entityId,
	// 	);
	// 	return new SuccessResDto(
	// 		200,
	// 		`Get file by ${entityType} oke`,
	// 		result,
	// 	);
	// }
	// @Delete(':id')
	// async remove(@Param('id') id: string): Promise<SuccessResDto<null>> {
	// 	await this.fileService.remove(id);
	// 	return new SuccessResDto(204, 'Delete file oke');
	// }
	// // google-cloud-storage
	// @ApiOperation({ summary: 'Get link upload' })
	// @Post('get-link-upload')
	// async getUploadUrlFile(
	// 	@Body() data: GetUploadUrlDto,
	// ): Promise<SuccessResDto<ResGetUploadUrl>> {
	// 	const result: ResGetUploadUrl =
	// 		await this.fileService.getUploadUrlFile(data);
	// 	return new SuccessResDto(
	// 		200,
	// 		'Get Url upload by FileService oke',
	// 		result,
	// 	);
	// }
	// @Post('submit-upload')
	// async submitUpload(
	// 	@Body('submitKey') submitKey: string,
	// ): Promise<SuccessResDto<File>> {
	// 	const result = await this.fileService.submitUpload(submitKey);
	// 	return new SuccessResDto(200, 'Submit upload oke', result);
	// }
	// @Get('get-url-down/:id')
	// async getDownloadUrlById(
	// 	@Param('id') id: string,
	// ): Promise<SuccessResDto<ResGetDownloadUrl>> {
	// 	const result = await this.fileService.getDownloadUrlById(id);
	// 	return new SuccessResDto(
	// 		200,
	// 		'Get url down by file id oke',
	// 		result,
	// 	);
	// }
}
