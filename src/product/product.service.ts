import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpErrorMessage } from 'src/common/dtos/response/error/enums/http.error.message.enum';
import {
	ErrorDetail,
	ErrorResDto,
} from 'src/common/dtos/response/error/errors-response.dto';
import { UsersService } from 'src/users/user.service';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/req/create-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
	constructor(
		@InjectRepository(Product)
		private readonly productRepository: Repository<Product>,
		private readonly userService: UsersService,
	) {}

	async create(payload: CreateProductDto): Promise<Product> {
		const { userCreatorId } = payload;

		const errors: ErrorDetail[] = [];

		if (userCreatorId) {
			const isUserExistsById =
				await this.userService.checkExistsById(userCreatorId);
			if (!isUserExistsById) {
				errors.push(new ErrorDetail('userId', 'message.userNotFound'));
			}
		}

		if (errors.length > 0) {
			throw new ErrorResDto(
				HttpStatus.BAD_REQUEST,
				'message.createProductFailed',
				HttpErrorMessage.BAD_REQUEST,
				errors,
			);
		}

		const newProduct = this.productRepository.create(payload);

		return await this.productRepository.save(newProduct);
	}
}
