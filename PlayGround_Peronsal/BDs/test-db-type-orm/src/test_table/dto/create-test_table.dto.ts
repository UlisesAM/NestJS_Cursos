import {
  IsArray,
  IsBoolean,
  IsEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { IsNull } from 'typeorm';

export class CreateTestTableDto {
  @IsString()
  @MaxLength(50)
  name: string;

  @IsBoolean()
  @IsOptional()
  flag: boolean;

  @IsArray()
  list_str: string[];
}
