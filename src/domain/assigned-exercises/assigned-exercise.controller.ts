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
import { AssignedExerciseService } from './assigned-exercise.service';
import { CreateAssignedExercise } from './dto/create-assigned-exercise.dto';
import { AssignedExerciseOutput } from './dto/assigned-exercise.output';
import { SearchAssignedExercise } from './dto/search-assigned-exercise.dto';
import { UpdateAssignedExercise } from './dto/update-assigned-exercise.dto';
import { isDefined } from 'class-validator';
import { AssignedExerciseMapper } from './assigned-exercise.mapper';
import { DateRangeInput } from '../shared/dto/date-range.dto';
import { ApiNestedQuery } from '../shared/decorators/api-range-property.decorator';
import { AuditSearchInput } from '../shared/dto/audit-search.dto';
import { AuditOutput } from '../shared/dto/audit-output.dto';
import { RolesGuard } from 'src/guards/permissions.guard';
import { UserRole } from '../users/shared/user-role.enum';
import { Roles } from 'src/guards/decorators/permissions.decorator';
import { CurrentUser } from '../shared/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('AssignedExercises')
@Controller('/api/v1/assigned-exercises/:therapyCaseId')
@ApiExtraModels(PageOutput<AssignedExerciseOutput>)
@UseGuards(RolesGuard)
export class AssignedExerciseController {
  constructor(
    private readonly service: AssignedExerciseService,
    private readonly mapper: AssignedExerciseMapper,
  ) {}

  @Post()
  @Roles(UserRole.THERAPIST)
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiException(() => [BadRequestException, ConflictException])
  async create(
    @Body() input: CreateAssignedExercise,
    @Param('therapyCaseId', ParseUUIDPipe) therapyCaseId: string,
  ): Promise<AssignedExerciseOutput> {
    const entity = this.mapper.toModel({ ...input, therapyCaseId });
    const created = await this.service.create(entity);
    return this.mapper.toOutput(created);
  }

  @Get()
  @ApiBearerAuth()
  @ApiPageResponse(AssignedExerciseOutput)
  @ApiException(() => [BadRequestException])
  public async list(
    @Query() criteria: SearchAssignedExercise,
    @Param('therapyCaseId', ParseUUIDPipe) therapyCaseId: string,
    @CurrentUser() user: User,
  ): Promise<PageOutput<AssignedExerciseOutput>> {
    const { items, total } = await this.service.find(
      criteria,
      therapyCaseId,
      user,
    );
    return {
      hasNext: items.length === criteria.limit,
      items: items.map((item) => this.mapper.toOutput(item)),
      total,
    };
  }

  @Get('history')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiException(() => [NotFoundException])
  @ApiNestedQuery({ name: 'date', type: DateRangeInput })
  public async historyAll(
    @Query() criteria: AuditSearchInput,
    @Param('therapyCaseId', ParseUUIDPipe) therapyCaseId: string,
  ): Promise<PageOutput<AuditOutput<AssignedExerciseOutput>>> {
    const { items: auditRecords, total } =
      await this.service.historyAll(criteria);

    const items = auditRecords.map((record) => ({
      ...record,
      ...(isDefined(record.data) && {
        data: this.mapper.toOutput(record.data),
      }),
    }));

    return {
      hasNext: items.length === criteria.limit,
      items,
      total,
    };
  }

  @Patch(':id')
  @Roles(UserRole.PATIENT)
  @ApiBearerAuth()
  @ApiException(() => [
    NotFoundException,
    BadRequestException,
    ConflictException,
  ])
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() input: UpdateAssignedExercise,
    @Param('therapyCaseId', ParseUUIDPipe) therapyCaseId: string,
    @CurrentUser() user: User,
  ): Promise<AssignedExerciseOutput> {
    const existing = await this.service.one({
      id,
      ...this.service.getAccessCondition(therapyCaseId, user),
    });
    const entity = this.mapper.toModel(input, existing);
    const updated = await this.service.update(existing, entity);
    return this.mapper.toOutput(updated);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiException(() => [NotFoundException])
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('therapyCaseId', ParseUUIDPipe) therapyCaseId: string,
    @CurrentUser() user: User,
  ): Promise<AssignedExerciseOutput> {
    const found = await this.service.one({
      id,
      ...this.service.getAccessCondition(therapyCaseId, user),
    });
    return this.mapper.toOutput(found);
  }

  @Get(':id/history')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiException(() => [NotFoundException])
  @ApiNestedQuery({ name: 'date', type: DateRangeInput })
  public async history(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('therapyCaseId', ParseUUIDPipe) therapyCaseId: string,
    @Query() criteria: AuditSearchInput,
  ): Promise<PageOutput<AuditOutput<AssignedExerciseOutput>>> {
    const { items: auditRecords, total } = await this.service.history({
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
      total,
    };
  }

  @Delete(':id')
  @Roles(UserRole.THERAPIST)
  @ApiBearerAuth()
  @ApiException(() => [NotFoundException])
  public async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('therapyCaseId', ParseUUIDPipe) therapyCaseId: string,
    @CurrentUser() user: User,
  ): Promise<{ message: string }> {
    await this.service.remove({
      id,
      ...this.service.getAccessCondition(therapyCaseId, user),
    });
    return { message: 'AssignedExercise deleted' };
  }

  @Delete('permanent/:id')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiException(() => [NotFoundException])
  async permanentDelete(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('therapyCaseId', ParseUUIDPipe) therapyCaseId: string,
    @CurrentUser() user: User,
  ): Promise<{ message: string }> {
    await this.service.permanentDelete({
      id,
      ...this.service.getAccessCondition(therapyCaseId, user),
    });
    return { message: 'AssignedExercise permanently deleted' };
  }

  @Patch('restore/:id')
  @Roles(UserRole.THERAPIST)
  @ApiBearerAuth()
  async restore(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('therapyCaseId', ParseUUIDPipe) therapyCaseId: string,
    @CurrentUser() user: User,
  ): Promise<AssignedExerciseOutput> {
    const restored = await this.service.restore({
      id,
      ...this.service.getAccessCondition(therapyCaseId, user),
    });
    return this.mapper.toOutput(restored);
  }
}
