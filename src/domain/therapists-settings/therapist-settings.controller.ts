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
  ParseUUIDPipe,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { ApiException, ApiPageResponse } from 'src/domain/shared/decorators';
import { PageOutput } from 'src/domain/shared/page.output';
import { TherapistSettingsService } from './therapist-settings.service';
import { TherapistSettingsOutput } from './dto/therapist-settings.output';
import { SearchTherapistSettings } from './dto/search-therapist-settings.dto';
import { UpdateTherapistSettings } from './dto/update-therapist-settings.dto';
import { isDefined } from 'class-validator';
import { TherapistSettingsMapper } from './therapist-settings.mapper';
import { DateRangeInput } from '../shared/dto/date-range.dto';
import { ApiNestedQuery } from '../shared/decorators/api-range-property.decorator';
import { AuditSearchInput } from '../shared/dto/audit-search.dto';
import { AuditOutput } from '../shared/dto/audit-output.dto';
import { RolesGuard } from 'src/guards/permissions.guard';
import { UserRole } from '../users/shared/user-role.enum';
import { Roles } from 'src/guards/decorators/permissions.decorator';
import { CurrentUser } from '../shared/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('TherapistsSettings')
@Controller('/api/v1/therapists-settings')
@ApiExtraModels(PageOutput<TherapistSettingsOutput>)
@UseGuards(RolesGuard)
export class TherapistSettingsController {
  constructor(
    private readonly service: TherapistSettingsService,
    private readonly mapper: TherapistSettingsMapper,
  ) {}

  @Get()
  @ApiBearerAuth()
  @ApiPageResponse(TherapistSettingsOutput)
  @ApiException(() => [BadRequestException])
  public async list(
    @Query() criteria: SearchTherapistSettings,
  ): Promise<PageOutput<TherapistSettingsOutput>> {
    const data = await this.service.find(criteria);
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
  ): Promise<PageOutput<AuditOutput<TherapistSettingsOutput>>> {
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

  @Patch()
  @Roles(UserRole.THERAPIST)
  @ApiBearerAuth()
  @ApiException(() => [
    NotFoundException,
    ForbiddenException,
    BadRequestException,
    ConflictException,
  ])
  async update(
    @Body() input: UpdateTherapistSettings,
    @CurrentUser() user?: User,
  ): Promise<TherapistSettingsOutput> {
    const existing = await this.service.one({
      therapist: { user: { id: user?.id } },
    });
    const entity = this.mapper.toModel(input, existing);
    const updated = await this.service.update(existing, entity);
    return this.mapper.toOutput(updated);
  }

  @Get(':therapist_id')
  @ApiBearerAuth()
  @ApiException(() => [NotFoundException])
  async findOne(
    @Param('therapist_id', ParseUUIDPipe) therapist_id: string,
  ): Promise<TherapistSettingsOutput> {
    const found = await this.service.one({ therapist: { id: therapist_id } });
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
  ): Promise<PageOutput<AuditOutput<TherapistSettingsOutput>>> {
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
}
