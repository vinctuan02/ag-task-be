import { 
  IsEmail, 
  IsOptional, 
  IsString, 
  IsBoolean, 
  IsDateString, 
  IsNotEmpty 
} from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsString({ message: 'message.nameShouldBeString' })
  name?: string;

  @IsEmail({}, { message: 'message.emailIsNotEmail' })
  @IsNotEmpty({ message: 'message.emailIsEmpty' })
  email: string;

  @IsOptional()
  @IsString({ message: 'message.avatarShouldBeString' })
  avatar?: string;

  @IsOptional()
  @IsString({ message: 'message.phoneNumberShouldBeString' })
  phoneNumber?: string;

  @IsOptional()
  @IsDateString({}, { message: 'message.dateOfBirthIsNotDate' })
  dateOfBirth?: string;

  @IsOptional()
  @IsString({ message: 'message.groupIdShouldBeString' })
  groupId?: string;

  @IsOptional()
  @IsBoolean({ message: 'message.isActiveShouldBeBoolean' })
  isActive?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'message.emailVerifiedShouldBeBoolean' })
  emailVerified?: boolean;

  @IsOptional()
  @IsString({ message: 'message.accountTypeShouldBeString' })
  accountType?: string;

  @IsOptional()
  @IsString({ message: 'message.sexShouldBeString' })
  sex?: string;

  @IsOptional()
  @IsString({ message: 'message.titleShouldBeString' })
  title?: string;

  @IsOptional()
  @IsString({ message: 'message.titleEnShouldBeString' })
  titleEn?: string;

  @IsOptional()
  @IsString({ message: 'message.permanentResidenceShouldBeString' })
  permanentResidence?: string;

  @IsOptional()
  @IsString({ message: 'message.permanentResidenceEnShouldBeString' })
  permanentResidenceEn?: string;

  @IsOptional()
  @IsString({ message: 'message.currentAddressShouldBeString' })
  currentAddress?: string;

  @IsOptional()
  @IsString({ message: 'message.currentAddressEnShouldBeString' })
  currentAddressEn?: string;

  @IsOptional()
  @IsString({ message: 'message.taxNumberShouldBeString' })
  taxNumber?: string;

  @IsOptional()
  @IsString({ message: 'message.passportNoShouldBeString' })
  passportNo?: string;

  @IsOptional()
  @IsString({ message: 'message.passportPlaceOfIssueShouldBeString' })
  passportPlaceOfIssue?: string;

  @IsOptional()
  @IsString({ message: 'message.passportPlaceOfIssueEnShouldBeString' })
  passportPlaceOfIssueEn?: string;

  @IsOptional()
  @IsString({ message: 'message.idNumberShouldBeString' })
  idNumber?: string;

  @IsOptional()
  @IsString({ message: 'message.idPlaceOfIssueShouldBeString' })
  idPlaceOfIssue?: string;

  @IsOptional()
  @IsString({ message: 'message.idPlaceOfIssueEnShouldBeString' })
  idPlaceOfIssueEn?: string;

  @IsOptional()
  @IsDateString({}, { message: 'message.idDateOfIssueIsNotDate' })
  idDateOfIssue?: string;

  @IsOptional()
  @IsDateString({}, { message: 'message.contractSignedDateIsNotDate' })
  contractSignedDate?: string;

  @IsOptional()
  @IsString({ message: 'message.contractNumberShouldBeString' })
  contractNumber?: string;

  @IsOptional()
  @IsString({ message: 'message.groupShouldBeString' })
  group?: string;
}
