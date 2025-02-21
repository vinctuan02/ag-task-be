import { Body, Controller, Post } from "@nestjs/common";
import { UsersService } from "./user.service";
import { CreateUserDto } from "./dtos/req/create-user.dto";
import { SuccessResDto } from "src/common/dtos/response/success/success-reponse.dto";
import { UserResDto } from "./dtos/res/user-res.dto";

@Controller('users')
export class UsersController {

    constructor(
        private readonly userService: UsersService
    ){}

    @Post()
    async createUser (
        @Body() createUserDto: CreateUserDto
    ): Promise<SuccessResDto<UserResDto>>{
        const newUser = await this.userService.createUser(createUserDto)
        return new SuccessResDto(200, 'message.createUserSuccessfully', newUser)
    }
}