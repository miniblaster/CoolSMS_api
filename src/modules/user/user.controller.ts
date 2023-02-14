import {
  Controller,
  DefaultValuePipe,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Query,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { instanceToPlain } from 'class-transformer';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

import { ApiPaginationQuery } from 'src/common/decorators/api-pagination-query.decorator';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserStatusEnum } from './user.types';

/**
 * TODO: Admin guard
 */
@Controller({
  path: 'users',
})
@ApiTags('User')
export class UserController {
  constructor(private userService: UserService) {}
  /**
   * Get all users
   */
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiPaginationQuery()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  //@UseGuards(AdminGuard)
  async getUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ) {
    const { items, meta } = await this.userService.getUsers({
      limit: limit > 100 ? 100 : limit,
      page,
    });

    return { data: { items: instanceToPlain(items), meta } };
  }

  /**
   * Get user
   */
  @Get(':user')
  @ApiOperation({ summary: 'Get user' })
  @ApiParam({ name: 'user', description: 'user ID' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  //@UseGuards(AdminGuard)
  async getUser(@Param('user', ParseUUIDPipe) userId: string) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found by given id');
    }
    return { data: user };
  }

  /**
   * Invite user
   */
  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  //@UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Invite user' })
  async invite(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.register({
      ...createUserDto,
      status: UserStatusEnum.PENDING,
    });
    return { data: user };
  }

  /**
   * Update user
   */
  @Put(':user')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  //@UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Update user' })
  async updateUser(
    @Param('user', ParseUUIDPipe) userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.userService.update(userId, updateUserDto);
    return { data: user };
  }

  /**
   * Delete user
   */
  @Delete(':user')
  @ApiOperation({
    summary: 'Delete a user by id',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  //@UseGuards(AdminGuard)
  async deleteUser(@Param('user', ParseUUIDPipe) userId: string) {
    await this.userService.delete(userId);
    return { message: 'User deleted successfully' };
  }
}
