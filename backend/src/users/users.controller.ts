import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto, UpdateRoleDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { RolesDecorator } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/user.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@CurrentUser() user: any) {
    return this.usersService.findById(user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateMe(@CurrentUser() user: any, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(user.sub, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator('ADMIN')
  @Get()
  listUsers() {
    return this.usersService.listUsers();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator('ADMIN')
  @Patch(':id/role')
  updateRole(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.usersService.updateRole(id, dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator('ADMIN')
  @Patch(':id/block')
  blockUser(@Param('id') id: string) {
    return this.usersService.setBlocked(id, true);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator('ADMIN')
  @Patch(':id/unblock')
  unblockUser(@Param('id') id: string) {
    return this.usersService.setBlocked(id, false);
  }
}