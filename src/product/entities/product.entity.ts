import { BaseEntity } from 'src/common/entities/base.entity';
import { File } from 'src/file/entities/file.entity';
import { OrderProduct } from 'src/order-product/entities/order-product.entity';
import {
	Column,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { OrientationEnum } from '../enums/orientation.enum';

@Entity()
export class Product extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ nullable: true })
	width: number;

	@Column({ nullable: true })
	height: number;

	@Column({ name: 'frame_rate', type: 'float', nullable: true })
	frameRate: number;

	@Column({ nullable: true })
	duration: number;

	@Column({ nullable: true })
	encoding: string;

	@Column({ type: 'enum', enum: OrientationEnum, nullable: true })
	orientation: OrientationEnum;

	// @Column({ name: 'file_id' })
	// fileId: string;

	@Column({ name: 'user_creator_id', nullable: true }) // dev-test
	userCreatorId: string;

	@OneToOne(() => OrderProduct, (orderProduct) => orderProduct.product)
	orderProduct: OrderProduct;

	@OneToOne(() => File, (file) => file.product, { eager: true })
	@JoinColumn({ name: 'file_id' })
	file: File;
}
