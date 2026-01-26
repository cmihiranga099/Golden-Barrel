import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user.decorator';
import { WishlistService } from './wishlist.service';
import { WishlistItemDto } from './dto/wishlist.dto';

@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private wishlistService: WishlistService) {}

  @Get()
  get(@CurrentUser() user: any) {
    return this.wishlistService.getWishlist(user.sub);
  }

  @Post('add')
  add(@CurrentUser() user: any, @Body() dto: WishlistItemDto) {
    return this.wishlistService.addItem(user.sub, dto);
  }

  @Delete('remove')
  remove(@CurrentUser() user: any, @Body('productId') productId: string) {
    return this.wishlistService.removeItem(user.sub, productId);
  }
}