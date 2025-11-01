import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  Get,
  BadRequestException,
  ConflictException,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
  NotFoundException,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { ApiException, ApiPageResponse } from 'src/domain/shared/decorators';
import { PageOutput } from 'src/domain/shared/page.output';
import { UserService } from './user.service';
import { CreateUser } from './dto/create-user.dto';
import { UserOutput } from './dto/user.output';
import { SearchUser } from './dto/search-user.dto';
import { UpdateUser } from './dto/update-user.dto';
import { isDefined } from 'class-validator';
import { UserMapper } from './user.mapper';
import { DateRangeInput } from '../shared/dto/date-range.dto';
import { ApiNestedQuery } from '../shared/decorators/api-range-property.decorator';
import { AuditSearchInput } from '../shared/dto/audit-search.dto';
import { AuditOutput } from '../shared/dto/audit-output.dto';

@ApiTags('Users')
@Controller('/api/v1/users')
@ApiExtraModels(PageOutput<UserOutput>)
export class UserController {
  constructor(
    private readonly service: UserService,
    private readonly mapper: UserMapper,
  ) {}

  // TODO: add admin role check
  @Post()
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiException(() => [BadRequestException, ConflictException])
  async create(@Body() input: CreateUser): Promise<UserOutput> {
    const entity = this.mapper.toModel(input);
    const created = await this.service.create(entity);
    return this.mapper.toOutput(created);
  }

  // TODO: add admin role check
  @Get()
  @ApiBearerAuth()
  @ApiPageResponse(UserOutput)
  @ApiException(() => [BadRequestException])
  public async list(
    @Query() criteria: SearchUser,
  ): Promise<PageOutput<UserOutput>> {
    const data = await this.service.find(criteria);
    return {
      hasNext: data.length === criteria.limit,
      items: data.map((item) => this.mapper.toOutput(item)),
    };
  }
  // TODO: add admin role check
  @Get('history')
  @ApiBearerAuth()
  @ApiException(() => [NotFoundException])
  @ApiNestedQuery({ name: 'date', type: DateRangeInput })
  public async historyAll(
    @Query() criteria: AuditSearchInput,
  ): Promise<PageOutput<AuditOutput<UserOutput>>> {
    const auditRecords = await this.service.historyAll(criteria);

    const items = auditRecords.map((record) => ({
      ...record,
      ...(isDefined(record.data) && {
        data: this.mapper.toOutput(record.data),
      }),
    }));

    return {
      hasNext: items.length === criteria.limit,
      items,
    };
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiException(() => [
    NotFoundException,
    BadRequestException,
    ConflictException,
  ])
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() input: UpdateUser,
  ): Promise<UserOutput> {
    const existing = await this.service.one({ id });
    const entity = this.mapper.toModel(input, existing);
    const updated = await this.service.update(existing, entity);
    return this.mapper.toOutput(updated);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiException(() => [NotFoundException])
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<UserOutput> {
    const found = await this.service.one({ id });
    return this.mapper.toOutput(found);
  }

  // TODO: add admin role check
  @Get(':id/history')
  @ApiBearerAuth()
  @ApiException(() => [NotFoundException])
  @ApiNestedQuery({ name: 'date', type: DateRangeInput })
  public async history(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() criteria: AuditSearchInput,
  ): Promise<PageOutput<AuditOutput<UserOutput>>> {
    const auditRecords = await this.service.history({
      exist: { id },
      ...criteria,
    });

    const items = auditRecords.map((record) => ({
      ...record,
      ...(isDefined(record.data) && {
        data: this.mapper.toOutput(record.data),
      }),
    }));

    return {
      hasNext: items.length === criteria.limit,
      items,
    };
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiException(() => [NotFoundException])
  public async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    await this.service.remove({ id });
    return { message: 'User deleted' };
  }

  // TODO: add admin role check
  @Delete('permanent/:id')
  @ApiBearerAuth()
  @ApiException(() => [NotFoundException])
  async permanentDelete(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    await this.service.permanentDelete({ id });
    return { message: 'User permanently deleted' };
  }

  // TODO: add admin role check
  @Patch('restore/:id')
  @ApiBearerAuth()
  async restore(@Param('id') id: string): Promise<UserOutput> {
    const restored = await this.service.restore({ id });
    return this.mapper.toOutput(restored);
  }
}
