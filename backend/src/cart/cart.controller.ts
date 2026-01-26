import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddCartItemDto } from './dto/cart.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  getCart(@CurrentUser() user: any) {
    return this.cartService.getCart(user.sub);
  }

  @Post('add')
  add(@CurrentUser() user: any, @Body() dto: AddCartItemDto) {
    return this.cartService.addItem(user.sub, dto);
  }

  @Post('update')
  update(@CurrentUser() user: any, @Body() dto: AddCartItemDto) {
    return this.cartService.updateItem(user.sub, dto);
  }

  @Delete('remove')
  remove(@CurrentUser() user: any, @Body('productId') productId: string) {
    return this.cartService.removeItem(user.sub, productId);
  }
}