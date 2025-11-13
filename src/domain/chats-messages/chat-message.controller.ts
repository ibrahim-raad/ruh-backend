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
import { ChatMessageService } from './chat-message.service';
import { CreateChatMessage } from './dto/create-chat-message.dto';
import { ChatMessageOutput } from './dto/chat-message.output';
import { SearchChatMessage } from './dto/search-chat-message.dto';
import { UpdateChatMessage } from './dto/update-chat-message.dto';
import { isDefined } from 'class-validator';
import { ChatMessageMapper } from './chat-message.mapper';
import { DateRangeInput } from '../shared/dto/date-range.dto';
import { ApiNestedQuery } from '../shared/decorators/api-range-property.decorator';
import { AuditSearchInput } from '../shared/dto/audit-search.dto';
import { AuditOutput } from '../shared/dto/audit-output.dto';
import { RolesGuard } from 'src/guards/permissions.guard';
import { UserRole } from '../users/shared/user-role.enum';
import { Roles } from 'src/guards/decorators/permissions.decorator';
import { CurrentUser } from '../shared/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('ChatsMessages')
@Controller('/api/v1/chats-messages/:therapyCaseId')
@ApiExtraModels(PageOutput<ChatMessageOutput>)
@UseGuards(RolesGuard)
export class ChatMessageController {
  constructor(
    private readonly service: ChatMessageService,
    private readonly mapper: ChatMessageMapper,
  ) {}

  @Post()
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiException(() => [BadRequestException, ConflictException])
  async create(
    @Body() input: CreateChatMessage,
    @Param('therapyCaseId', ParseUUIDPipe) therapyCaseId: string,
  ): Promise<ChatMessageOutput> {
    const entity = this.mapper.toModel({ ...input, therapyCaseId });
    const created = await this.service.create(entity);
    return this.mapper.toOutput(created);
  }

  @Get()
  @ApiBearerAuth()
  @ApiPageResponse(ChatMessageOutput)
  @ApiException(() => [BadRequestException])
  public async list(
    @Param('therapyCaseId', ParseUUIDPipe) therapyCaseId: string,
    @Query() criteria: SearchChatMessage,
    @CurrentUser() user: User,
  ): Promise<PageOutput<ChatMessageOutput>> {
    const data = await this.service.find(criteria, therapyCaseId, user);
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
  ): Promise<PageOutput<AuditOutput<ChatMessageOutput>>> {
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
    @Param('therapyCaseId', ParseUUIDPipe) therapyCaseId: string,
    @Body() input: UpdateChatMessage,
    @CurrentUser() user: User,
  ): Promise<ChatMessageOutput> {
    const accessCondition = this.service.getAccessCondition(
      user,
      therapyCaseId,
    );
    const existing = await this.service.one({ id, ...accessCondition });
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
  ): Promise<ChatMessageOutput> {
    const accessCondition = this.service.getAccessCondition(
      user,
      therapyCaseId,
    );
    const found = await this.service.one({ id, ...accessCondition });
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
  ): Promise<PageOutput<AuditOutput<ChatMessageOutput>>> {
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
    @Param('therapyCaseId', ParseUUIDPipe) therapyCaseId: string,
    @CurrentUser() user: User,
  ): Promise<{ message: string }> {
    const accessCondition = this.service.getAccessCondition(
      user,
      therapyCaseId,
    );
    await this.service.remove({ id, ...accessCondition });
    return { message: 'ChatMessage deleted' };
  }

  @Delete('permanent/:id')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiException(() => [NotFoundException])
  async permanentDelete(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('therapyCaseId', ParseUUIDPipe) therapyCaseId: string,
  ): Promise<{ message: string }> {
    await this.service.permanentDelete({
      id,
      therapy_case: { id: therapyCaseId },
    });
    return { message: 'ChatMessage permanently deleted' };
  }

  @Patch('restore/:id')
  @ApiBearerAuth()
  async restore(
    @Param('therapyCaseId', ParseUUIDPipe) therapyCaseId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ChatMessageOutput> {
    const restored = await this.service.restore({
      id,
      therapy_case: { id: therapyCaseId },
    });
    return this.mapper.toOutput(restored);
  }
}
