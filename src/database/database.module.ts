import { Module, DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from 'src/config/database.config';
import * as path from 'path';

@Module({})
export class RuhTherapyDatabaseModule {
  static forRoot(dbConfig: DatabaseConfig): DynamicModule {
    return {
      module: RuhTherapyDatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: () => ({
            type: 'postgres',
            host: dbConfig.host,
            port: dbConfig.port,
            username: dbConfig.username,
            password: dbConfig.password,
            database: dbConfig.database,
            synchronize: dbConfig.synchronize || false,
            ssl: dbConfig.ssl?.enabled ? dbConfig.ssl : undefined,
            entities: [
              path.join(
                __dirname,
                '..',
                'domain',
                '**',
                '*.entity.{ts,js,audit.ts,audit.js}',
              ),
            ],
          }),
        }),
      ],
      exports: [TypeOrmModule],
    };
  }
}
