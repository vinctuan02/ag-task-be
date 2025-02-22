import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ENTITY_TYPE_ENUM } from '../enums/entity-type.enum';

@Entity('files')
export class File extends BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({
		type: 'enum',
		enum: ENTITY_TYPE_ENUM,
		name: 'entity_type',
		default: ENTITY_TYPE_ENUM.ORDER,
	})
	entityType: ENTITY_TYPE_ENUM;

	@Column({ type: 'varchar', name: 'entity_id' })
	entityId: string;

	@Column({ type: 'varchar', name: 'file_name' })
	fileName: string;

	@Column({ type: 'varchar', name: 'content_type' })
	contentType: string;

	@Column({ type: 'bigint', name: 'file_size' })
	fileSize: string;

	@Column({ type: 'varchar', name: 'gcs_path' })
	gcsPath: string;

	// @OneToOne(() => Order, (order) => order.gcsFile)
	// @JoinColumn({ name: 'order_id' })
	// order: Order;
}
