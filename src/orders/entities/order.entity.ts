import { BaseEntity } from 'src/common/entities/base.entity';
import { OrderProduct } from 'src/order-product/entities/order-product.entity';
import { Topic } from 'src/topic/entities/topic.entity';
import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderStatus } from '../enums/status-order.enum';
import { TypeOrderProductEnum } from '../enums/type-order.enum';

@Entity({ name: 'orders' })
export class Order extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'text' })
	content: string;

	@Column({ name: 'illustrative_image_id', nullable: true })
	illustrativeImageId: string;

	@Column({ nullable: true })
	note: string;

	@Column({ type: 'datetime' })
	deadline: Date;

	@Column({ name: 'user_creator_id' })
	userCreatorId: string;

	@Column({
		nullable: true,
		type: 'enum',
		enum: OrderStatus,
		default: OrderStatus.NOT_RECEIVED,
	})
	status: OrderStatus;

	@Column({
		type: 'enum',
		enum: TypeOrderProductEnum,
	})
	type: TypeOrderProductEnum;

	// @Column()
	// topic_id: string;

	@ManyToOne(() => Topic, (topic) => topic.orders, {})
	@JoinColumn({ name: 'topic_id' })
	topic: Topic;

	@OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order, {
		 onDelete: 'CASCADE' 
	})
	orderProduct: OrderProduct[];
}
