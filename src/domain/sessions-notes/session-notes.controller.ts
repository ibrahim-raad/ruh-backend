import {
  Controller,
  Body,
  Param,
  Patch,
  Get,
  BadRequestException,
  ConflictException,
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
import { SessionNotesService } from './session-notes.service';
import { SessionNotesOutput } from './dto/session-notes.output';
import { SearchSessionNotes } from './dto/search-session-notes.dto';
import { UpdateSessionNotes } from './dto/update-session-notes.dto';
import { isDefined } from 'class-validator';
import { SessionNotesMapper } from './session-notes.mapper';
import { DateRangeInput } from '../shared/dto/date-range.dto';
import { ApiNestedQuery } from '../shared/decorators/api-range-property.decorator';
import { AuditSearchInput } from '../shared/dto/audit-search.dto';
import { AuditOutput } from '../shared/dto/audit-output.dto';
import { RolesGuard } from 'src/guards/permissions.guard';
import { UserRole } from '../users/shared/user-role.enum';
import { Roles } from 'src/guards/decorators/permissions.decorator';
import { CurrentUser } from '../shared/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('SessionsNotes')
@Controller('/api/v1/sessions-notes')
@ApiExtraModels(PageOutput<SessionNotesOutput>)
@UseGuards(RolesGuard)
export class SessionNotesController {
  constructor(
    private readonly service: SessionNotesService,
    private readonly mapper: SessionNotesMapper,
  ) {}

  @Get()
  @ApiBearerAuth()
  @ApiPageResponse(SessionNotesOutput)
  @ApiException(() => [BadRequestException])
  public async list(
    @Query() criteria: SearchSessionNotes,
    @CurrentUser() user: User,
  ): Promise<PageOutput<SessionNotesOutput>> {
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
  ): Promise<PageOutput<AuditOutput<SessionNotesOutput>>> {
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
    @Body() input: UpdateSessionNotes,
    @CurrentUser() user: User,
  ): Promise<SessionNotesOutput> {
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
  ): Promise<SessionNotesOutput> {
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
  ): Promise<PageOutput<AuditOutput<SessionNotesOutput>>> {
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
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiException(() => [NotFoundException])
  public async remove(
    @Param('sessionId', ParseUUIDPipe) sessionId: string,
  ): Promise<{ message: string }> {
    await this.service.remove({ session: { id: sessionId } });
    return { message: 'SessionNotes deleted' };
  }

  @Delete('permanent/:id')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiException(() => [NotFoundException, ForbiddenException])
  async permanentDelete(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    await this.service.permanentDelete({ id });
    return { message: 'SessionNotes permanently deleted' };
  }

  @Patch('restore/:id')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiException(() => [NotFoundException, ForbiddenException])
  async restore(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SessionNotesOutput> {
    const restored = await this.service.restore({ id });
    return this.mapper.toOutput(restored);
  }
}
