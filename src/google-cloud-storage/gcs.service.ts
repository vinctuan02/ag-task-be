import { GetSignedUrlConfig, Storage } from '@google-cloud/storage';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GenerateDownloadUrlDto } from './dtos/requests/generate-download-url.req.dto';
import { GenerateUploadUrlDto } from './dtos/requests/generate-upload-url-req.dto';
import { ResGenerateUrl } from './dtos/responses/generate-url.res.dto';
import { BucketActionEnum } from './enums';

@Injectable()
export class GCSService {
	private storage: Storage;
	private bucketName: string;

	constructor(private readonly configService: ConfigService) {
		const keyFilePath = this.configService.get<string>(
			'GOOGLE_APPLICATION_CREDENTIALS',
		);
		this.bucketName =
			this.configService.get<string>('BUCKET_NAME') || 'ant-task';

		this.storage = new Storage({
			keyFilename: keyFilePath,
		});
	}

	async generateUploadURL(
		payload: GenerateUploadUrlDto,
	): Promise<ResGenerateUrl> {
		const { filePath, contentType, expiresInSeconds = 5 * 60 } = payload;

		const file = this.storage.bucket(this.bucketName).file(filePath);

		const [url] = await file.getSignedUrl({
			action: BucketActionEnum.write,
			expires: Date.now() + expiresInSeconds * 1000,
			contentType,
		});

		return new ResGenerateUrl(url);
	}

	async generateDownloadUrl(
		payload: GenerateDownloadUrlDto,
	): Promise<ResGenerateUrl> {
		const { filePath, expiresInSeconds = 5 * 60 } = payload;
		const options: GetSignedUrlConfig = {
			version: 'v4',
			action: BucketActionEnum.read,
			expires: Date.now() + expiresInSeconds * 1000000, // dev-test
		};

		const [url] = await this.storage
			.bucket(this.bucketName)
			.file(filePath)
			.getSignedUrl(options);
		return new ResGenerateUrl(url);
	}

	async deleteFile(filePath: string): Promise<true> {
		const file = this.storage.bucket(this.bucketName).file(filePath);

		const [exists] = await file.exists();

		if (!exists) {
			throw new NotFoundException('File is not found');
		}

		await file.delete();

		return true;
	}

	async findAll(): Promise<string[]> {
		const [files] = await this.storage.bucket(this.bucketName).getFiles();
		return files.map((file) => file.name);
	}
}
