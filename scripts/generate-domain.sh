#!/usr/bin/env bash

set -euo pipefail

# Usage
#   bash scripts/generate-domain.sh <singular-name> [plural-name]
# Example
#   bash scripts/generate-domain.sh country
#   bash scripts/generate-domain.sh category categories

if [ "${1-}" = "" ]; then
  echo "Usage: $0 <singular-name> [plural-name]"
  exit 1
fi

SINGULAR_RAW="$1"
PLURAL_RAW="${2-}"

to_pascal() {
  local input="$1"
  echo "$input" \
    | sed -E 's/([a-z0-9])([A-Z])/\1 \2/g; s/[_-]/ /g' \
    | awk '{for(i=1;i<=NF;i++){ $i=toupper(substr($i,1,1)) substr($i,2) }}1' \
    | tr -d ' '
}

to_lower() {
  echo "$1" | tr '[:upper:]' '[:lower:]'
}

singular="$(to_lower "$SINGULAR_RAW")"

if [ -n "$PLURAL_RAW" ]; then
  plural="$(to_lower "$PLURAL_RAW")"
else
  # naive pluralization: if ends with consonant + y => ies, else add s
  if [[ "$singular" =~ [^aeiou]y$ ]]; then
    plural="${singular%y}ies"
  else
    plural="${singular}s"
  fi
fi

SingularPascal="$(to_pascal "$singular")"
PluralPascal="$(to_pascal "$plural")"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

DOMAIN_DIR="$REPO_ROOT/src/domain/$plural"
DTO_DIR="$DOMAIN_DIR/dto"
ENTITIES_DIR="$DOMAIN_DIR/entities"
SHARED_DIR="$DOMAIN_DIR/shared"

if [ -d "$DOMAIN_DIR" ]; then
  echo "Error: $DOMAIN_DIR already exists. Aborting to avoid overwriting."
  exit 1
fi

mkdir -p "$DTO_DIR" "$ENTITIES_DIR" "$SHARED_DIR"

# ---------- DTOs ----------
cat > "$DTO_DIR/create-${singular}.dto.ts" <<EOF
import { IsNotEmpty, IsString } from 'class-validator';

export class Create${SingularPascal} {
  @IsNotEmpty()
  @IsString()
  readonly name: string;
}
EOF

cat > "$DTO_DIR/search-${singular}.dto.ts" <<EOF
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Pageable } from 'src/domain/shared/pageable.interface';
import { DEFAULT_PAGE_SIZE } from 'src/app.constants';
import { IsBooleanish } from 'src/domain/shared/decorators';

export class Search${SingularPascal} implements Pageable {
  @IsOptional()
  @IsNumber()
  @Min(0)
  readonly offset: number = 0;

  @IsOptional()
  @IsNumber()
  @Max(DEFAULT_PAGE_SIZE)
  readonly limit: number = DEFAULT_PAGE_SIZE;

  @IsOptional()
  @IsString()
  readonly sort: string = 'name ASC';

  @IsOptional()
  @IsBooleanish()
  readonly deleted_at?: boolean = false;

  @IsOptional()
  @IsString()
  readonly name?: string;
}
EOF

cat > "$DTO_DIR/update-${singular}.dto.ts" <<EOF
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class Update${SingularPascal} {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsNotEmpty()
  @IsNumber()
  readonly version: number;
}
EOF

cat > "$DTO_DIR/${singular}.output.ts" <<EOF
import { AuditableOutput } from 'src/domain/shared/auditable.output';

export class ${SingularPascal}Output extends AuditableOutput {
  readonly name: string;
}
EOF

# ---------- Entities ----------
cat > "$ENTITIES_DIR/${singular}.entity.ts" <<EOF
import { IsNotEmpty, IsString } from 'class-validator';
import { AbstractEntity } from 'src/domain/shared/abstract.entity';
import { Column, Entity, Index } from 'typeorm';

@Entity('${plural}')
@Index(['name'])
export class ${SingularPascal} extends AbstractEntity {
  @IsNotEmpty()
  @IsString()
  @Column({ nullable: false, length: 255, unique: true })
  name: string;
}
EOF

cat > "$ENTITIES_DIR/${singular}.entity.audit.ts" <<EOF
import { Entity, Index } from 'typeorm';
import { AuditEntity } from 'src/domain/shared/audit.entity';
import { ${SingularPascal} } from './${singular}.entity';

@Entity({ name: '${plural}_audit' })
@Index(['id'])
@Index(['id', 'version'])
@Index(['id', 'version', 'event'])
export class ${SingularPascal}Audit extends AuditEntity<${SingularPascal}> {}
EOF

