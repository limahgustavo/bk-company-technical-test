import { IsNumber, IsString, Min } from 'class-validator';

export class SetProductCostDto {
  @IsString()
  productId!: string;

  @IsNumber()
  @Min(0)
  cost!: number;
}

