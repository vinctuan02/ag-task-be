import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class FindAllDto {
	@ApiProperty({
		example: 1,
		required: false,
		description: 'Trang hiện tại (mặc định: 1)',
	})
	@IsOptional()
	@Transform(
		({ value }) => {
			const parsed = parseInt(value, 10);
			return isNaN(parsed) || parsed < 1 ? 1 : parsed;
		},
		{ toClassOnly: true },
	)
	page?: number;

	@ApiProperty({
		example: 10,
		required: false,
		description: 'Số lượng mục trên mỗi trang (mặc định: 10)',
	})
	@IsOptional()
	@Transform(
		({ value }) => {
			const parsed = parseInt(value, 10);
			return isNaN(parsed) || parsed < 1 ? 10 : parsed;
		},
		{ toClassOnly: true },
	)
	pageSize?: number;

	@ApiProperty({
		example: '',
		required: false,
		description: 'Từ khóa tìm kiếm (tuỳ chọn)',
	})
	@IsOptional()
	keyword?: string;
}
