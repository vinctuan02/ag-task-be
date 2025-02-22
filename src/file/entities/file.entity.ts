import { IsNumber } from 'class-validator';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Product } from 'src/product/entities/product.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class File extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ name: 'content_type' }) // fix -> enum
	contentType: string;

	@Column()
	extension: string;

	@Column({ name: 'file_size_in_byte', type: 'bigint' })
	@IsNumber()
	fileSizeInByte: string;

	@Column({ name: 'file_name' })
	fileName: string;

	@OneToOne(() => Product, (product) => product.file)
	product: Product;
}
