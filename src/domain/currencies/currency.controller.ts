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
import { CurrencyService } from './currency.service';
import { CreateCurrency } from './dto/create-currency.dto';
import { CurrencyOutput } from './dto/currency.output';
import { SearchCurrency } from './dto/search-currency.dto';
import { UpdateCurrency } from './dto/update-currency.dto';
import { isDefined } from 'class-validator';
import { CurrencyMapper } from './currency.mapper';
import { DateRangeInput } from '../shared/dto/date-range.dto';
import { ApiNestedQuery } from '../shared/decorators/api-range-property.decorator';
import { AuditSearchInput } from '../shared/dto/audit-search.dto';
import { AuditOutput } from '../shared/dto/audit-output.dto';
import { RolesGuard } from 'src/guards/permissions.guard';
import { Roles } from 'src/guards/decorators/permissions.decorator';
import { UserRole } from '../users/shared/user-role.enum';

@ApiTags('Currencies')
@Controller('/api/v1/currencies')
@ApiExtraModels(PageOutput<CurrencyOutput>)
@UseGuards(RolesGuard)
export class CurrencyController {
  constructor(
    private readonly service: CurrencyService,
    private readonly mapper: CurrencyMapper,
  ) {}

  @Post()
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiException(() => [BadRequestException, ConflictException])
  async create(@Body() input: CreateCurrency): Promise<CurrencyOutput> {
    const entity = this.mapper.toModel(input);
    const created = await this.service.create(entity);
    return this.mapper.toOutput(created);
  }

  @Get()
  @ApiBearerAuth()
  @ApiPageResponse(CurrencyOutput)
  @ApiException(() => [BadRequestException])
  public async list(
    @Query() criteria: SearchCurrency,
  ): Promise<PageOutput<CurrencyOutput>> {
    const { items, total } = await this.service.find(criteria);
    return {
      hasNext: items.length === criteria.limit,
      items: items.map((item) => this.mapper.toOutput(item)),
      total,
    };
  }

  @Get('history')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @ApiException(() => [NotFoundException])
  @ApiNestedQuery({ name: 'date', type: DateRangeInput })
  public async historyAll(
    @Query() criteria: AuditSearchInput,
  ): Promise<PageOutput<AuditOutput<CurrencyOutput>>> {
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
  @Roles(UserRole.ADMIN)
  @ApiException(() => [
    NotFoundException,
    BadRequestException,
    ConflictException,
  ])
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() input: UpdateCurrency,
  ): Promise<CurrencyOutput> {
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
  ): Promise<CurrencyOutput> {
    const found = await this.service.one({ id });
    return this.mapper.toOutput(found);
  }

  @Get(':id/history')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @ApiException(() => [NotFoundException])
  @ApiNestedQuery({ name: 'date', type: DateRangeInput })
  public async history(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() criteria: AuditSearchInput,
  ): Promise<PageOutput<AuditOutput<CurrencyOutput>>> {
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
  @Roles(UserRole.ADMIN)
  @ApiException(() => [NotFoundException])
  public async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    await this.service.remove({ id });
    return { message: 'Currency deleted' };
  }

  @Delete('permanent/:id')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @ApiException(() => [NotFoundException])
  async permanentDelete(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    await this.service.permanentDelete({ id });
    return { message: 'Currency permanently deleted' };
  }

  @Patch('restore/:id')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  async restore(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CurrencyOutput> {
    const restored = await this.service.restore({ id });
    return this.mapper.toOutput(restored);
  }
}
