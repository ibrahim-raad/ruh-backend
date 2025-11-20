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
  UploadedFile,
  UseFilters,
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
import { TherapistCertificateService } from './therapist-certificate.service';
import { CreateTherapistCertificate } from './dto/create-therapist-certificate.dto';
import { TherapistCertificateOutput } from './dto/therapist-certificate.output';
import { SearchTherapistCertificate } from './dto/search-therapist-certificate.dto';
import { UpdateTherapistCertificate } from './dto/update-therapist-certificate.dto';
import { isDefined } from 'class-validator';
import { TherapistCertificateMapper } from './therapist-certificate.mapper';
import { DateRangeInput } from '../shared/dto/date-range.dto';
import { ApiNestedQuery } from '../shared/decorators/api-range-property.decorator';
import { AuditSearchInput } from '../shared/dto/audit-search.dto';
import { AuditOutput } from '../shared/dto/audit-output.dto';
import { RolesGuard } from 'src/guards/permissions.guard';
import { UserRole } from '../users/shared/user-role.enum';
import { Roles } from 'src/guards/decorators/permissions.decorator';
import { CurrentUser } from '../shared/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/utils/multer-config.utils';
import { MulterExceptionFilter } from 'src/filters/multer-exception.filter';
import { TherapistCertificate } from './entities/therapist-certificate.entity';

@ApiTags('Therapists Certificates')
@Controller('/api/v1/therapists-certificates')
@ApiExtraModels(PageOutput<TherapistCertificateOutput>)
@UseGuards(RolesGuard)
export class TherapistCertificateController {
  constructor(
    private readonly service: TherapistCertificateService,
    private readonly mapper: TherapistCertificateMapper,
  ) {}

  @Post()
  @Roles(UserRole.THERAPIST)
  @ApiBearerAuth()
  @UseInterceptors(
    ClassSerializerInterceptor,
    FileInterceptor(
      'file',
      multerConfig(
        'therapists/certificates',
        '10MB',
        /\.(pdf|jpg|jpeg|png|webp)$/i,
      ),
    ),
  )
  @UseFilters(MulterExceptionFilter)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        issuer: { type: 'string' },
        issued_date: { type: 'string', format: 'date-time' },
        description: { type: 'string' },
        specialization_id: { type: 'string', format: 'uuid' },
        file: { type: 'string', format: 'binary' },
      },
      required: ['title', 'issuer', 'issued_date', 'file'],
    },
  })
  @ApiException(() => [BadRequestException, ConflictException])
  async create(
    @Body() input: CreateTherapistCertificate,
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<TherapistCertificateOutput> {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    const entity = this.mapper.toModel(input);
    entity.file_url = `/uploads/therapists/certificates/${file.filename}`;
    const created = await this.service.create({ ...entity, userId: user.id });
    return this.mapper.toOutput(created);
  }

  @Get()
  @ApiBearerAuth()
  @ApiPageResponse(TherapistCertificateOutput)
  @ApiException(() => [BadRequestException])
  public async list(
    @Query() criteria: SearchTherapistCertificate,
  ): Promise<PageOutput<TherapistCertificateOutput>> {
    const { items, total } = await this.service.find(criteria);
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
  ): Promise<PageOutput<AuditOutput<TherapistCertificateOutput>>> {
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
  @Roles(UserRole.THERAPIST)
  @ApiBearerAuth()
  @ApiException(() => [
    NotFoundException,
    BadRequestException,
    ConflictException,
  ])
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() input: UpdateTherapistCertificate,
    @CurrentUser() user: User,
  ): Promise<TherapistCertificateOutput> {
    const existing = await this.service.one({
      id,
      therapist: { user: { id: user.id } },
    });
    const entity = this.mapper.toModel(input, existing);
    const updated = await this.service.update(existing, entity);
    return this.mapper.toOutput(updated);
  }

  @Patch(':id/file')
  @Roles(UserRole.THERAPIST)
  @ApiBearerAuth()
  @UseFilters(MulterExceptionFilter)
  @UseInterceptors(
    FileInterceptor(
      'file',
      multerConfig(
        'therapists/certificates',
        '10MB',
        /\.(pdf|jpg|jpeg|png|webp)$/i,
      ),
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
  async replaceFile(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: User,
  ): Promise<TherapistCertificateOutput> {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    const updated = await this.service.replaceFile(
      { id, therapist: { user: { id: user.id } } },
      file,
    );
    return this.mapper.toOutput(updated);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiException(() => [NotFoundException])
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<TherapistCertificateOutput> {
    const found = await this.service.one({ id });
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
  ): Promise<PageOutput<AuditOutput<TherapistCertificateOutput>>> {
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
  @Roles(UserRole.THERAPIST)
  @ApiBearerAuth()
  @ApiException(() => [NotFoundException])
  public async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<{ message: string }> {
    await this.service.remove({ id, therapist: { user: { id: user.id } } });
    return { message: 'TherapistCertificate deleted' };
  }

  @Delete('permanent/:id')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiException(() => [NotFoundException])
  async permanentDelete(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    await this.service.permanentDelete({ id });
    return { message: 'TherapistCertificate permanently deleted' };
  }

  @Patch('restore/:id')
  @Roles(UserRole.THERAPIST)
  @ApiBearerAuth()
  async restore(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ): Promise<TherapistCertificateOutput> {
    const restored = await this.service.restore({
      id,
      therapist: { user: { id: user.id } },
    });
    return this.mapper.toOutput(restored);
  }
}
