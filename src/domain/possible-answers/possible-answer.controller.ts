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
import { PossibleAnswerService } from './possible-answer.service';
import { CreatePossibleAnswer } from './dto/create-possible-answer.dto';
import { PossibleAnswerOutput } from './dto/possible-answer.output';
import { SearchPossibleAnswer } from './dto/search-possible-answer.dto';
import { UpdatePossibleAnswer } from './dto/update-possible-answer.dto';
import { isDefined } from 'class-validator';
import { PossibleAnswerMapper } from './possible-answer.mapper';
import { DateRangeInput } from '../shared/dto/date-range.dto';
import { ApiNestedQuery } from '../shared/decorators/api-range-property.decorator';
import { AuditSearchInput } from '../shared/dto/audit-search.dto';
import { AuditOutput } from '../shared/dto/audit-output.dto';

@ApiTags('PossibleAnswers')
@Controller('/api/v1/possible-answers')
@ApiExtraModels(PageOutput<PossibleAnswerOutput>)
export class PossibleAnswerController {
  constructor(
    private readonly service: PossibleAnswerService,
    private readonly mapper: PossibleAnswerMapper,
  ) {}

  @Post()
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiException(() => [BadRequestException, ConflictException])
  async create(
    @Body() input: CreatePossibleAnswer,
  ): Promise<PossibleAnswerOutput> {
    const entity = this.mapper.toModel(input);
    const created = await this.service.create(entity);
    return this.mapper.toOutput(created);
  }

  @Get()
  @ApiBearerAuth()
  @ApiPageResponse(PossibleAnswerOutput)
  @ApiException(() => [BadRequestException])
  public async list(
    @Query() criteria: SearchPossibleAnswer,
  ): Promise<PageOutput<PossibleAnswerOutput>> {
    const { items, total } = await this.service.find(criteria);
    return {
      hasNext: items.length === criteria.limit,
      items: items.map((item) => this.mapper.toOutput(item)),
      total,
    };
  }

  @Get('history')
  @ApiBearerAuth()
  @ApiException(() => [NotFoundException])
  @ApiNestedQuery({ name: 'date', type: DateRangeInput })
  public async historyAll(
    @Query() criteria: AuditSearchInput,
  ): Promise<PageOutput<AuditOutput<PossibleAnswerOutput>>> {
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
  @ApiBearerAuth()
  @ApiException(() => [
    NotFoundException,
    BadRequestException,
    ConflictException,
  ])
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() input: UpdatePossibleAnswer,
  ): Promise<PossibleAnswerOutput> {
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
  ): Promise<PossibleAnswerOutput> {
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
  ): Promise<PageOutput<AuditOutput<PossibleAnswerOutput>>> {
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
  @ApiBearerAuth()
  @ApiException(() => [NotFoundException])
  public async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    await this.service.remove({ id });
    return { message: 'PossibleAnswer deleted' };
  }

  @Delete('permanent/:id')
  @ApiBearerAuth()
  @ApiException(() => [NotFoundException])
  async permanentDelete(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    await this.service.permanentDelete({ id });
    return { message: 'PossibleAnswer permanently deleted' };
  }

  @Patch('restore/:id')
  @ApiBearerAuth()
  async restore(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PossibleAnswerOutput> {
    const restored = await this.service.restore({ id });
    return this.mapper.toOutput(restored);
  }
}
