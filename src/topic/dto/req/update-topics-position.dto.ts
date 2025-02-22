import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class TopicPosition {
	@Expose()
	id: string;

	@Expose()
	order: number;
}

export class UpdateTopicsPositionDto {
	@Expose()
	@IsOptional()
	data: TopicPosition[];
}
