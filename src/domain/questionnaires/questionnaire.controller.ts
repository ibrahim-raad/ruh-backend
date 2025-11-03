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
import { QuestionnaireService } from './questionnaire.service';
import { CreateQuestionnaire } from './dto/create-questionnaire.dto';
import { QuestionnaireOutput } from './dto/questionnaire.output';
import { SearchQuestionnaire } from './dto/search-questionnaire.dto';
import { UpdateQuestionnaire } from './dto/update-questionnaire.dto';
import { isDefined } from 'class-validator';
import { QuestionnaireMapper } from './questionnaire.mapper';
import { DateRangeInput } from '../shared/dto/date-range.dto';
import { ApiNestedQuery } from '../shared/decorators/api-range-property.decorator';
import { AuditSearchInput } from '../shared/dto/audit-search.dto';
import { AuditOutput } from '../shared/dto/audit-output.dto';
import { RolesGuard } from 'src/guards/permissions.guard';
import { Roles } from 'src/guards/decorators/permissions.decorator';
import { UserRole } from '../users/shared/user-role.enum';
import { CurrentUser } from '../shared/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('Questionnaires')
@Controller('/api/v1/questionnaires')
@ApiExtraModels(PageOutput<QuestionnaireOutput>)
@ApiBearerAuth()
@UseGuards(RolesGuard)
export class QuestionnaireController {
  constructor(
    private readonly service: QuestionnaireService,
    private readonly mapper: QuestionnaireMapper,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiException(() => [BadRequestException, ConflictException])
  async create(
    @Body() input: CreateQuestionnaire,
    @CurrentUser() user: User,
  ): Promise<QuestionnaireOutput> {
    const entity = this.mapper.toModel(input);
    const created = await this.service.create({ ...entity, created_by: user });
    return this.mapper.toOutput(created);
  }

  @Get()
  @ApiPageResponse(QuestionnaireOutput)
  @ApiException(() => [BadRequestException])
  public async list(
    @Query() criteria: SearchQuestionnaire,
  ): Promise<PageOutput<QuestionnaireOutput>> {
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
  ): Promise<PageOutput<AuditOutput<QuestionnaireOutput>>> {
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
  @Roles(UserRole.ADMIN)
  @ApiException(() => [
    NotFoundException,
    BadRequestException,
    ConflictException,
  ])
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() input: UpdateQuestionnaire,
  ): Promise<QuestionnaireOutput> {
    const existing = await this.service.one({ id });
    const entity = this.mapper.toModel(input, existing);
    const updated = await this.service.update(existing, entity);
    return this.mapper.toOutput(updated);
  }

  @Get(':id')
  @ApiException(() => [NotFoundException])
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<QuestionnaireOutput> {
    const found = await this.service.one({ id });
    return this.mapper.toOutput(found);
  }

  @Get(':id/history')
  @Roles(UserRole.ADMIN)
  @ApiException(() => [NotFoundException])
  @ApiNestedQuery({ name: 'date', type: DateRangeInput })
  public async history(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() criteria: AuditSearchInput,
  ): Promise<PageOutput<AuditOutput<QuestionnaireOutput>>> {
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
  @Roles(UserRole.ADMIN)
  @ApiException(() => [NotFoundException])
  public async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    await this.service.remove({ id });
    return { message: 'Questionnaire deleted' };
  }

  @Delete('permanent/:id')
  @Roles(UserRole.ADMIN)
  @ApiException(() => [NotFoundException])
  async permanentDelete(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    await this.service.permanentDelete({ id });
    return { message: 'Questionnaire permanently deleted' };
  }

  @Patch('restore/:id')
  @Roles(UserRole.ADMIN)
  async restore(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<QuestionnaireOutput> {
    const restored = await this.service.restore({ id });
    return this.mapper.toOutput(restored);
  }
}
