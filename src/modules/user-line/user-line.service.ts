import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { UserLineEntity } from './entities/user-line.entity';
import { CreateUserLineDto } from './dtos/create-user-line.dto';
import { UpdateUserLineDto } from './dtos/update-user-line.dto';
import { UserRoleEnum } from '../user/user.types';
import { UserEntity } from '../user/entities/user.entity';

import { UserService } from '../user/user.service';
import { LineService } from '../line/line.service';
import { LineStatus } from '../line/line.types';

@Injectable()
export class UserLineService {
  constructor(
    @InjectRepository(UserLineEntity)
    private lineRepo: Repository<UserLineEntity>,
    private userService: UserService,
    private lineService: LineService,
  ) {}

  /**
   * Get all lines
   */
  getUserLines(
    authUser: UserEntity,
    options: IPaginationOptions,
  ): Promise<Pagination<UserLineEntity>> {
    let queryBuilder: any;
    if (authUser.role === UserRoleEnum.ADMIN) {
      queryBuilder = this.lineRepo
        .createQueryBuilder('user_lines')
        .leftJoinAndSelect('user_lines.line', 'line')
        .leftJoinAndSelect('user_lines.user', 'user')
        .orderBy('user_lines.updatedAt', 'DESC');
    } else {
      queryBuilder = this.lineRepo
        .createQueryBuilder('user_lines')
        .leftJoin('user_lines.user', 'user')
        .leftJoin('user_lines.line', 'line')
        .select(['user_lines', 'line.id', 'line.phoneNumber', 'line.status'])
        .where('user.id=:userId', {
          userId: authUser.id,
        })
        .andWhere('line.deleted = :deleted', { deleted: false })
        .andWhere('user_lines.deleted = :deleted', { deleted: false })
        .orderBy('user_lines.updatedAt', 'DESC');
    }

    return paginate<UserLineEntity>(queryBuilder, options);
  }

  /**
   * Get line by id
   */
  async findById(id: string) {
    const line = await this.lineRepo.findOne({
      where: { id },
      relations: ['line', 'user'],
    });
    return line;
  }

  /**
   * Create line
   */
  async create(createUserLineDto: CreateUserLineDto) {
    const user = await this.userService.findById(createUserLineDto.userId);
    const line = await this.lineService.findById(createUserLineDto.lineId);

    const userLine = await this.lineRepo.save(
      this.lineRepo.create({
        ...createUserLineDto,
        user,
        line,
      }),
    );

    line.userLine = userLine;
    line.status = LineStatus.ALLOCATED;
    await line.save();

    return userLine;
  }

  /**
   * Update line
   */
  async update(lineId: string, updateUserLineDto: UpdateUserLineDto) {
    const line = await this.findById(lineId);
    return await this.lineRepo.save(
      this.lineRepo.create({
        ...line,
        ...updateUserLineDto,
      }),
    );
  }

  /**
   * Delete line
   */
  async delete(lineId: string) {
    await this.lineRepo.update({ id: lineId }, { deleted: true });
  }
}
