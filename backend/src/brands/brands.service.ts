import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Brand, BrandDocument } from './schemas/brand.schema';
import { CreateBrandDto } from './dto/brand.dto';

@Injectable()
export class BrandsService {
  constructor(@InjectModel(Brand.name) private brandModel: Model<BrandDocument>) {}

  async list() {
    return this.brandModel.find();
  }

  async create(dto: CreateBrandDto) {
    return this.brandModel.create(dto);
  }

  async remove(id: string) {
    const res = await this.brandModel.findByIdAndDelete(id);
    if (!res) {
      throw new NotFoundException('Brand not found');
    }
    return res;
  }
}