import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { LineEntity } from './entities/line.entity';
import { CreateLineDto } from './dtos/create-line.dto';
import { UpdateLineDto } from './dtos/update-line.dto';
import { UserEntity } from '../user/entities/user.entity';
import { UserRoleEnum } from '../user/user.types';

@Injectable()
export class LineService {
  constructor(
    @InjectRepository(LineEntity)
    private lineRepo: Repository<LineEntity>,
  ) {}

  /**
   * Get all lines
   */
  getLines(
    authUser: UserEntity,
    options: IPaginationOptions,
  ): Promise<Pagination<LineEntity>> {
    let queryBuilder: any;
    console.log(authUser);
    if (authUser.role === UserRoleEnum.ADMIN) {
      queryBuilder = this.lineRepo
        .createQueryBuilder('lines')
        .orderBy('lines.updatedAt', 'DESC');
    } else {
      queryBuilder = this.lineRepo
        .createQueryBuilder('lines')
        .orderBy('lines.updatedAt', 'DESC');
    }

    return paginate<LineEntity>(queryBuilder, options);
  }

  /**
   * Get line by id
   */
  async findById(id: string) {
    const line = await this.lineRepo.findOne({
      where: { id },
      relations: { userLine: true },
    });
    return line;
  }

  /**
   * Get line by phone number
   */
  async findByPhoneNumber(phoneNumber: string) {
    const line = await this.lineRepo.findOne({
      where: { phoneNumber },
      relations: ['userLine', 'userLine.user'],
    });
    return line;
  }

  /**
   * Create line
   */
  async create(createLineDto: CreateLineDto) {
    return await this.lineRepo.save(
      this.lineRepo.create({
        ...createLineDto,
      }),
    );
  }

  /**
   * Update line
   */
  async update(lineId: string, updateLineDto: UpdateLineDto) {
    const line = await this.findById(lineId);
    return await this.lineRepo.save(
      this.lineRepo.create({
        ...line,
        ...updateLineDto,
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
