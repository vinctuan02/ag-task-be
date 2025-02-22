import { Body, Controller, Post } from '@nestjs/common';
import { SuccessResDto } from 'src/common/dtos/response/success/success-reponse.dto';
import { CreateProductDto } from './dto/req/create-product.dto';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@Post()
	async createOrder(
		@Body() createProductDto: CreateProductDto,
		// @Request() req: RequestWithUser,
	): Promise<SuccessResDto<Product>> {
		// const userId: string = '38306fb4-3e40-4dc1-9411-6b4e17b59d12'; // fix

		const result = await this.productService.create(createProductDto);
		return new SuccessResDto(
			201,
			'message.createProductSuccessfully',
			result,
		);
	}
}
