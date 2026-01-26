import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { AddCartItemDto } from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<CartDocument>) {}

  async getCart(userId: string) {
    const cart = await this.cartModel.findOne({ userId }).populate('items.productId');
    return cart || this.cartModel.create({ userId, items: [] });
  }

  async addItem(userId: string, dto: AddCartItemDto) {
    const cart = await this.getCart(userId);
    const existing = cart.items.find((item: any) => item.productId.toString() === dto.productId);
    if (existing) {
      existing.quantity += dto.quantity;
    } else {
      cart.items.push({ productId: dto.productId as any, quantity: dto.quantity } as any);
    }
    await cart.save();
    return cart;
  }

  async updateItem(userId: string, dto: AddCartItemDto) {
    const cart = await this.getCart(userId);
    const existing = cart.items.find((item: any) => item.productId.toString() === dto.productId);
    if (!existing) {
      throw new NotFoundException('Item not found');
    }
    existing.quantity = dto.quantity;
    await cart.save();
    return cart;
  }

  async removeItem(userId: string, productId: string) {
    const cart = await this.getCart(userId);
    cart.items = cart.items.filter((item: any) => item.productId.toString() !== productId);
    await cart.save();
    return cart;
  }
}