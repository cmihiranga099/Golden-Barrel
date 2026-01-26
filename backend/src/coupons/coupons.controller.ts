import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/coupon.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { RolesDecorator } from '../common/decorators/roles.decorator';

@Controller('coupons')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CouponsController {
  constructor(private couponsService: CouponsService) {}

  @RolesDecorator('ADMIN')
  @Get()
  list() {
    return this.couponsService.list();
  }

  @RolesDecorator('ADMIN')
  @Post()
  create(@Body() dto: CreateCouponDto) {
    return this.couponsService.create(dto);
  }

  @RolesDecorator('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.couponsService.remove(id);
  }
}