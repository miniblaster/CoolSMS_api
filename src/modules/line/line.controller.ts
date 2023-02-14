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
import { AdminGuard } from '../auth/guards/admin.guard';
import { LineService } from './line.service';
import { CreateLineDto } from './dtos/create-line.dto';
import { UpdateLineDto } from './dtos/update-line.dto';

@Controller({ path: 'lines' })
@ApiTags('Line')
export class LineController {
  constructor(private lineService: LineService) {}

  /**
   * Get all lines
   */
  @Get()
  @ApiOperation({ summary: 'Get all lines' })
  @ApiPaginationQuery()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getLines(
    @AuthUser() authUser: UserEntity,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 100,
  ) {
    const { items, meta } = await this.lineService.getLines(authUser, {
      limit: limit > 100 ? 100 : limit,
      page,
    });

    return { data: { items: instanceToPlain(items), meta } };
  }

  /**
   * Create line
   */
  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  //@UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Create line' })
  async createLine(@Body() createLineDto: CreateLineDto) {
    const line = await this.lineService.create(createLineDto);
    return { data: line };
  }

  /**
   * Get a line
   */
  @Get(':line')
  @ApiOperation({ summary: 'Get line' })
  @ApiParam({ name: 'line', description: 'line ID' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getLine(@Param('line', ParseUUIDPipe) lineId: string) {
    const line = await this.lineService.findById(lineId);
    if (!line) {
      throw new NotFoundException('Line not found by given id');
    }
    return { data: line };
  }

  /**
   * Update line
   */
  @Put(':line')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update line' })
  async updateLine(
    @Param('line', ParseUUIDPipe) lineId: string,
    @Body() updateLineDto: UpdateLineDto,
  ) {
    const line = await this.lineService.update(lineId, updateLineDto);
    return { data: line };
  }

  /**
   * Delete line
   */
  @Delete(':line')
  @ApiOperation({
    summary: 'Delete a line by id',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  //@UseGuards(AdminGuard)
  async deleteLine(@Param('line', ParseUUIDPipe) lineId: string) {
    await this.lineService.delete(lineId);
    return { message: 'Line deleted successfully' };
  }
}
