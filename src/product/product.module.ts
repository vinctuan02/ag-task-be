import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/user.module';
import { Product } from './entities/product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
	imports: [TypeOrmModule.forFeature([Product]), UsersModule],
	exports: [],
	controllers: [ProductController],
	providers: [ProductService],
})
export class ProductModule {}
