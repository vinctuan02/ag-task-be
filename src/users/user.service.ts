import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { HttpErrorMessage } from 'src/common/dtos/response/error/enums/http.error.message.enum';
import {
	ErrorDetail,
	ErrorResDto,
} from 'src/common/dtos/response/error/errors-response.dto';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/req/create-user.dto';
import { UserResDto } from './dtos/res/user-res.dto';
import { User } from './entities/user.entity';
import { Message } from 'src/common/message/message';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
	) {}

	async createUser(payload: CreateUserDto): Promise<UserResDto> {
		const { email } = payload;
		const errors: ErrorDetail[] = [];

		const user = await this.userRepository.findOne({ where: { email } });

		if (user) {
			errors.push(new ErrorDetail('email', Message.emailAlreadyExists));
		}

		if (errors.length > 0) {
			throw new ErrorResDto(
				HttpStatus.BAD_REQUEST,
				Message.createUserFailed,
				HttpErrorMessage.BAD_REQUEST,
				errors,
			);
		}

		const newUser = this.userRepository.create(payload);
		const savedUser = await this.userRepository.save(newUser);

		// Chuyển đổi đối tượng savedUser thành instance của UserResDto
		return plainToInstance(UserResDto, savedUser, {
			excludeExtraneousValues: true,
		});
	}

	// async findAll(
	//   currentPage: number,
	//   pageSize: number,
	//   keyword?: string,
	// ): Promise<DataPagination<null | UserResDto[]>> {
	//   const skip = (currentPage - 1) * pageSize;
	//   const queryBuilder = this.userRepository
	//     .createQueryBuilder('user')
	//     .skip(skip)
	//     .take(pageSize);

	//   if (keyword) {
	//     queryBuilder.andWhere(
	//       new Brackets((qb) => {
	//         qb.where('user.email LIKE :keyword', {
	//           keyword: `%${keyword}%`,
	//         })
	//           .orWhere('user.phone_number LIKE :keyword', {
	//             keyword: `%${keyword}%`,
	//           })
	//           .orWhere('user.first_name LIKE :keyword', {
	//             keyword: `%${keyword}%`,
	//           })
	//           .orWhere('user.last_name LIKE :keyword', {
	//             keyword: `%${keyword}%`,
	//           });
	//       }),
	//     );
	//   }

	//   const [users, totalItems] = await queryBuilder.getManyAndCount();

	//   const totalPages = Math.ceil(totalItems / pageSize);
	//   const metadata = new MetadataDto(
	//     currentPage,
	//     pageSize,
	//     totalItems,
	//     totalPages,
	//   );
	//   const items: UserResDto[] = plainToInstance(UserResDto, users);
	//   return new DataPagination(items, metadata);
	// }

	// async findOne(id: string): Promise<SuccessResponseDto<User>> {
	//   const userById = await this.findUserById(id);
	//   if (!userById) throw new NotFoundException('User not found');
	//   return new SuccessResponseDto(
	//     200,
	//     'Get user by id oke',
	//     plainToInstance(User, userById),
	//   );
	// }

	// async findUserById(id: string): Promise<User | null> {
	//   return await this.userRepository.findOne({ where: { id } });
	// }

	// async findUserByEmail(email: string): Promise<User | null> {
	//   return await this.userRepository.findOne({
	//     where: { email },
	//     select: ['id', 'email', 'password'],
	//   });
	// }

	// async update(
	//   id: string,
	//   updateUserDto: UpdateUserDto,
	// ): Promise<SuccessResponseDto<User>> {
	//   const { email } = updateUserDto;

	//   const userById = await this.userRepository.findOne({ where: { id } });
	//   if (!userById) throw new NotFoundException('User not found');

	//   const errors: { key: string; message: string; keyInt?: string }[] = [];

	//   if (email) {
	//     const userByEmail = await this.userRepository.findOne({
	//       where: { email },
	//     });

	//     if (userByEmail && userByEmail.id !== id) {
	//       errors.push({
	//         key: 'email',
	//         message: 'Email already exists',
	//         keyInt: 'business.email.alreadyExists',
	//       });
	//     }
	//   }

	//   if (errors.length) {
	//     throw new BusinessException(errors);
	//   }

	//   Object.assign(userById, updateUserDto);

	//   const userSaved = await this.userRepository.save(userById);
	//   return new SuccessResponseDto(
	//     200,
	//     UPDATE_SUCCESS,
	//     plainToInstance(User, userSaved),
	//   );
	// }

	// async remove(id: string): Promise<SuccessResponseDto<User>> {
	//   const userById = await this.userRepository.findOne({ where: { id } });
	//   if (!userById)
	//     throw new NotFoundException(`User with ID: ${id} not found`);

	//   const userIsInactive = await this.userRepository.save({
	//     ...userById,
	//     status: false,
	//   });
	//   return new SuccessResponseDto(
	//     200,
	//     DELETE_SUCCESS,
	//     plainToInstance(User, userIsInactive),
	//   );
	// }

	async checkExistsById(id: string): Promise<boolean> {
		return await this.userRepository.existsBy({ id });
	}
}
