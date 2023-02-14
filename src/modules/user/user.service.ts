import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

import { UserEntity } from './entities/user.entity';
import { UserRoleEnum } from './user.types';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {}

  /**
   * Get all users
   */
  getUsers(options: IPaginationOptions): Promise<Pagination<UserEntity>> {
    const queryBuilder = this.userRepo
      .createQueryBuilder('user')
      .orderBy('user.id', 'DESC');

    return paginate<UserEntity>(queryBuilder, options);
  }

  /**
   * Get admins
   */
  async getAdmins() {
    return await this.userRepo.findBy({ role: UserRoleEnum.ADMIN });
  }

  /**
   * Get by id
   */
  async findById(id: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    return user;
  }

  /**
   * Get by email
   */
  async findByEmail(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    return user;
  }

  /**
   * Register user
   */
  async register(data: DeepPartial<UserEntity>) {
    const newUser = await this.userRepo.save(
      // save user repo to execute decorator hooks
      this.userRepo.create({
        ...data,
      }),
    );

    const user = await this.findById(newUser.id);
    return user;
  }

  /**
   * Update user
   */
  async update(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.findById(userId);

    const toSaveUser = this.userRepo.create({
      ...updateUserDto,
    });

    await this.userRepo.update({ id: userId }, toSaveUser);
    const upUser = await this.findById(userId);
    return upUser;
  }

  /**
   * Delete user
   */
  async delete(userId: string) {
    const user = await this.findById(userId);

    if (user.role === UserRoleEnum.ADMIN) {
      throw new ForbiddenException('Forbidden!');
    }

    await this.userRepo.update({ id: userId }, { deleted: true });
  }
}
