import {
	BadRequestException,
	forwardRef,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as Redis from 'ioredis';
import { GenerateDownloadUrlDto } from 'src/google-cloud-storage/dtos/requests/generate-download-url.req.dto';
import { GenerateUploadUrlDto } from 'src/google-cloud-storage/dtos/requests/generate-upload-url-req.dto';
import { GCSService } from 'src/google-cloud-storage/gcs.service';
import { OrderService } from 'src/orders/order.service';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateFileDto } from './dto/requests/create-file.dto';
import { GetUploadUrlDto } from './dto/requests/get-url-upload.req.dto';
import { ResGetDownloadUrl } from './dto/responses/get-download-url.res.dto';
import { ResGetUploadUrl } from './dto/responses/get-upload-url.res.dto';
import { File } from './entities/file.entity';
import { ENTITY_TYPE_ENUM } from './enums/entity-type.enum';

@Injectable()
export class FileService {
	// constructor(
	// 	@InjectRepository(File)
	// 	private readonly fileRepository: Repository<File>,
	// 	@Inject('REDIS') private readonly redisClient: Redis.Redis,
	// 	private readonly gcsService: GCSService,
	// 	private readonly configService: ConfigService,
	// 	@Inject(forwardRef(() => OrderService))
	// 	private readonly orderService: OrderService,
	// ) {}

	// async create(payload: CreateFileDto): Promise<File> {
	// 	const newFile = this.fileRepository.create(payload);
	// 	return await this.fileRepository.save(newFile);
	// }

	// async findAll(): Promise<File[]> {
	// 	return await this.fileRepository.find();
	// }

	// async findOne(id: string): Promise<File> {
	// 	const gcsFile = await this.fileRepository.findOne({ where: { id } });
	// 	if (!gcsFile)
	// 		throw new NotFoundException(`File with ID ${id} not found`);
	// 	return gcsFile;
	// }

	// async findByEntity(
	// 	entityType: ENTITY_TYPE_ENUM,
	// 	entityId: string,
	// ): Promise<File | null> {
	// 	return await this.fileRepository.findOne({
	// 		where: { entityType, entityId },
	// 	});
	// }

	// async remove(id: string): Promise<true> {
	// 	const file = await this.fileRepository.findOne({ where: { id } });

	// 	if (!file) {
	// 		throw new NotFoundException(`File with ID ${id} not found`);
	// 	}

	// 	const filePath = this.removePrefix(file.gcsPath);

	// 	// xoa file tren gcs
	// 	await this.gcsService.deleteFile(filePath);

	// 	const result = await this.fileRepository.delete(id);
	// 	if (result.affected === 0) {
	// 		throw new NotFoundException(`File with ID ${id} not found`);
	// 	}

	// 	return true;
	// }

	// calculateExpirationTime(fileSize: number): number {
	// 	const baseExpiration = 300; // 5 phút mặc định
	// 	const extraTimePerMB = 30; // Thêm 30 giây cho mỗi MB

	// 	const fileSizeMB = fileSize / (1024 * 1024); // Chuyển bytes -> MB
	// 	return baseExpiration + Math.ceil(fileSizeMB * extraTimePerMB);
	// }

	// async isEntityById(
	// 	entityType: ENTITY_TYPE_ENUM,
	// 	entityId: string,
	// ): Promise<boolean> {
	// 	switch (entityType) {
	// 		case ENTITY_TYPE_ENUM.ORDER: {
	// 			const orderById =
	// 				await this.orderService.isOrderExist(entityId);
	// 			if (!orderById) return false;
	// 			else return true;
	// 		}

	// 		default:
	// 			return false;
	// 	}
	// }

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
	// 	const { entityType, fileName, contentType, fileSize, entityId } =
	// 		payload;

	// 	// Kiểm tra xem entity (ví dụ: Order) có tồn tại hay không
	// 	const isEntityExist = await this.isEntityById(entityType, entityId);

	// 	if (!isEntityExist) {
	// 		throw new NotFoundException(
	// 			`${entityType}: ${entityId} is not found`,
	// 		);
	// 	}

	// 	// Xác định loại file
	// 	const fileType = contentType.split('/')[0];
	// 	const timestamp = Date.now();

	// 	// tạo file path duy nhất
	// 	const filePath = `${entityType}/${fileType}/${timestamp}_${fileName}`;

	// 	// Tính thời gian hết hạn dựa trên kích thước file
	// 	const expiresInSeconds = this.calculateExpirationTime(+fileSize);

	// 	// Tạo link upload qua GCSService
	// 	const generateUploadUrlDto = new GenerateUploadUrlDto(
	// 		filePath,
	// 		contentType,
	// 		expiresInSeconds,
	// 	);

	// 	const resGenUploadUrl =
	// 		await this.gcsService.generateUploadURL(generateUploadUrlDto);

	// 	if (!resGenUploadUrl?.url) {
	// 		throw new BadRequestException('Failed to generate upload URL');
	// 	}

	// 	// Tạo submit key và lưu thông tin file vào Redis
	// 	const submitKey = uuidv4();
	// 	const bucketName =
	// 		this.configService.get<string>('BUCKET_NAME') || 'ant-task';
	// 	const gcsPath = `storage.cloud.google.com/${bucketName}/${filePath}`;

	// 	const fileInfo: CreateFileDto = { ...payload, gcsPath };

	// 	await this.redisClient.set(
	// 		submitKey,
	// 		JSON.stringify(fileInfo),
	// 		'EX',
	// 		expiresInSeconds,
	// 	);

	// 	return new ResGetUploadUrl(resGenUploadUrl.url, submitKey);
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
