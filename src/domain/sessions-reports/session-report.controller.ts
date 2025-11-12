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
import { SessionReportService } from './session-report.service';
import { CreateSessionReport } from './dto/create-session-report.dto';
import { SessionReportOutput } from './dto/session-report.output';
import { SearchSessionReport } from './dto/search-session-report.dto';
import { UpdateSessionReport } from './dto/update-session-report.dto';
import { isDefined } from 'class-validator';
import { SessionReportMapper } from './session-report.mapper';
import { DateRangeInput } from '../shared/dto/date-range.dto';
import { ApiNestedQuery } from '../shared/decorators/api-range-property.decorator';
import { AuditSearchInput } from '../shared/dto/audit-search.dto';
import { AuditOutput } from '../shared/dto/audit-output.dto';
import { RolesGuard } from 'src/guards/permissions.guard';
import { UserRole } from '../users/shared/user-role.enum';
import { Roles } from 'src/guards/decorators/permissions.decorator';
import { CurrentUser } from '../shared/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('SessionsReports')
@Controller('/api/v1/sessions-reports')
@ApiExtraModels(PageOutput<SessionReportOutput>)
@UseGuards(RolesGuard)
export class SessionReportController {
  constructor(
    private readonly service: SessionReportService,
    private readonly mapper: SessionReportMapper,
  ) {}

  @Post()
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiException(() => [BadRequestException, ConflictException])
  async create(
    @Body() input: CreateSessionReport,
  ): Promise<SessionReportOutput> {
    const entity = this.mapper.toModel(input);
    const created = await this.service.create(entity);
    return this.mapper.toOutput(created);
  }

  @Get()
  @ApiBearerAuth()
  @ApiPageResponse(SessionReportOutput)
  @ApiException(() => [BadRequestException])
  public async list(
    @Query() criteria: SearchSessionReport,
    @CurrentUser() user: User,
  ): Promise<PageOutput<SessionReportOutput>> {
    const data = await this.service.find(criteria, user);
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
  ): Promise<PageOutput<AuditOutput<SessionReportOutput>>> {
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

  @Patch(':sessionId')
  @Roles(UserRole.THERAPIST)
  @ApiBearerAuth()
  @ApiException(() => [
    NotFoundException,
    BadRequestException,
    ConflictException,
  ])
  async update(
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
    @Body() input: UpdateSessionReport,
    @CurrentUser() user: User,
  ): Promise<SessionReportOutput> {
    const existing = await this.service.one({
      session: {
        id: sessionId,
        therapy_case: { therapist: { user: { id: user.id } } },
      },
    });
    const entity = this.mapper.toModel(input, existing);
    const updated = await this.service.update(existing, entity);
    return this.mapper.toOutput(updated);
  }

  @Get(':sessionId')
  @ApiBearerAuth()
  @ApiException(() => [NotFoundException])
  async findOne(
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
    @CurrentUser() user: User,
  ): Promise<SessionReportOutput> {
    let accessCondition = {};
    switch (user.role) {
      case UserRole.THERAPIST:
        accessCondition = {
          therapy_case: { therapist: { user: { id: user.id } } },
        };
        break;
      case UserRole.PATIENT:
        accessCondition = {
          therapy_case: { patient: { user: { id: user.id } } },
        };
        break;
      case UserRole.ADMIN:
        break;
    }
    const found = await this.service.one({
      session: { id: sessionId, ...accessCondition },
    });
    return this.mapper.toOutput(found);
  }

  @Get(':sessionId/history')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiException(() => [NotFoundException])
  @ApiNestedQuery({ name: 'date', type: DateRangeInput })
  public async history(
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
    @Query() criteria: AuditSearchInput,
  ): Promise<PageOutput<AuditOutput<SessionReportOutput>>> {
    const auditRecords = await this.service.history({
      exist: { session: { id: sessionId } },
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

  @Delete(':sessionId')
  @Roles(UserRole.THERAPIST)
  @ApiBearerAuth()
  @ApiException(() => [NotFoundException])
  public async remove(
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
    @CurrentUser() user: User,
  ): Promise<{ message: string }> {
    await this.service.remove({
      session: {
        id: sessionId,
        therapy_case: { therapist: { user: { id: user.id } } },
      },
    });
    return { message: 'SessionReport deleted' };
  }

  @Delete('permanent/:sessionId')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiException(() => [NotFoundException])
  async permanentDelete(
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
  ): Promise<{ message: string }> {
    await this.service.permanentDelete({ session: { id: sessionId } });
    return { message: 'SessionReport permanently deleted' };
  }

  @Patch('restore/:sessionId')
  @Roles([UserRole.THERAPIST, UserRole.PATIENT])
  @ApiBearerAuth()
  async restore(
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
    @CurrentUser() user: User,
  ): Promise<SessionReportOutput> {
    const restored = await this.service.restore({
      session: { id: sessionId },
      ...(user.role === UserRole.THERAPIST && {
        therapy_case: { therapist: { user: { id: user.id } } },
      }),
    });
    return this.mapper.toOutput(restored);
  }
}
