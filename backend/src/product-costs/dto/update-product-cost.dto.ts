import { IsNumber, Min } from 'class-validator';

export class UpdateProductCostDto {
  @IsNumber()
  @Min(0)
  cost!: number;
}

