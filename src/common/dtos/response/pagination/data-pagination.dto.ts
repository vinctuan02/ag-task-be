import { Expose } from 'class-transformer';
import { MetadataDto } from './metadata.dto';

export class DataPagination<T> {
	@Expose()
	items?: T[];

	@Expose()
	metadata: MetadataDto;

	constructor(items: T[], metadata: MetadataDto) {
		this.items = items;
		this.metadata = metadata;
	}
}
