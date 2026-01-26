import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wishlist, WishlistDocument } from './schemas/wishlist.schema';
import { WishlistItemDto } from './dto/wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(@InjectModel(Wishlist.name) private wishlistModel: Model<WishlistDocument>) {}

  async getWishlist(userId: string) {
    const wishlist = await this.wishlistModel.findOne({ userId }).populate('items.productId');
    return wishlist || this.wishlistModel.create({ userId, items: [] });
  }

  async addItem(userId: string, dto: WishlistItemDto) {
    const wishlist = await this.getWishlist(userId);
    const exists = wishlist.items.find((item: any) => item.productId.toString() === dto.productId);
    if (!exists) {
      wishlist.items.push({ productId: dto.productId as any } as any);
    }
    await wishlist.save();
    return wishlist;
  }

  async removeItem(userId: string, productId: string) {
    const wishlist = await this.getWishlist(userId);
    wishlist.items = wishlist.items.filter((item: any) => item.productId.toString() !== productId);
    await wishlist.save();
    return wishlist;
  }
}