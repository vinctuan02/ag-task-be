import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpErrorMessage } from 'src/common/dtos/response/error/enums/http.error.message.enum';
import {
	ErrorDetail,
	ErrorResDto,
} from 'src/common/dtos/response/error/errors-response.dto';
import { DataPagination } from 'src/common/dtos/response/pagination/data-pagination.dto';
import { MetadataDto } from 'src/common/dtos/response/pagination/metadata.dto';
import { Brackets, Repository } from 'typeorm';
import { CreateFileDto } from './dto/req/create-file.dto';
import { UpdateFileDto } from './dto/req/update-file.dto';
import { File } from './entities/file.entity';

@Injectable()
export class FileService {
	constructor(
		@InjectRepository(File)
		private readonly fileRepository: Repository<File>,
	) {}

	async create(createFileDto: CreateFileDto): Promise<File> {
		const newFile = this.fileRepository.create(createFileDto);
		return await this.fileRepository.save(newFile);
	}

	async findAll(
		currentPage: number,
		pageSize: number,
		keyword?: string,
	): Promise<DataPagination<File | null>> {
		const skip = (currentPage - 1) * pageSize;
		const queryBuilder = this.fileRepository
			.createQueryBuilder('file')
			.orderBy('file.dateUpdated', 'DESC')
			.skip(skip)
			.take(pageSize);

		if (keyword) {
			queryBuilder.andWhere(
				new Brackets((qb) => {
					qb.where('file.contentType LIKE :keyword', {
						keyword: `%${keyword}%`,
					})
						.orWhere('file.extension LIKE :keyword', {
							keyword: `%${keyword}%`,
						})
						.orWhere('file.fileSizeInByte LIKE :keyword', {
							keyword: `%${keyword}%`,
						})
						.orWhere('file.fileName LIKE :keyword', {
							keyword: `%${keyword}%`,
						});
				}),
			);
		}

		const [files, totalItems] = await queryBuilder.getManyAndCount();

		const totalPages = Math.ceil(totalItems / pageSize);
		const metadata = new MetadataDto(
			currentPage,
			pageSize,
			totalItems,
			totalPages,
		);

		return new DataPagination(files, metadata);
	}

	async findOne(id: string): Promise<File> {
		const fileById = await this.fileRepository.findOne({ where: { id } });
		if (!fileById) {
			throw new ErrorResDto(
				HttpStatus.BAD_REQUEST,
				'message.findFileByIdFailed',
				HttpErrorMessage.BAD_REQUEST,
				[new ErrorDetail('fileId', 'message.fileNotFound')],
			);
		}
		return fileById;
	}

	async update(
		id: string,
		updateOrderDto: Partial<UpdateFileDto>,
	): Promise<File> {
		const fileById = await this.fileRepository.findOne({ where: { id } });

		if (!fileById) {
			throw new ErrorResDto(
				HttpStatus.BAD_REQUEST,
				'message.updateFileFailed',
				HttpErrorMessage.BAD_REQUEST,
				[new ErrorDetail('fileId', 'message.fileNotFound')],
			);
		}

		Object.assign(fileById, updateOrderDto);

		return await this.fileRepository.save(fileById);
	}

	async remove(id: string): Promise<boolean> {
		const fileById = await this.fileRepository.findOne({ where: { id } });

		if (!fileById) {
			throw new ErrorResDto(
				HttpStatus.BAD_REQUEST,
				'message.deleteFileByIdFailed',
				HttpErrorMessage.BAD_REQUEST,
				[new ErrorDetail('fileId', 'message.fileNotFound')],
			);
		}

		const result = await this.fileRepository.delete(id);
		if (result.affected === 0) {
			return false;
		}

		return true;
	}

	async checkIsExistsById(id: string): Promise<boolean> {
		return await this.fileRepository.existsBy({ id });
	}

	calculateExpirationTime(fileSize: number): number {
		const baseExpiration = 300; // 5 phút mặc định
		const extraTimePerMB = 30; // Thêm 30 giây cho mỗi MB

		const fileSizeMB = fileSize / (1024 * 1024); // Chuyển bytes -> MB
		return baseExpiration + Math.ceil(fileSizeMB * extraTimePerMB);
	}

