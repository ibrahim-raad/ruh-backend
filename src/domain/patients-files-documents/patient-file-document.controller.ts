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
import { PatientFileDocumentService } from './patient-file-document.service';
import { CreatePatientFileDocument } from './dto/create-patient-file-document.dto';
import { PatientFileDocumentOutput } from './dto/patient-file-document.output';
import { SearchPatientFileDocument } from './dto/search-patient-file-document.dto';
import { UpdatePatientFileDocument } from './dto/update-patient-file-document.dto';
import { isDefined } from 'class-validator';
import { PatientFileDocumentMapper } from './patient-file-document.mapper';
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

@ApiTags('PatientsFilesDocuments')
@Controller('/api/v1/patients-files-documents/:therapyCaseId')
@ApiExtraModels(PageOutput<PatientFileDocumentOutput>)
@UseGuards(RolesGuard)
export class PatientFileDocumentController {
  constructor(
    private readonly service: PatientFileDocumentService,
    private readonly mapper: PatientFileDocumentMapper,
  ) {}

  @Post()
  @Roles([UserRole.THERAPIST, UserRole.PATIENT])
  @ApiBearerAuth()
  @UseInterceptors(
    ClassSerializerInterceptor,
    FileInterceptor(
      'file',
      multerConfig(
        'patients/documents',
        '50MB',
        /\.(jpg|jpeg|png|gif|webp|avif|pdf|doc|docx|mp4|mov|webm|mkv)$/i,
      ),
    ),
  )
  @UseFilters(MulterExceptionFilter)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        description: { type: 'string' },
        type: { type: 'string', enum: ['REPORT', 'LAB_RESULT', 'OTHER'] },
        file: { type: 'string', format: 'binary' },
      },
      required: ['type', 'file'],
    },
  })
  @ApiException(() => [BadRequestException, ConflictException])
  async create(
    @Param('therapyCaseId', ParseUUIDPipe) therapyCaseId: string,
    @Body() input: CreatePatientFileDocument,
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<PatientFileDocumentOutput> {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    const entity = this.mapper.toModel({
      ...input,
      therapyCaseId,
      isUploadedByPatient: user.role === UserRole.PATIENT,
    });
    entity.file_url = `/uploads/patients/documents/${file.filename}`;
    const created = await this.service.create(entity);
    return this.mapper.toOutput(created);
  }

  @Get()
  @ApiBearerAuth()
  @ApiPageResponse(PatientFileDocumentOutput)
  @ApiException(() => [BadRequestException])
  public async list(
    @Query() criteria: SearchPatientFileDocument,
    @CurrentUser() user: User,
    @Param('therapyCaseId', ParseUUIDPipe) therapyCaseId: string,
  ): Promise<PageOutput<PatientFileDocumentOutput>> {
    const { items, total } = await this.service.find(
      criteria,
      user,
      therapyCaseId,
    );
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
  ): Promise<PageOutput<AuditOutput<PatientFileDocumentOutput>>> {
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
  @Roles([UserRole.THERAPIST, UserRole.PATIENT])
  @ApiBearerAuth()
  @ApiException(() => [
    NotFoundException,
    BadRequestException,
    ConflictException,
  ])
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() input: UpdatePatientFileDocument,
    @CurrentUser() user: User,
    @Param('therapyCaseId', ParseUUIDPipe) therapyCaseId: string,
  ): Promise<PatientFileDocumentOutput> {
    const existing = await this.service.one({
      id,
      ...this.service.accessCondition(user, therapyCaseId),
    });
    const entity = this.mapper.toModel(input, existing);
    const updated = await this.service.update(existing, entity);
    return this.mapper.toOutput(updated);
  }

  @Patch(':id/file')
  @Roles([UserRole.THERAPIST, UserRole.PATIENT])
  @ApiBearerAuth()
  @UseFilters(MulterExceptionFilter)
  @UseInterceptors(
    FileInterceptor(
      'file',
      multerConfig(
        'patients/documents',
        '50MB',
        /\.(jpg|jpeg|png|gif|webp|avif|pdf|doc|docx|mp4|mov|webm|mkv)$/i,
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
    @CurrentUser() user: User,
    @Param('therapyCaseId', ParseUUIDPipe) therapyCaseId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<PatientFileDocumentOutput> {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    const updated = await this.service.replaceFile(
      { id, ...this.service.accessCondition(user, therapyCaseId) },
      file,
    );
    return this.mapper.toOutput(updated);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiException(() => [NotFoundException])
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
    @Param('therapyCaseId', ParseUUIDPipe) therapyCaseId: string,
  ): Promise<PatientFileDocumentOutput> {
    const found = await this.service.one({
      id,
      ...this.service.accessCondition(user, therapyCaseId),
    });
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
  ): Promise<PageOutput<AuditOutput<PatientFileDocumentOutput>>> {
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
    @CurrentUser() user: User,
    @Param('therapyCaseId', ParseUUIDPipe) therapyCaseId: string,
  ): Promise<{ message: string }> {
    await this.service.remove({
      id,
      ...this.service.accessCondition(user, therapyCaseId),
    });
    return { message: 'PatientFileDocument deleted' };
  }

  @Delete('permanent/:id')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiException(() => [NotFoundException])
  async permanentDelete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
    @Param('therapyCaseId', ParseUUIDPipe) therapyCaseId: string,
  ): Promise<{ message: string }> {
    await this.service.permanentDelete({
      id,
      ...this.service.accessCondition(user, therapyCaseId),
    });
    return { message: 'PatientFileDocument permanently deleted' };
  }

  @Patch('restore/:id')
  @ApiBearerAuth()
  async restore(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
    @Param('therapyCaseId', ParseUUIDPipe) therapyCaseId: string,
  ): Promise<PatientFileDocumentOutput> {
    const restored = await this.service.restore({
      id,
      ...this.service.accessCondition(user, therapyCaseId),
    });
    return this.mapper.toOutput(restored);
  }
}
