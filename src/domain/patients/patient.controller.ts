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
import { PatientService } from './patient.service';
import { PatientOutput } from './dto/patient.output';
import { SearchPatient } from './dto/search-patient.dto';
import { UpdatePatient } from './dto/update-patient.dto';
import { isDefined } from 'class-validator';
import { PatientMapper } from './patient.mapper';
import { DateRangeInput } from '../shared/dto/date-range.dto';
import { ApiNestedQuery } from '../shared/decorators/api-range-property.decorator';
import { AuditSearchInput } from '../shared/dto/audit-search.dto';
import { AuditOutput } from '../shared/dto/audit-output.dto';

@ApiTags('Patients')
@Controller('/api/v1/patients')
@ApiExtraModels(PageOutput<PatientOutput>)
export class PatientController {
  constructor(
    private readonly service: PatientService,
    private readonly mapper: PatientMapper,
  ) {}

  @Get()
  @ApiBearerAuth()
  @ApiPageResponse(PatientOutput)
  @ApiException(() => [BadRequestException])
  public async list(
    @Query() criteria: SearchPatient,
  ): Promise<PageOutput<PatientOutput>> {
    const data = await this.service.find(criteria);
    return {
      hasNext: data.length === criteria.limit,
      items: data.map((item) => this.mapper.toOutput(item)),
    };
  }

  @Get('history')
  @ApiBearerAuth()
  @ApiException(() => [NotFoundException])
  @ApiNestedQuery({ name: 'date', type: DateRangeInput })
  public async historyAll(
    @Query() criteria: AuditSearchInput,
  ): Promise<PageOutput<AuditOutput<PatientOutput>>> {
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
    @Body() input: UpdatePatient,
  ): Promise<PatientOutput> {
    const existing = await this.service.one({ id });
    const entity = this.mapper.toModel(input, existing);
    const updated = await this.service.update(existing, entity);
    return this.mapper.toOutput(updated);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiException(() => [NotFoundException])
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PatientOutput> {
    const found = await this.service.one({ id });
    return this.mapper.toOutput(found);
  }

  @Get(':id/history')
  @ApiBearerAuth()
  @ApiException(() => [NotFoundException])
  @ApiNestedQuery({ name: 'date', type: DateRangeInput })
  public async history(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() criteria: AuditSearchInput,
  ): Promise<PageOutput<AuditOutput<PatientOutput>>> {
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
    return { message: 'Patient deleted' };
  }

  @Delete('permanent/:id')
  @ApiBearerAuth()
  @ApiException(() => [NotFoundException])
  async permanentDelete(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    await this.service.permanentDelete({ id });
    return { message: 'Patient permanently deleted' };
  }

  @Patch('restore/:id')
  @ApiBearerAuth()
  async restore(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PatientOutput> {
    const restored = await this.service.restore({ id });
    return this.mapper.toOutput(restored);
  }
}
