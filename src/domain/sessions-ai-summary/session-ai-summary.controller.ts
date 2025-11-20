import {
  Controller,
  Param,
  Patch,
  Get,
  BadRequestException,
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
import { SessionAiSummaryService } from './session-ai-summary.service';
import { SessionAiSummaryOutput } from './dto/session-ai-summary.output';
import { SearchSessionAiSummary } from './dto/search-session-ai-summary.dto';
import { isDefined } from 'class-validator';
import { SessionAiSummaryMapper } from './session-ai-summary.mapper';
import { DateRangeInput } from '../shared/dto/date-range.dto';
import { ApiNestedQuery } from '../shared/decorators/api-range-property.decorator';
import { AuditSearchInput } from '../shared/dto/audit-search.dto';
import { AuditOutput } from '../shared/dto/audit-output.dto';
import { RolesGuard } from 'src/guards/permissions.guard';
import { UserRole } from '../users/shared/user-role.enum';
import { Roles } from 'src/guards/decorators/permissions.decorator';
import { CurrentUser } from '../shared/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('SessionsAiSummary')
@Controller('/api/v1/sessions-ai-summary')
@ApiExtraModels(PageOutput<SessionAiSummaryOutput>)
@UseGuards(RolesGuard)
export class SessionAiSummaryController {
  constructor(
    private readonly service: SessionAiSummaryService,
    private readonly mapper: SessionAiSummaryMapper,
  ) {}

  @Get()
  @ApiBearerAuth()
  @ApiPageResponse(SessionAiSummaryOutput)
  @ApiException(() => [BadRequestException])
  public async list(
    @Query() criteria: SearchSessionAiSummary,
    @CurrentUser() user: User,
  ): Promise<PageOutput<SessionAiSummaryOutput>> {
    const { items, total } = await this.service.find(criteria, user);
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
  ): Promise<PageOutput<AuditOutput<SessionAiSummaryOutput>>> {
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

  @Get(':sessionId')
  @ApiBearerAuth()
  @ApiException(() => [NotFoundException])
  async findOne(
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
    @CurrentUser() user: User,
  ): Promise<SessionAiSummaryOutput> {
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
  ): Promise<PageOutput<AuditOutput<SessionAiSummaryOutput>>> {
    const { items: auditRecords, total } = await this.service.history({
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
      total,
    };
  }

  @Delete(':sessionId')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiException(() => [NotFoundException])
  public async remove(
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
  ): Promise<{ message: string }> {
    await this.service.remove({ session: { id: sessionId } });
    return { message: 'Session AI Summary deleted' };
  }

  @Delete('permanent/:id')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiException(() => [NotFoundException, ForbiddenException])
  async permanentDelete(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    await this.service.permanentDelete({ id });
    return { message: 'Session AI Summary permanently deleted' };
  }

  @Patch('restore/:id')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiException(() => [NotFoundException, ForbiddenException])
  async restore(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SessionAiSummaryOutput> {
    const restored = await this.service.restore({ id });
    return this.mapper.toOutput(restored);
  }
}
