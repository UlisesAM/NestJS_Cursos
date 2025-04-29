import { IsArray, IsBoolean, IsString, Max } from 'class-validator';

export class CreateTestTableDto {
  @IsString()
  @Max(50)
  name: string;

  @IsBoolean()
  flag: boolean;

  @IsArray()
  list_str: string[];
}
