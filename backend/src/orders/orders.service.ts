import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto, UpdateOrderStatusDto, MarkPaidDto } from './dto/order.dto';

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>) {}

  async create(userId: string, dto: CreateOrderDto) {
    const statusHistory = [{ status: 'PENDING', at: new Date() }];
    return this.orderModel.create({
      userId,
      items: dto.items,
      subtotal: dto.subtotal,
      discountTotal: dto.discountTotal,
      shippingFee: dto.shippingFee,
      total: dto.total,
      paymentMethod: dto.paymentMethod,
      paymentStatus: dto.paymentMethod === 'COD' ? 'PENDING' : 'PENDING',
      paymentIntentId: dto.paymentIntentId,
      status: 'PENDING',
      statusHistory,
      shipping: dto.shipping,
    });
  }

  async listForUser(userId: string) {
    return this.orderModel.find({ userId }).sort({ createdAt: -1 });
  }

  async listAll() {
    return this.orderModel.find().sort({ createdAt: -1 });
  }

  async getById(orderId: string) {
    const order = await this.orderModel.findById(orderId).populate('items.productId');
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async updateStatus(orderId: string, dto: UpdateOrderStatusDto) {
    const order = await this.orderModel.findById(orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    order.status = dto.status as any;
    order.statusHistory.push({ status: dto.status, at: new Date() } as any);
    await order.save();
    return order;
  }

  async markPaid(orderId: string, dto: MarkPaidDto) {
    const order = await this.orderModel.findById(orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    order.paymentStatus = dto.paymentStatus;
    if (dto.paymentStatus === 'PAID') {
      order.status = 'PROCESSING';
      order.statusHistory.push({ status: 'PROCESSING', at: new Date() } as any);
    }
    await order.save();
    return order;
  }
}