	// async attachFileIdToEntity(
	// 	entityType: ENTITY_TYPE_ENUM,
	// 	entityId: string,
	// 	fileId: string,
	// ): Promise<any> {
	// 	switch (entityType) {
	// 		case ENTITY_TYPE_ENUM.ORDER:
	// 			return this.orderService.update(entityId, {
	// 				gcsFilesId: fileId,
	// 			});
	// 		default:
	// 			throw new BadRequestException(
	// 				`Entity type ${String(entityType)} is not supported for attaching file ID`,
	// 			);
	// 	}
	// }

	// async getUploadUrlFile(payload: GetUploadUrlDto): Promise<ResGetUploadUrl> {
	//     const { entityType, fileName, contentType, fileSize, entityId } = payload;

	//     // Kiểm tra xem entity (ví dụ: Order) có tồn tại hay không
	//     const isEntityExist = await this.isEntityById(entityType, entityId);

	//     if (!isEntityExist) {
	//         throw new NotFoundException(
	//             `${entityType}: ${entityId} is not found`,
	//         );
	//     }

	//     // 	// Xác định loại file
	//     const fileType = contentType.split('/')[0];
	//     const timestamp = Date.now();

	//     // tạo file path duy nhất
	//     const filePath = `${entityType}/${fileType}/${timestamp}_${fileName}`;

	//     // Tính thời gian hết hạn dựa trên kích thước file
	//     const expiresInSeconds = this.calculateExpirationTime(+fileSize);

	//     // Tạo link upload qua GCSService
	//     const generateUploadUrlDto = new GenerateUploadUrlDto(
	//         filePath,
	//         contentType,
	//         expiresInSeconds,
	//     );

	//     const resGenUploadUrl =
	//         await this.gcsService.generateUploadURL(generateUploadUrlDto);

	//     if (!resGenUploadUrl?.url) {
	//         throw new BadRequestException('Failed to generate upload URL');
	//     }

	//     // Tạo submit key và lưu thông tin file vào Redis
	//     const submitKey = uuidv4();
	//     const bucketName =
	//         this.configService.get<string>('BUCKET_NAME') || 'ant-task';
	//     const gcsPath = `storage.cloud.google.com/${bucketName}/${filePath}`;

	//     const fileInfo: CreateFileDto = { ...payload, gcsPath };

	//     await this.redisClient.set(
	//         submitKey,
	//         JSON.stringify(fileInfo),
	//         'EX',
	//         expiresInSeconds,
	//     );

	//     return new ResGetUploadUrl(resGenUploadUrl.url, submitKey);
	// }

	// async submitUpload(submitKey: string): Promise<File> {
	// 	const fileInfoString = await this.redisClient.get(submitKey);
	// 	if (!fileInfoString) {
	// 		throw new NotFoundException('Invalid submit key');
	// 	}

	// 	const createGcsFileDto: CreateFileDto = JSON.parse(
	// 		fileInfoString,
	// 	) as CreateFileDto;

	// 	const isEntityExist = await this.isEntityById(
	// 		createGcsFileDto.entityType,
	// 		createGcsFileDto.entityId,
	// 	);

	// 	if (!isEntityExist) {
	// 		throw new NotFoundException(
	// 			`${createGcsFileDto.entityType}: ${createGcsFileDto.entityId} is not found`,
	// 		);
	// 	}

	// 	// tao file, them fileId vao entity
	// 	const newFile = await this.create(createGcsFileDto);

	// 	await this.attachFileIdToEntity(
	// 		newFile.entityType,
	// 		newFile.entityId,
	// 		newFile.id,
	// 	);
	// 	return newFile;
	// }

	// async getDownloadUrlById(id: string): Promise<ResGetDownloadUrl> {
	// 	const file = await this.findOne(id);

	// 	if (!file) {
	// 		throw new NotFoundException('File by id not found');
	// 	}

	// 	const filePatchToGenUrl = this.removePrefix(file.gcsPath);
	// 	const expiresInSeconds = this.calculateExpirationTime(+file.fileSize);
	// 	const generateDownloadUrlDto: GenerateDownloadUrlDto =
	// 		new GenerateDownloadUrlDto(filePatchToGenUrl, expiresInSeconds);

	// 	const resGenDownloadUrl = await this.gcsService.generateDownloadUrl(
	// 		generateDownloadUrlDto,
	// 	);
	// 	const resGetDownloadUrl: ResGetDownloadUrl = resGenDownloadUrl;

	// 	return resGetDownloadUrl;
	// }

	// removePrefix(url: string): string {
	// 	return url.replace(/^storage\.cloud\.google\.com\/ant-task\//, '');
	// }
}
