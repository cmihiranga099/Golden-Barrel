import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  slug!: string;

  @IsString()
  categoryId!: string;

  @IsString()
  brandId!: string;

  @IsNumber()
  price!: number;

  @IsOptional()
  @IsNumber()
  discountPrice?: number;

  @IsNumber()
  stock!: number;

  @IsArray()
  images!: string[];

  @IsNumber()
  abv!: number;

  @IsNumber()
  volume!: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  tags?: string[];
}

export class UpdateProductDto extends CreateProductDto {}
