import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type WishlistDocument = HydratedDocument<Wishlist>;

@Schema({ _id: false })
export class WishlistItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId!: Types.ObjectId;
}

const WishlistItemSchema = SchemaFactory.createForClass(WishlistItem);

@Schema({ timestamps: true })
export class Wishlist {
  @Prop({ type: Types.ObjectId, ref: 'User', unique: true, required: true })
  userId!: Types.ObjectId;

  @Prop({ type: [WishlistItemSchema], default: [] })
  items!: WishlistItem[];
}

export const WishlistSchema = SchemaFactory.createForClass(Wishlist);
WishlistSchema.index({ userId: 1 });
