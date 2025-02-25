import { Type } from "class-transformer";
import { IsDate, IsEnum, IsOptional } from "class-validator";
import { FindAllDto } from "src/common/dtos/request/find-all.dto";
import { TypeOrderProductEnum } from "src/orders/enums/type-order.enum";

export class GetAllOrdersDto extends FindAllDto {
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    deadline: Date;

    @IsOptional()
    @IsEnum(TypeOrderProductEnum)
    type: TypeOrderProductEnum; 
}