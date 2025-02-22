import { BaseEntity } from 'src/common/entities/base.entity';
import { Order } from 'src/orders/entities/order.entity';
import { TypeOrderProductEnum } from 'src/orders/enums/type-order.enum';
import { Product } from 'src/product/entities/product.entity';
import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class OrderProduct extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	// @Column()
	// order_id: string;

	@Column({ nullable: true })
	note: string;

	@Column({ name: 'assignee_id', nullable: true })
	assigneeId: string;

	// @Column({ name: 'product_id' })
	// productId: string

	@Column()
	type: TypeOrderProductEnum;

	@ManyToOne(() => Order, (order) => order.orderProduct, { eager: true })
	@JoinColumn({ name: 'order_id' })
	order: Order;

	@OneToOne(() => Product, (product) => product.orderProduct, { eager: true })
	@JoinColumn({ name: 'product_id' })
	product: Product;
}
