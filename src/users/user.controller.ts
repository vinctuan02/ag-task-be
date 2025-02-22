import { Body, Controller, Post } from '@nestjs/common';
import { SuccessResDto } from 'src/common/dtos/response/success/success-reponse.dto';
import { CreateUserDto } from './dtos/req/create-user.dto';
import { UserResDto } from './dtos/res/user-res.dto';
import { UsersService } from './user.service';

@Controller('users')
export class UsersController {
	constructor(private readonly userService: UsersService) {}

	@Post()
	async createUser(
		@Body() createUserDto: CreateUserDto,
	): Promise<SuccessResDto<UserResDto>> {
		const newUser = await this.userService.createUser(createUserDto);
		return new SuccessResDto(
			200,
			'message.createUserSuccessfully',
			newUser,
		);
	}

	// @ApiOperation({ summary: 'Get all users' })
	// @Get()
	// async findAll(
	//     @Query() query: FindAllDto,
	// ): Promise<SuccessResDto<DataPagination<User | User[]>>> {
	//     const result = this.userService.findAll(
	//         query.page ?? 1,
	//         query.pageSize ?? 10,
	//         query.keyword,
	//     );

	//     return new SuccessResDto(200, 'message.getAllUsersSucessfully', result)
	// }

	// @ApiOperation({ summary: 'Get user by id' })
	// @ApiParam({
	//     name: 'id',
	//     required: true,
	//     example: '003350b7-d00d-4ec4-86e5-e9e17cd6c21d',
	//     description: '',
	// })
	// @Get(':id')
	// findOne(@Param('id') id: string): Promise<SuccessResponseDto<User>> {
	//     return this.usersService.findOne(id);
	// }

	// @Public()
	// @ApiOperation({ summary: 'Update user by id' })
	// @ApiParam({
	//     name: 'id',
	//     required: true,
	//     example: '003350b7-d00d-4ec4-86e5-e9e17cd6c21d',
	//     description: '',
	// })
	// @Patch(':id')
	// update(
	//     @Param('id') id: string,
	//     @Body() updateUserDto: UpdateUserDto,
	// ): Promise<SuccessResponseDto<User>> {
	//     return this.usersService.update(id, updateUserDto);
	// }

	// @ApiOperation({ summary: 'Delete user by id' })
	// @ApiParam({
	//     name: 'id',
	//     required: true,
	//     example: '003350b7-d00d-4ec4-86e5-e9e17cd6c21d',
	//     description: '',
	// })
	// @Delete(':id')
	// remove(@Param('id') id: string): Promise<SuccessResponseDto<User>> {
	//     return this.usersService.remove(id);
	// }
}
