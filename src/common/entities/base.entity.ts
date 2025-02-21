import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
	@CreateDateColumn({ name: 'date_created' })
	dateCreated: Date;

	@UpdateDateColumn({ name: 'date_updated' })
	dateUpdated: Date;
}
