import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsOptional, IsEnum, IsDateString, IsNumber, IsISO8601, IsDate } from 'class-validator';
import { OrderStatus } from 'src/orders/enums/status-order.enum';
import { TypeOrder } from 'src/orders/enums/type-order.enum';
import * as dayjs from 'dayjs';


export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  illustrative_image_id?: string;

  @IsOptional()
  @IsString()
  note?: string;

  @Type(() => Date)
  @IsDate()
  deadline: Date;

  // @IsNotEmpty()
  // @IsString()
  // userCreatorId: string;

  // Nếu không cung cấp status, bạn có thể để mặc định tại service
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsNotEmpty()
  @IsEnum(TypeOrder)
  type: TypeOrder;

  @IsNotEmpty()
  @IsString()
  topicId: string;
}
