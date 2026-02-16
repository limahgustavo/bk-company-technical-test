import { Type } from 'class-transformer';
import {
    ArrayMinSize,
    IsArray,
    IsEmail,
    IsNumber,
    IsString,
    Min,
    MinLength,
    ValidateNested,
} from 'class-validator';

class OrderItemDto {
    @IsString()
    @MinLength(1)
    productId!: string;

    @IsString()
    @MinLength(1)
    productName!: string;

    @IsNumber()
    @Min(1)
    quantity!: number;

    @IsNumber()
    @Min(0)
    unitPrice!: number;
}

export class CreateOrderDto {
    @IsString()
    @MinLength(1)
    buyerName!: string;

    @IsEmail()
    buyerEmail!: string;

    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items!: OrderItemDto[];
}
