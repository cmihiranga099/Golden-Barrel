import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {}

  async list(query: any) {
    const filter: FilterQuery<ProductDocument> = {};
    if (query.categoryId) filter.categoryId = query.categoryId;
    if (query.brandId) filter.brandId = query.brandId;
    if (query.inStock) filter.stock = { $gt: 0 };
    if (query.minPrice || query.maxPrice) {
      filter.price = {
        ...(query.minPrice ? { $gte: Number(query.minPrice) } : {}),
        ...(query.maxPrice ? { $lte: Number(query.maxPrice) } : {}),
      };
    }
    if (query.abvMin || query.abvMax) {
      filter.abv = {
        ...(query.abvMin ? { $gte: Number(query.abvMin) } : {}),
        ...(query.abvMax ? { $lte: Number(query.abvMax) } : {}),
      };
    }
    if (query.volumeMin || query.volumeMax) {
      filter.volume = {
        ...(query.volumeMin ? { $gte: Number(query.volumeMin) } : {}),
        ...(query.volumeMax ? { $lte: Number(query.volumeMax) } : {}),
      };
    }
    const sortMap: Record<string, any> = {
      newest: { createdAt: -1 },
      priceLow: { price: 1 },
      priceHigh: { price: -1 },
      rating: { ratingAverage: -1 },
      bestSelling: { ratingCount: -1 },
    };
    const sort = sortMap[query.sort] || sortMap.newest;

    const keyword = query.q ? { $text: { $search: query.q } } : {};
    return this.productModel
      .find({ ...filter, ...keyword })
      .populate('categoryId brandId')
      .sort(sort)
      .limit(Number(query.limit || 50));
  }

  async findBySlug(slug: string) {
    const product = await this.productModel.findOne({ slug }).populate('categoryId brandId');
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async create(dto: CreateProductDto) {
    return this.productModel.create(dto);
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.productModel.findByIdAndUpdate(id, dto, { new: true });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async remove(id: string) {
    const product = await this.productModel.findByIdAndDelete(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async updateRating(productId: string, ratingAverage: number, ratingCount: number) {
    await this.productModel.findByIdAndUpdate(productId, { ratingAverage, ratingCount });
  }
}