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
  ForbiddenException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { ApiException, ApiPageResponse } from 'src/domain/shared/decorators';
import { PageOutput } from 'src/domain/shared/page.output';
import { ReflectionService } from './reflection.service';
import { CreateReflection } from './dto/create-reflection.dto';
import { ReflectionOutput } from './dto/reflection.output';
import { SearchReflection } from './dto/search-reflection.dto';
import { UpdateReflection } from './dto/update-reflection.dto';
import { isDefined } from 'class-validator';
import { ReflectionMapper } from './reflection.mapper';
import { DateRangeInput } from '../shared/dto/date-range.dto';
import { ApiNestedQuery } from '../shared/decorators/api-range-property.decorator';
import { AuditSearchInput } from '../shared/dto/audit-search.dto';
import { AuditOutput } from '../shared/dto/audit-output.dto';
import { RolesGuard } from 'src/guards/permissions.guard';
import { UserRole } from '../users/shared/user-role.enum';
import { Roles } from 'src/guards/decorators/permissions.decorator';
import { CurrentUser } from '../shared/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('Reflections')
@Controller('/api/v1/reflections')
@ApiExtraModels(PageOutput<ReflectionOutput>)
@UseGuards(RolesGuard)
export class ReflectionController {
  constructor(
    private readonly service: ReflectionService,
    private readonly mapper: ReflectionMapper,
  ) {}

  @Post()
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiException(() => [BadRequestException, ConflictException])
  async create(@Body() input: CreateReflection): Promise<ReflectionOutput> {
    const entity = this.mapper.toModel(input);
    const created = await this.service.create(entity);
    return this.mapper.toOutput(created);
  }

  @Get()
  @Roles([UserRole.PATIENT])
  @ApiBearerAuth()
  @ApiPageResponse(ReflectionOutput)
  @ApiException(() => [BadRequestException])
  public async list(
    @Query() criteria: SearchReflection,
  ): Promise<PageOutput<ReflectionOutput>> {
    const data = await this.service.find(criteria);
    return {
      hasNext: data.length === criteria.limit,
      items: data.map((item) => this.mapper.toOutput(item)),
    };
  }
  @Get('exposed')
  @Roles([UserRole.ADMIN, UserRole.THERAPIST])
  @ApiBearerAuth()
  @ApiPageResponse(ReflectionOutput)
  @ApiException(() => [BadRequestException])
  public async listExposed(
    @Query() criteria: SearchReflection,
  ): Promise<PageOutput<ReflectionOutput>> {
    const data = await this.service.find(criteria, true);
    return {
      hasNext: data.length === criteria.limit,
      items: data.map((item) => this.mapper.toOutput(item)),
    };
  }

  @Get('history')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiException(() => [NotFoundException])
  @ApiNestedQuery({ name: 'date', type: DateRangeInput })
  public async historyAll(
    @Query() criteria: AuditSearchInput,
  ): Promise<PageOutput<AuditOutput<ReflectionOutput>>> {
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
  @Roles([UserRole.PATIENT])
  @ApiBearerAuth()
  @ApiException(() => [
    NotFoundException,
    BadRequestException,
    ConflictException,
  ])
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() input: UpdateReflection,
    @CurrentUser() user?: User,
  ): Promise<ReflectionOutput> {
    const existing = await this.service.one({
      id,
      patient: { user: { id: user?.id } },
    });
    const entity = this.mapper.toModel(input, existing);
    const updated = await this.service.update(existing, entity);
    return this.mapper.toOutput(updated);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiException(() => [NotFoundException, ForbiddenException])
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user?: User,
  ): Promise<ReflectionOutput> {
    const found = await this.service.one({ id });
    if (user?.role === UserRole.PATIENT && found.patient.user.id !== user?.id) {
      throw new ForbiddenException();
    }
    if (
      (user?.role === UserRole.ADMIN || user?.role === UserRole.THERAPIST) &&
      found.is_private
    ) {
      throw new ForbiddenException();
    }
    return this.mapper.toOutput(found);
  }

  @Get(':id/history')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiException(() => [NotFoundException])
  @ApiNestedQuery({ name: 'date', type: DateRangeInput })
  public async history(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() criteria: AuditSearchInput,
  ): Promise<PageOutput<AuditOutput<ReflectionOutput>>> {
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
  @Roles([UserRole.PATIENT])
  @ApiBearerAuth()
  @ApiException(() => [NotFoundException])
  public async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user?: User,
  ): Promise<{ message: string }> {
    await this.service.remove({ id, patient: { user: { id: user?.id } } });
    return { message: 'Reflection deleted' };
  }

  @Delete('permanent/:id')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiException(() => [NotFoundException])
  async permanentDelete(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    await this.service.permanentDelete({ id });
    return { message: 'Reflection permanently deleted' };
  }

  @Patch('restore/:id')
  @ApiBearerAuth()
  async restore(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ReflectionOutput> {
    const restored = await this.service.restore({ id });
    return this.mapper.toOutput(restored);
  }
}
