import { IsNumber, IsString } from 'class-validator';

export class AddCartItemDto {
  @IsString()
  productId!: string;

  @IsNumber()
  quantity!: number;
}
