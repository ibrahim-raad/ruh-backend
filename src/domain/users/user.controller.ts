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
  UseInterceptors,
  UploadedFile,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiTags,
} from '@nestjs/swagger';
import { ApiException, ApiPageResponse } from 'src/domain/shared/decorators';
import { PageOutput } from 'src/domain/shared/page.output';
import { UserService } from './user.service';

import { UserOutput } from './dto/user.output';
import { SearchUser } from './dto/search-user.dto';
import { UpdateUser } from './dto/update-user.dto';
import { isDefined } from 'class-validator';
import { UserMapper } from './user.mapper';
import { DateRangeInput } from '../shared/dto/date-range.dto';
import { ApiNestedQuery } from '../shared/decorators/api-range-property.decorator';
import { AuditSearchInput } from '../shared/dto/audit-search.dto';
import { AuditOutput } from '../shared/dto/audit-output.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/utils/multer-config.utils';
import { MulterExceptionFilter } from 'src/filters/multer-exception.filter';
import { RolesGuard } from 'src/guards/permissions.guard';
import { UserRole } from './shared/user-role.enum';
import { Roles } from 'src/guards/decorators/permissions.decorator';
import { CurrentUser } from '../shared/decorators/current-user.decorator';
import { User } from './entities/user.entity';

@ApiTags('Users')
@Controller('/api/v1/users')
@UseGuards(RolesGuard)
@ApiExtraModels(PageOutput<UserOutput>)
export class UserController {
  constructor(
    private readonly service: UserService,
    private readonly mapper: UserMapper,
  ) {}

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiPageResponse(UserOutput)
  @ApiException(() => [BadRequestException])
  public async list(
    @Query() criteria: SearchUser,
  ): Promise<PageOutput<UserOutput>> {
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
  ): Promise<PageOutput<AuditOutput<UserOutput>>> {
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
    @Body() input: UpdateUser,
  ): Promise<UserOutput> {
    const existing = await this.service.one({ id });
    const entity = this.mapper.toModel(input, existing);
    const updated = await this.service.update(existing, entity);
    return this.mapper.toOutput(updated);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiException(() => [NotFoundException])
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<UserOutput> {
    const found = await this.service.one({ id });
    return this.mapper.toOutput(found);
  }

  @Get(':id/history')
  @Roles([UserRole.ADMIN])
  @ApiBearerAuth()
  @ApiException(() => [NotFoundException])
  @ApiNestedQuery({ name: 'date', type: DateRangeInput })
  public async history(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() criteria: AuditSearchInput,
  ): Promise<PageOutput<AuditOutput<UserOutput>>> {
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
    return { message: 'User deleted' };
  }

  @Delete('permanent/:id')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiException(() => [NotFoundException])
  async permanentDelete(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    await this.service.permanentDelete({ id });
    return { message: 'User permanently deleted' };
  }

  @Patch('restore/:id')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  async restore(@Param('id', ParseUUIDPipe) id: string): Promise<UserOutput> {
    const restored = await this.service.restore({ id });
    return this.mapper.toOutput(restored);
  }

  @Patch('me/profile-image')
  @ApiBearerAuth()
  @UseFilters(MulterExceptionFilter)
  @UseInterceptors(
    FileInterceptor(
      'file',
      multerConfig('profile-images', '5MB', /\.(jpg|jpeg|png|gif|avif|webp)$/i),
    ),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
      required: ['file'],
    },
  })
  @ApiException(() => [NotFoundException, BadRequestException])
  async uploadMyProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: User,
  ): Promise<UserOutput> {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    const updated = await this.service.setProfileImage(
      {
        id: user.id,
      },
      file,
    );
    return this.mapper.toOutput(updated);
  }

  @Patch(':id/profile-image')
  @Roles([UserRole.ADMIN])
  @ApiBearerAuth()
  @UseFilters(MulterExceptionFilter)
  @UseInterceptors(
    FileInterceptor(
      'file',
      multerConfig('profile-images', '5MB', /\.(jpg|jpeg|png|gif|avif|webp)$/i),
    ),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
      required: ['file'],
    },
  })
  @ApiException(() => [NotFoundException, BadRequestException])
  async uploadProfileImage(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UserOutput> {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    const updated = await this.service.setProfileImage(
      {
        id,
      },
      file,
    );
    return this.mapper.toOutput(updated);
  }

  @Delete(':id/profile-image')
  @Roles([UserRole.ADMIN])
  @ApiBearerAuth()
  @ApiException(() => [NotFoundException])
  async deleteProfileImage(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserOutput> {
    const updated = await this.service.deleteProfileImage({
      id,
    });
    return this.mapper.toOutput(updated);
  }

  @Delete('me/profile-image')
  @ApiBearerAuth()
  @ApiException(() => [NotFoundException])
  async deleteMyProfileImage(@CurrentUser() user: User): Promise<UserOutput> {
    const updated = await this.service.deleteProfileImage({
      id: user.id,
    });
    return this.mapper.toOutput(updated);
  }
}
