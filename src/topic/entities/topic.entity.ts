import { BaseEntity } from 'src/common/entities/base.entity';
import { Order } from 'src/orders/entities/order.entity';
import {
	Column,
	Entity,
	JoinColumn,
	OneToMany,
	PrimaryGeneratedColumn,
	Tree,
	TreeChildren,
	TreeParent,
} from 'typeorm';

@Entity('topics')
@Tree('closure-table')
export class Topic extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@TreeParent({ onDelete: 'CASCADE' })
	@JoinColumn({ name: 'parent_id' })
	parent: Topic;

	@TreeChildren({ cascade: true })
	children: Topic[];

	@Column({ unique: true })
	code: string;

	@Column({ nullable: true })
	description: string;

	@Column({ nullable: true })
	note: string;

	@Column()
	order: number;

	@OneToMany(() => Order, (order) => order.topic)
	orders: Order[];
}
