import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateProfileDto, UpdateRoleDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string) {
    return this.userModel.findOne({ email: email.toLowerCase() });
  }

  async createUser(data: Partial<User>) {
    return this.userModel.create(data);
  }

  async findById(id: string) {
    return this.userModel.findById(id).select('-passwordHash -refreshTokenHash');
  }

  async findByIdWithSecrets(id: string) {
    return this.userModel.findById(id);
  }

  async listUsers() {
    return this.userModel.find().select('-passwordHash -refreshTokenHash');
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.userModel.findByIdAndUpdate(userId, dto, { new: true });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateRole(userId: string, dto: UpdateRoleDto) {
    const user = await this.userModel.findByIdAndUpdate(userId, { role: dto.role }, { new: true });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async setBlocked(userId: string, isBlocked: boolean) {
    const user = await this.userModel.findByIdAndUpdate(userId, { isBlocked }, { new: true });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
