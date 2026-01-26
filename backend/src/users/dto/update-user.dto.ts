import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

export class UpdateRoleDto {
  @IsString()
  role: 'ADMIN' | 'STAFF' | 'CUSTOMER';
}