cat > "$ENTITIES_DIR/${singular}.entity.subscriber.ts" <<EOF
import { DataSource, EventSubscriber } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { ${SingularPascal} } from './${singular}.entity';
import { ${SingularPascal}Audit } from './${singular}.entity.audit';
import { CrudSubscriber } from 'src/domain/shared/abstract-crud.entity.subscriber';
import { ${SingularPascal}AuditTopic } from '../shared/${singular}-topic.enum';

@Injectable()
@EventSubscriber()
export class ${SingularPascal}Subscriber extends CrudSubscriber<${SingularPascal}, ${SingularPascal}Audit> {
  constructor(
    clsService: ClsService,
    eventEmitter: EventEmitter2,
    dataSource: DataSource,
  ) {
    super(
      ${SingularPascal},
      ${SingularPascal}Audit,
      ${SingularPascal}AuditTopic,
      clsService,
      eventEmitter,
      dataSource,
    );
  }
}
EOF

# ---------- Shared ----------
cat > "$SHARED_DIR/${singular}-topic.enum.ts" <<EOF
import { AuditEvent } from 'src/domain/shared/audit-event.enum';

export enum ${SingularPascal}Topic {
  CREATED = '${singular}.created',
  UPDATED = '${singular}.updated',
  REMOVED = '${singular}.removed',
}

export const ${SingularPascal}AuditTopic: Record<AuditEvent, ${SingularPascal}Topic> = {
  [AuditEvent.CREATED]: ${SingularPascal}Topic.CREATED,
  [AuditEvent.UPDATED]: ${SingularPascal}Topic.UPDATED,
  [AuditEvent.REMOVED]: ${SingularPascal}Topic.REMOVED,
};
EOF

# ---------- Service ----------
cat > "$DOMAIN_DIR/${singular}.service.ts" <<EOF
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, IsNull, Not, Repository } from 'typeorm';
import { CrudService } from 'src/domain/shared/abstract-crud.service';
import { isDefined } from 'class-validator';
import { ${SingularPascal} } from './entities/${singular}.entity';
import { Search${SingularPascal} } from './dto/search-${singular}.dto';
import { ${SingularPascal}Audit } from './entities/${singular}.entity.audit';

@Injectable()
export class ${SingularPascal}Service extends CrudService<${SingularPascal}, ${SingularPascal}Audit> {
  constructor(
    @InjectRepository(${SingularPascal})
    protected readonly repository: Repository<${SingularPascal}>,
    @InjectRepository(${SingularPascal}Audit)
    protected readonly auditRepository: Repository<${SingularPascal}Audit>,
  ) {
    super(${SingularPascal}, repository, auditRepository, {});
  }

  public async find(criteria: Search${SingularPascal}): Promise<${SingularPascal}[]> {
    const where = {
      ...(isDefined(criteria.name) && { name: ILike('%' + criteria.name + '%') }),
      ...(criteria.deleted_at && { deleted_at: Not(IsNull()) }),
    };

    const items = await this.all(where, criteria, criteria.deleted_at);
    return items;
  }
}
EOF

# ---------- Mapper ----------
cat > "$DOMAIN_DIR/${singular}.mapper.ts" <<EOF
import { Injectable } from '@nestjs/common';
import { isEqual } from '../../utils';
import { isDefined } from 'class-validator';
import { Create${SingularPascal} } from './dto/create-${singular}.dto';
import { ${SingularPascal} } from './entities/${singular}.entity';
import { Update${SingularPascal} } from './dto/update-${singular}.dto';
import { ConflictUpdateError } from 'src/errors/conflict-update.error';
import { ${SingularPascal}Output } from './dto/${singular}.output';

@Injectable()
export class ${SingularPascal}Mapper {
  public toModel(input: Create${SingularPascal}): ${SingularPascal};

  public toModel(input: Update${SingularPascal}, existing: ${SingularPascal}): ${SingularPascal};

  public toModel(
    input: Create${SingularPascal} | Update${SingularPascal},
    existing?: ${SingularPascal},
  ): ${SingularPascal} {
    let data = {};

    if (input instanceof Update${SingularPascal}) {
      // if (isDefined(input.version) && isDefined(existing?.version)) {
      //   if (!isEqual(input.version, existing?.version)) {
      //     throw new ConflictUpdateError();
      //   }
      // }
      data = {
        name: input.name ?? existing?.name,
      };
    } else {
      data = {
        name: input.name,
      };
    }
    return Object.assign(new ${SingularPascal}(), existing ?? {}, data);
  }

  public toOutput(input: ${SingularPascal}): ${SingularPascal}Output {
    return Object.assign(new ${SingularPascal}Output(), {
      id: input.id,
      name: input.name,
      version: input.version,
      created_at: input.created_at,
      updated_at: input.updated_at,
      deleted_at: input.deleted_at,
    });
  }
}
EOF

