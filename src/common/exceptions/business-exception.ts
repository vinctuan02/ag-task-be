import { BadRequestException } from '@nestjs/common';

export class BusinessException extends BadRequestException {
	constructor(errors: { key: string; message: string; keyInt?: string }[]) {
		super(errors);
	}
}
