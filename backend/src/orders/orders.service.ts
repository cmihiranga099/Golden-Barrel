import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto, UpdateOrderStatusDto, MarkPaidDto } from './dto/order.dto';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(userId: string, dto: CreateOrderDto) {
    const statusHistory = [{ status: 'PENDING', at: new Date() }];
    const isStripePaid = dto.paymentMethod === 'STRIPE' && !!dto.paymentIntentId;
    if (isStripePaid) {
      statusHistory.push({ status: 'PROCESSING', at: new Date() } as any);
    }
    return this.orderModel.create({
      userId,
      items: dto.items,
      subtotal: dto.subtotal,
      discountTotal: dto.discountTotal,
      shippingFee: dto.shippingFee,
      total: dto.total,
      paymentMethod: dto.paymentMethod,
      paymentStatus: isStripePaid ? 'PAID' : 'PENDING',
      paymentIntentId: dto.paymentIntentId,
      status: isStripePaid ? 'PROCESSING' : 'PENDING',
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

  async markPaidByPaymentIntent(paymentIntentId: string, paymentStatus: 'PAID' | 'FAILED' | 'REFUNDED') {
    const order = await this.orderModel.findOne({ paymentIntentId });
    if (!order) {
      return null;
    }
    order.paymentStatus = paymentStatus as any;
    if (paymentStatus === 'PAID') {
      order.status = 'PROCESSING';
      order.statusHistory.push({ status: 'PROCESSING', at: new Date() } as any);
    }
    if (paymentStatus === 'REFUNDED') {
      order.status = 'REFUNDED';
      order.statusHistory.push({ status: 'REFUNDED', at: new Date() } as any);
    }
    await order.save();
    return order;
  }

  async seedSampleOrders(count = 12) {
    const customers = await this.userModel.find({ role: 'CUSTOMER' }).limit(25);
    if (!customers.length) {
      return { created: 0, reason: 'No customer users found' };
    }
    const products = await this.productModel.find().limit(50);
    if (!products.length) {
      return { created: 0, reason: 'No products found' };
    }

    const statuses = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'] as const;
    const paymentMethods = ['STRIPE', 'COD'] as const;
    const createdOrders: OrderDocument[] = [];

    for (let i = 0; i < Math.max(1, Math.min(count, 30)); i += 1) {
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const itemsCount = Math.floor(Math.random() * 3) + 1;
      const picked = Array.from({ length: itemsCount }, () => products[Math.floor(Math.random() * products.length)]);
      const items = picked.map((product) => ({
        productId: product._id,
        name: product.name,
        price: Number(product.discountPrice ?? product.price),
        quantity: Math.floor(Math.random() * 3) + 1,
      }));
      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const shippingFee = subtotal > 120 ? 0 : 12;
      const discountTotal = 0;
      const total = subtotal - discountTotal + shippingFee;
      const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const paymentStatus = status === 'PENDING' ? 'PENDING' : 'PAID';
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 30));

      const statusHistory = [{ status: 'PENDING', at: createdAt }];
      if (status !== 'PENDING') {
        statusHistory.push({ status, at: new Date(createdAt.getTime() + 1000 * 60 * 60 * 3) } as any);
      }

      const order = await this.orderModel.create({
        userId: customer._id,
        items,
        subtotal,
        discountTotal,
        shippingFee,
        total,
        paymentMethod,
        paymentStatus,
        status,
        statusHistory,
        shipping: {
          name: customer.name || 'Customer',
          line1: '123 Market Street',
          line2: '',
          city: 'San Francisco',
          state: 'CA',
          postalCode: '94105',
          country: 'US',
        },
        createdAt,
        updatedAt: createdAt,
      });
      createdOrders.push(order);
    }

    return { created: createdOrders.length };
  }
}
