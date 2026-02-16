import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateProductDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  id?: string;

  @IsString()
  @MinLength(1)
  name!: string;
}

