import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto';
import { hashPassword, comparePassword } from '../common/utils/password';
import { v4 as uuidv4 } from 'uuid';

const passwordResetTokens = new Map<string, { userId: string; expiresAt: number }>();

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  private async signTokens(user: any) {
    const payload = { sub: user.id, role: user.role, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d',
    });
    return { accessToken, refreshToken };
  }

  private isOfLegalAge(dob: string) {
    const legalAge = Number(process.env.LEGAL_DRINKING_AGE || 21);
    const birth = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    const adjustedAge = m < 0 || (m === 0 && today.getDate() < birth.getDate()) ? age - 1 : age;
    return adjustedAge >= legalAge;
  }

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new BadRequestException('Email already registered');
    }
    if (!this.isOfLegalAge(dto.dob)) {
      throw new BadRequestException('Must be of legal drinking age');
    }
    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 12);
    const passwordHash = await hashPassword(dto.password, saltRounds);
    const user = await this.usersService.createUser({
      email: dto.email,
      passwordHash,
      name: dto.name,
      dob: new Date(dto.dob),
      isAgeVerified: true,
      role: 'CUSTOMER',
    });
    const tokens = await this.signTokens(user);
    const refreshHash = await hashPassword(tokens.refreshToken, saltRounds);
    user.refreshTokenHash = refreshHash;
    await user.save();
    return { userId: user.id, ...tokens };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (user.isBlocked) {
      throw new UnauthorizedException('Account is blocked');
    }
    const match = await comparePassword(dto.password, user.passwordHash);
    if (!match) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const tokens = await this.signTokens(user);
    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 12);
    user.refreshTokenHash = await hashPassword(tokens.refreshToken, saltRounds);
    await user.save();
    return { userId: user.id, ...tokens };
  }

  async refresh(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedException('Access denied');
    }
    const valid = await comparePassword(refreshToken, user.refreshTokenHash);
    if (!valid) {
      throw new UnauthorizedException('Access denied');
    }
    const tokens = await this.signTokens(user);
    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 12);
    user.refreshTokenHash = await hashPassword(tokens.refreshToken, saltRounds);
    await user.save();
    return tokens;
  }

  async logout(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      return { success: true };
    }
    user.refreshTokenHash = undefined;
    await user.save();
    return { success: true };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      return { success: true };
    }
    const token = uuidv4();
    const expiresAt = Date.now() + 1000 * 60 * 30;
    passwordResetTokens.set(token, { userId: user.id, expiresAt });
    return { token };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const record = passwordResetTokens.get(dto.token);
    if (!record || record.expiresAt < Date.now()) {
      throw new BadRequestException('Invalid or expired token');
    }
    const user = await this.usersService.findById(record.userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 12);
    user.passwordHash = await hashPassword(dto.newPassword, saltRounds);
    user.refreshTokenHash = undefined;
    await user.save();
    passwordResetTokens.delete(dto.token);
    return { success: true };
  }
}
