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
import { ApiPaginationQuery } from 'src/common/decorators/api-pagination-query.decorator';
import { AuthUser } from 'src/common/decorators/auth-user.decorators';
import { UserEntity } from '../user/entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dtos/create-message.dto';
import { UpdateMessageDto } from './dtos/update-message.dto';

@Controller({ path: 'messages' })
@ApiTags('Message')
export class MessageController {
  constructor(private messageService: MessageService) {}

  /**
   * Get all messages
   */
  @Get()
  @ApiOperation({ summary: 'Get all messages' })
  @ApiPaginationQuery()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getMessages(
    @AuthUser() authUser: UserEntity,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 100,
  ) {
    const { items, meta } = await this.messageService.getMessages(authUser, {
      limit: limit > 100 ? 100 : limit,
      page,
    });

    return { data: { items: instanceToPlain(items), meta } };
  }

  /**
   * Create message
   */
  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create message' })
  async createMessage(@Body() createMessageDto: CreateMessageDto) {
    const message = await this.messageService.create(createMessageDto);
    return { data: message };
  }

  /**
   * Get a message
   */
  @Get(':message')
  @ApiOperation({ summary: 'Get message' })
  @ApiParam({ name: 'message', description: 'message ID' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getMessage(@Param('message', ParseUUIDPipe) messageId: string) {
    const message = await this.messageService.findById(messageId);
    if (!message) {
      throw new NotFoundException('Message not found by given id');
    }
    return { data: message };
  }

  /**
   * Update message
   */
  @Put(':message')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update message' })
  async updateMessage(
    @Param('message', ParseUUIDPipe) messageId: string,
    @Body() updateMessageDto: UpdateMessageDto,
  ) {
    const message = await this.messageService.update(
      messageId,
      updateMessageDto,
    );
    return { data: message };
  }

  /**
   * Delete message
   */
  @Delete(':message')
  @ApiOperation({
    summary: 'Delete a message by id',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async deleteMessage(@Param('message', ParseUUIDPipe) messageId: string) {
    await this.messageService.delete(messageId);
    return { message: 'Message deleted successfully' };
  }
}
