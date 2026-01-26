import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/brand.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { RolesDecorator } from '../common/decorators/roles.decorator';

@Controller('brands')
export class BrandsController {
  constructor(private brandsService: BrandsService) {}

  @Get()
  list() {
    return this.brandsService.list();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator('ADMIN', 'STAFF')
  @Post()
  create(@Body() dto: CreateBrandDto) {
    return this.brandsService.create(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator('ADMIN', 'STAFF')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.brandsService.remove(id);
  }
}