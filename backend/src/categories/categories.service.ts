import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category.name) private categoryModel: Model<CategoryDocument>) {}

  async list() {
    return this.categoryModel.find();
  }

  async create(dto: CreateCategoryDto) {
    return this.categoryModel.create(dto);
  }

  async remove(id: string) {
    const res = await this.categoryModel.findByIdAndDelete(id);
    if (!res) {
      throw new NotFoundException('Category not found');
    }
    return res;
  }
}