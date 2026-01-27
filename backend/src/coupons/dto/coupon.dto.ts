import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCouponDto {
  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsString()
  type!: 'PERCENT' | 'FIXED';

  @IsNumber()
  value!: number;

  @IsNumber()
  minSpend!: number;

  @IsDateString()
  expiresAt!: string;
}

export class UpdateCouponDto extends CreateCouponDto {}
