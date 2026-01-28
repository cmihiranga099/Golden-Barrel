import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto, MarkPaidDto } from './dto/order.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { RolesDecorator } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/user.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(user.sub, dto);
  }

  @Get('me')
  listForUser(@CurrentUser() user: any) {
    return this.ordersService.listForUser(user.sub);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.ordersService.getById(id);
  }

  @UseGuards(RolesGuard)
  @RolesDecorator('ADMIN', 'STAFF')
  @Get()
  listAll() {
    return this.ordersService.listAll();
  }

  @UseGuards(RolesGuard)
  @RolesDecorator('ADMIN', 'STAFF')
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto);
  }

  @UseGuards(RolesGuard)
  @RolesDecorator('ADMIN', 'STAFF')
  @Patch(':id/paid')
  markPaid(@Param('id') id: string, @Body() dto: MarkPaidDto) {
    return this.ordersService.markPaid(id, dto);
  }

  @UseGuards(RolesGuard)
  @RolesDecorator('ADMIN', 'STAFF')
  @Post('seed')
  seedSample(@Body('count') count?: number) {
    return this.ordersService.seedSampleOrders(typeof count === 'number' ? count : 12);
  }
}
