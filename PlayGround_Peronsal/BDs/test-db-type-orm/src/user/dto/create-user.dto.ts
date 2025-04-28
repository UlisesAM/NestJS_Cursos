import { IsEmail, IsNotEmpty, IsNumber, IsString, Max } from 'class-validator';
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  uidName: string;

  @IsString()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  rolId: number;
}
