import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ _id: false })
export class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId!: Types.ObjectId;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  price!: number;

  @Prop({ required: true })
  quantity!: number;
}

const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ _id: false })
export class StatusHistory {
  @Prop({ required: true })
  status!: string;

  @Prop({ required: true })
  at!: Date;
}

const StatusHistorySchema = SchemaFactory.createForClass(StatusHistory);

@Schema({ _id: false })
export class ShippingInfo {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  line1!: string;

  @Prop()
  line2?: string;

  @Prop({ required: true })
  city!: string;

  @Prop({ required: true })
  state!: string;

  @Prop({ required: true })
  postalCode!: string;

  @Prop({ required: true })
  country!: string;
}

const ShippingInfoSchema = SchemaFactory.createForClass(ShippingInfo);

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId!: Types.ObjectId;

  @Prop({ type: [OrderItemSchema], required: true })
  items!: OrderItem[];

  @Prop({ required: true })
  subtotal!: number;

  @Prop({ required: true })
  discountTotal!: number;

  @Prop({ required: true })
  shippingFee!: number;

  @Prop({ required: true })
  total!: number;

  @Prop({ required: true })
  paymentMethod!: 'STRIPE' | 'COD';

  @Prop({ default: 'PENDING' })
  paymentStatus!: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

  @Prop()
  paymentIntentId?: string;

  @Prop({ default: 'PENDING' })
  status!: 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';

  @Prop({ type: [StatusHistorySchema], default: [] })
  statusHistory!: StatusHistory[];

  @Prop({ type: ShippingInfoSchema, required: true })
  shipping!: ShippingInfo;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
OrderSchema.index({ createdAt: -1 });
