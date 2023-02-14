import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { MessageEntity } from './entities/message.entity';
import { CreateMessageDto } from './dtos/create-message.dto';
import { UpdateMessageDto } from './dtos/update-message.dto';
import { UserEntity } from '../user/entities/user.entity';
import { UserRoleEnum } from '../user/user.types';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private messageRepo: Repository<MessageEntity>,
  ) {}

  /**
   * Get all messages
   */
  getMessages(
    authUser: UserEntity,
    options: IPaginationOptions,
  ): Promise<Pagination<MessageEntity>> {
    let queryBuilder: any;
    if (authUser.role === UserRoleEnum.ADMIN) {
      queryBuilder = this.messageRepo
        .createQueryBuilder('messages')
        .orderBy('messages.updatedAt', 'DESC');
    } else {
      queryBuilder = this.messageRepo
        .createQueryBuilder('messages')
        .leftJoin('messages.user', 'user')
        .where('user.id=:userId', {
          userId: authUser.id,
        })
        .orderBy('messages.updatedAt', 'DESC');
    }

    return paginate<MessageEntity>(queryBuilder, options);
  }

  /**
   * Get message by id
   */
  async findById(id: string) {
    const message = await this.messageRepo.findOne({
      where: { id },
    });
    return message;
  }

  /**
   * Create message
   */
  async create(createMessageDto: CreateMessageDto) {
    return await this.messageRepo.save(
      this.messageRepo.create({
        ...createMessageDto,
      }),
    );
  }

  /**
   * Update message
   */
  async update(messageId: string, updateMessageDto: UpdateMessageDto) {
    const message = await this.findById(messageId);
    return await this.messageRepo.save(
      this.messageRepo.create({
        ...message,
        ...updateMessageDto,
      }),
    );
  }

  /**
   * Delete message
   */
  async delete(messageId: string) {
    // TODO: delete message users, goodData accounts
    await this.messageRepo.delete(messageId);
  }
}
