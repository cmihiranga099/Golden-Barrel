import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Coupon, CouponDocument } from './schemas/coupon.schema';
import { CreateCouponDto, UpdateCouponDto } from './dto/coupon.dto';

@Injectable()
export class CouponsService {
  constructor(@InjectModel(Coupon.name) private couponModel: Model<CouponDocument>) {}

  async list() {
    return this.couponModel.find();
  }

  async create(dto: CreateCouponDto) {
    return this.couponModel.create({
      ...dto,
      code: dto.code.toUpperCase(),
      expiresAt: new Date(dto.expiresAt),
    });
  }

  async update(id: string, dto: UpdateCouponDto) {
    const res = await this.couponModel.findByIdAndUpdate(
      id,
      {
        ...dto,
        code: dto.code.toUpperCase(),
        expiresAt: new Date(dto.expiresAt),
      },
      { new: true },
    );
    if (!res) {
      throw new NotFoundException('Coupon not found');
    }
    return res;
  }

  async remove(id: string) {
    const coupon = await this.couponModel.findByIdAndDelete(id);
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }
    return coupon;
  }
}
