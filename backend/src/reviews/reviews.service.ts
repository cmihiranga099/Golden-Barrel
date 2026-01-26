import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { CreateReviewDto } from './dto/review.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    private productsService: ProductsService,
  ) {}

  async list(productId: string) {
    return this.reviewModel.find({ productId }).populate('userId', 'name');
  }

  async create(userId: string, dto: CreateReviewDto) {
    const review = await this.reviewModel.create({
      userId,
      productId: dto.productId,
      rating: dto.rating,
      comment: dto.comment,
    });

    const stats = await this.reviewModel.aggregate([
      { $match: { productId: review.productId } },
      { $group: { _id: '$productId', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    if (stats[0]) {
      await this.productsService.updateRating(dto.productId, stats[0].avg, stats[0].count);
    }
    return review;
  }
}