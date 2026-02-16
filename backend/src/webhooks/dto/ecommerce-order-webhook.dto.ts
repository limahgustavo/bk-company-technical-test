import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsISO8601,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

class BuyerDto {
  @IsString()
  buyerName!: string;

  @IsEmail()
  buyerEmail!: string;
}

class LineItemDto {
  @IsString()
  itemId!: string;

  @IsString()
  itemName!: string;

  @IsNumber()
  @Min(1)
  qty!: number;

  @IsNumber()
  @Min(0)
  unitPrice!: number;
}

export class EcommerceOrderWebhookDto {
  @IsString()
  id!: string;

  @ValidateNested()
  @Type(() => BuyerDto)
  buyer!: BuyerDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LineItemDto)
  lineItems!: LineItemDto[];

  @IsNumber()
  @Min(0)
  totalAmount!: number;

  @IsISO8601()
  createdAt!: string;
}

