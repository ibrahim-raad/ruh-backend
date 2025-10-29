import { DataSource } from 'typeorm';
import * as process from 'process';
import { DatabaseConfig } from '../config/database.config';
import { load } from 'ts-yaml-loader';
import { validateFor } from '../lib/class-validator-extensions/validate-or-throw';
import * as dotenv from 'dotenv';
import * as path from 'path';

const config = () => {
  dotenv.config({ path: path.join(__dirname, '../../.env') });

  const config = load<DatabaseConfig>({
    path: 'db',
    validate: validateFor(DatabaseConfig),
  });
  return config;
};

const withData = process.argv.some((it) => it.includes('--with-data=true'));
const fromSource = process.argv.some((it) => it.includes('--from-source'));
const { ssl, ...options } = config();

export default new DataSource({
  type: 'postgres',
  ...options,
  ...(ssl?.enabled && { ssl }),
  synchronize: false,
  entities: [
    `${fromSource ? 'src' : 'dist'}/domain/**/*.entity.{ts,js,audit.ts,audit.js}`,
  ],
  migrations: [
    `${fromSource ? 'src' : 'dist'}/migrations/*-migration.{ts,js}`,
    ...(withData
      ? [`${fromSource ? 'src' : 'dist'}/migrations/data/*-data.{ts,js}`]
      : []),
  ],
  migrationsTransactionMode: withData ? 'each' : 'all',
});
