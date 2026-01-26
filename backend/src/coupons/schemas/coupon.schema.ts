import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CouponDocument = HydratedDocument<Coupon>;

@Schema({ timestamps: true })
export class Coupon {
  @Prop({ required: true, unique: true, uppercase: true })
  code!: string;

  @Prop({ required: true, enum: ['PERCENT', 'FIXED'] })
  type!: 'PERCENT' | 'FIXED';

  @Prop({ required: true })
  value!: number;

  @Prop({ required: true })
  minSpend!: number;

  @Prop({ required: true })
  expiresAt!: Date;

  @Prop({ default: true })
  isActive!: boolean;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
CouponSchema.index({ code: 1 });
