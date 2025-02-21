import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dtos/req/create-user.dto";
import { ErrorDetail, ErrorResDto } from "src/common/dtos/response/error/errors-response.dto";
import { HttpErrorMessage } from "src/common/dtos/response/error/enums/http.error.message.enum";
import { UserResDto } from "./dtos/res/user-res.dto";
import { plainToInstance } from "class-transformer";

@Injectable()
export class UsersService{
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ){}

    async createUser(
        payload: CreateUserDto
      ): Promise<UserResDto> {
        const { email } = payload;
        const errors: ErrorDetail[] = [];
      
        const user = await this.userRepository.findOne({ where: { email } });
      
        if (user) {
          errors.push(new ErrorDetail('email', 'message.emailAlreadyExists'));
        }
      
        if (errors.length > 0) {
          throw new ErrorResDto(
            HttpStatus.BAD_REQUEST, 
            'message.createUserFailed',
            HttpErrorMessage.BAD_REQUEST,
            errors
          );
        }
      
        const newUser = this.userRepository.create(payload);
        const savedUser = await this.userRepository.save(newUser);
      
        // Chuyển đổi đối tượng savedUser thành instance của UserResDto
        return plainToInstance(UserResDto, savedUser, { excludeExtraneousValues: true });
    }

    async checkExistsById (id: string): Promise<boolean>{
      return await this.userRepository.existsBy({id})
    }
}