# ---------- Controller ----------
cat > "$DOMAIN_DIR/${singular}.controller.ts" <<EOF
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
import { ${SingularPascal}Service } from './${singular}.service';
import { Create${SingularPascal} } from './dto/create-${singular}.dto';
import { ${SingularPascal}Output } from './dto/${singular}.output';
import { Search${SingularPascal} } from './dto/search-${singular}.dto';
import { Update${SingularPascal} } from './dto/update-${singular}.dto';
import { isDefined } from 'class-validator';
import { ${SingularPascal}Mapper } from './${singular}.mapper';
import { DateRangeInput } from '../shared/dto/date-range.dto';
import { ApiNestedQuery } from '../shared/decorators/api-range-property.decorator';
import { AuditSearchInput } from '../shared/dto/audit-search.dto';
import { AuditOutput } from '../shared/dto/audit-output.dto';
import { RolesGuard } from 'src/guards/permissions.guard';
import { UserRole } from '../users/shared/user-role.enum';
import { Roles } from 'src/guards/decorators/permissions.decorator';

@ApiTags('${PluralPascal}')
@Controller('/api/v1/${plural}')
@ApiExtraModels(PageOutput<${SingularPascal}Output>)
@UseGuards(RolesGuard)
export class ${SingularPascal}Controller {
  constructor(
    private readonly service: ${SingularPascal}Service,
    private readonly mapper: ${SingularPascal}Mapper,
  ) {}

  @Post()
  @ApiBearerAuth()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiException(() => [BadRequestException, ConflictException])
  async create(@Body() input: Create${SingularPascal}): Promise<${SingularPascal}Output> {
    const entity = this.mapper.toModel(input);
    const created = await this.service.create(entity);
    return this.mapper.toOutput(created);
  }

  @Get()
  @ApiBearerAuth()
  @ApiPageResponse(${SingularPascal}Output)
  @ApiException(() => [BadRequestException])
  public async list(
    @Query() criteria: Search${SingularPascal},
  ): Promise<PageOutput<${SingularPascal}Output>> {
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
  ): Promise<PageOutput<AuditOutput<${SingularPascal}Output>>> {
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
    @Body() input: Update${SingularPascal},
  ): Promise<${SingularPascal}Output> {
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
  ): Promise<${SingularPascal}Output> {
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
  ): Promise<PageOutput<AuditOutput<${SingularPascal}Output>>> {
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
    return { message: '${SingularPascal} deleted' };
  }

  @Delete('permanent/:id')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiException(() => [NotFoundException])
  async permanentDelete(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    await this.service.permanentDelete({ id });
    return { message: '${SingularPascal} permanently deleted' };
  }

  @Patch('restore/:id')
  @ApiBearerAuth()
  async restore(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<${SingularPascal}Output> {
    const restored = await this.service.restore({ id });
    return this.mapper.toOutput(restored);
  }
}
EOF

# ---------- Module ----------
cat > "$DOMAIN_DIR/${singular}.module.ts" <<EOF
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClsModule } from 'nestjs-cls';
import { ${SingularPascal} } from './entities/${singular}.entity';
import { ${SingularPascal}Service } from './${singular}.service';
import { ${SingularPascal}Controller } from './${singular}.controller';
import { ${SingularPascal}Audit } from './entities/${singular}.entity.audit';
import { ${SingularPascal}Subscriber } from './entities/${singular}.entity.subscriber';
import { ${SingularPascal}Mapper } from './${singular}.mapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([${SingularPascal}, ${SingularPascal}Audit]),
    ClsModule,
    EventEmitterModule,
  ],
  providers: [${SingularPascal}Service, ${SingularPascal}Subscriber, ${SingularPascal}Mapper],
  controllers: [${SingularPascal}Controller],
  exports: [${SingularPascal}Service, ${SingularPascal}Mapper, TypeOrmModule],
})
export class ${SingularPascal}Module {}
EOF

# ---------- Run Formatting ----------
npm run format

echo "\n✔ Generated domain: $PluralPascal ($plural)"
echo "  • Directory: src/domain/$plural"
echo "  • Files:"
echo "      - ${singular}.module.ts, ${singular}.controller.ts, ${singular}.service.ts, ${singular}.mapper.ts"
echo "      - entities/${singular}.entity.ts, entities/${singular}.entity.audit.ts, entities/${singular}.entity.subscriber.ts"
echo "      - dto/${singular}-create.dto.ts, dto/${singular}-search.dto.ts, dto/${singular}-update.dto.ts, dto/${singular}.output.ts"
echo "      - shared/${singular}-topic.enum.ts"
echo "\nNext steps:"
echo "  1) Import ${SingularPascal}Module in src/app.module.ts and add it to the imports array"
echo "  2) Create a migration for the new tables if needed (countries example uses TypeORM)"
echo "  3) Adjust fields in DTOs/entities/mapper to suit your domain"


