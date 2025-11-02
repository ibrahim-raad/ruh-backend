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
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { ApiException, ApiPageResponse } from 'src/domain/shared/decorators';
import { PageOutput } from 'src/domain/shared/page.output';
import { AdminService } from './admin.service';
import { CreateAdmin } from './dto/create-admin.dto';
import { AdminOutput, AdminWithUserOutput } from './dto/admin.output';
import { SearchAdmin } from './dto/search-admin.dto';
import { UpdateAdmin } from './dto/update-admin.dto';
import { isDefined } from 'class-validator';
import { AdminMapper } from './admin.mapper';
import { DateRangeInput } from '../shared/dto/date-range.dto';
import { ApiNestedQuery } from '../shared/decorators/api-range-property.decorator';
import { AuditSearchInput } from '../shared/dto/audit-search.dto';
import { AuditOutput } from '../shared/dto/audit-output.dto';
import { CurrentUser } from '../shared/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { Roles } from 'src/guards/decorators/permissions.decorator';
import { UserRole } from '../users/shared/user-role.enum';
import { RolesGuard } from 'src/guards/permissions.guard';

@ApiTags('Admins')
@Controller('/api/v1/admins')
@UseGuards(RolesGuard)
@ApiExtraModels(PageOutput<AdminOutput>)
@ApiBearerAuth()
export class AdminController {
  constructor(
    private readonly service: AdminService,
    private readonly mapper: AdminMapper,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiException(() => [BadRequestException, ConflictException])
  async create(@Body() input: CreateAdmin): Promise<AdminOutput> {
    const entity = this.mapper.toModel(input);
    const created = await this.service.create(entity);
    return this.mapper.toOutput(created);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiPageResponse(AdminOutput)
  @ApiException(() => [BadRequestException])
  public async list(
    @Query() criteria: SearchAdmin,
  ): Promise<PageOutput<AdminOutput>> {
    const data = await this.service.find(criteria);
    return {
      hasNext: data.length === criteria.limit,
      items: data.map((item) => this.mapper.toOutput(item)),
    };
  }

  @Get('history')
  @Roles(UserRole.ADMIN)
  @ApiException(() => [NotFoundException])
  @ApiNestedQuery({ name: 'date', type: DateRangeInput })
  public async historyAll(
    @Query() criteria: AuditSearchInput,
  ): Promise<PageOutput<AuditOutput<AdminWithUserOutput>>> {
    const auditRecords = await this.service.historyAll(criteria);

    const items = auditRecords.map((record) => ({
      ...record,
      ...(isDefined(record.data) && {
        data: this.mapper.toWithUserOutput(record.data),
      }),
    }));

    return {
      hasNext: items.length === criteria.limit,
      items,
    };
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiException(() => [
    NotFoundException,
    BadRequestException,
    ConflictException,
  ])
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() input: UpdateAdmin,
  ): Promise<AdminOutput> {
    const existing = await this.service.one({ id });
    const entity = this.mapper.toModel(input, existing);
    const updated = await this.service.update(existing, entity);
    return this.mapper.toOutput(updated);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @ApiException(() => [NotFoundException])
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<AdminOutput> {
    const found = await this.service.one({ id });
    return this.mapper.toOutput(found);
  }

  @Get('me')
  @Roles(UserRole.ADMIN)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiException(() => [NotFoundException])
  async findMe(@CurrentUser() user: User): Promise<AdminOutput> {
    const found = await this.service.one({ user: { id: user.id } });
    return this.mapper.toOutput(found);
  }

  @Get(':id/history')
  @Roles(UserRole.ADMIN)
  @ApiException(() => [NotFoundException])
  @ApiNestedQuery({ name: 'date', type: DateRangeInput })
  public async history(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() criteria: AuditSearchInput,
  ): Promise<PageOutput<AuditOutput<AdminWithUserOutput>>> {
    const auditRecords = await this.service.history({
      exist: { id },
      ...criteria,
    });

    const items = auditRecords.map((record) => ({
      ...record,
      ...(isDefined(record.data) && {
        data: this.mapper.toWithUserOutput(record.data),
      }),
    }));

    return {
      hasNext: items.length === criteria.limit,
      items,
    };
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiException(() => [NotFoundException])
  public async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    await this.service.remove({ id });
    return { message: 'Admin deleted' };
  }

  @Delete('permanent/:id')
  @Roles(UserRole.ADMIN)
  @ApiException(() => [NotFoundException])
  async permanentDelete(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    await this.service.permanentDelete({ id });
    return { message: 'Admin permanently deleted' };
  }

  @Patch('restore/:id')
  @Roles(UserRole.ADMIN)
  async restore(@Param('id', ParseUUIDPipe) id: string): Promise<AdminOutput> {
    const restored = await this.service.restore({ id });
    return this.mapper.toOutput(restored);
  }
}
