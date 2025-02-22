import { Expose } from 'class-transformer';

export class UserResDto {
	@Expose()
	id: string;

	@Expose()
	name?: string;

	@Expose()
	email?: string;

	@Expose()
	avatar?: string;

	@Expose()
	phoneNumber?: string;

	@Expose()
	dateOfBirth?: Date;

	@Expose()
	groupId?: string;

	@Expose()
	isActive?: boolean;

	@Expose()
	emailVerified?: boolean;

	@Expose()
	sex?: string;

	@Expose()
	title?: string;
}
