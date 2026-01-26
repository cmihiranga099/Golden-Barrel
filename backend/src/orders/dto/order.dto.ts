import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsArray()
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }[];

  @IsNumber()
  subtotal: number;

  @IsNumber()
  discountTotal: number;

  @IsNumber()
  shippingFee: number;

  @IsNumber()
  total: number;

  @IsString()
  paymentMethod: 'STRIPE' | 'COD';

  @IsOptional()
  @IsString()
  paymentIntentId?: string;

  @IsNotEmpty()
  shipping: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export class UpdateOrderStatusDto {
  @IsString()
  status: string;
}

export class MarkPaidDto {
  @IsString()
  paymentStatus: 'PAID' | 'REFUNDED' | 'FAILED';
}