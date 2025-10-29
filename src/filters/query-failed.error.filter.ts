/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// query-failed-error.filter.ts
import { QueryFailedError } from 'typeorm';
import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ConflictException,
  ExceptionFilter,
  ForbiddenException,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Response } from 'express';
import { DATABASE_ERROR_MESSAGES } from 'src/app.constants';
import { isDefined } from 'class-validator';

interface PostgresError extends Error {
  code?: string;
  column?: string;
  table?: string;
  constraint?: string;
  detail?: string;
}

@Catch(QueryFailedError)
export class QueryFailedErrorFilter implements ExceptionFilter {
  catch(
    exception: QueryFailedError & { driverError: PostgresError },
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const pgError = exception.driverError;

    const errorCode = pgError.code;
    const column = pgError.column;
    const table = pgError.table;
    const constraint = pgError.constraint;
    const detail = pgError.detail;

    let rethrow;
    let message: string;

    switch (errorCode) {
      // Class 23 - Integrity Constraint Violation
      case '23000': // integrity_constraint_violation
      case '23001': // restrict_violation
      case '23502': // not_null_violation
        message = column
          ? DATABASE_ERROR_MESSAGES.NOT_NULL_VIOLATION(column)
          : 'Null value violates not-null constraint';
        rethrow = new BadRequestException([message]);
        break;

      case '23503': // foreign_key_violation
        message = DATABASE_ERROR_MESSAGES.FOREIGN_KEY_VIOLATION;
        rethrow = new BadRequestException([message]);
        break;

      case '23505': {
        // unique_violation
        const keyValue = detail?.split('(')[1].split(')')[0];
        message = isDefined(keyValue)
          ? DATABASE_ERROR_MESSAGES.UNIQUE_VIOLATION(keyValue)
          : DATABASE_ERROR_MESSAGES.CONFLICT_VIOLATION;
        rethrow = new ConflictException([message]);
        break;
      }

      case '23514': // check_violation
        message = DATABASE_ERROR_MESSAGES.CHECK_VIOLATION;
        rethrow = new BadRequestException([message]);
        break;

      // Class 22 - Data Exception
      case '22001': // string_data_right_truncation
        message = DATABASE_ERROR_MESSAGES.STRING_DATA_RIGHT_TRUNCATION;
        rethrow = new BadRequestException([message]);
        break;

      case '22003': // numeric_value_out_of_range
        message = DATABASE_ERROR_MESSAGES.NUMERIC_VALUE_OUT_OF_RANGE;
        rethrow = new BadRequestException([message]);
        break;

      case '22007': // invalid_datetime_format
        message = DATABASE_ERROR_MESSAGES.INVALID_DATETIME_FORMAT;
        rethrow = new BadRequestException([message]);
        break;

      case '22008': // datetime_field_overflow
        message = DATABASE_ERROR_MESSAGES.INVALID_DATETIME_FORMAT;
        rethrow = new BadRequestException([message]);
        break;

      case '22012': // division_by_zero
        message = 'Division by zero error';
        rethrow = new BadRequestException([message]);
        break;

      case '22023': // invalid_parameter_value
        message = 'Invalid parameter value';
        rethrow = new BadRequestException([message]);
        break;

      // Class 40 - Transaction Rollback
      case '40001': // serialization_failure
        message = DATABASE_ERROR_MESSAGES.SERIALIZATION_FAILURE;
        rethrow = new ConflictException([message]);
        break;

      case '40002': // transaction_integrity_constraint_violation
        message = DATABASE_ERROR_MESSAGES.TRANSACTION_ERROR;
        rethrow = new ConflictException([message]);
        break;

      case '40P01': // deadlock_detected
        message = DATABASE_ERROR_MESSAGES.DEADLOCK_DETECTED;
        rethrow = new ConflictException([message]);
        break;

      // Class 53 - Insufficient Resources
      case '53000': // insufficient_resources
      case '53100': // disk_full
        message = DATABASE_ERROR_MESSAGES.DISK_FULL;
        rethrow = new ServiceUnavailableException([message]);
        break;

      case '53200': // out_of_memory
        message = DATABASE_ERROR_MESSAGES.OUT_OF_MEMORY;
        rethrow = new ServiceUnavailableException([message]);
        break;

      case '53300': // too_many_connections
        message = DATABASE_ERROR_MESSAGES.TOO_MANY_CONNECTIONS;
        rethrow = new BadRequestException([message]);
        break;

      // Class 54 - Program Limit Exceeded
      case '54000': // program_limit_exceeded
      case '54001': // statement_too_complex
      case '54011': // too_many_columns
      case '54023': // too_many_arguments
        message = 'Database operation too complex';
        rethrow = new BadRequestException([message]);
        break;

      // Class 57 - Operator Intervention
      case '57014': // query_canceled
        message = 'Database query was canceled';
        rethrow = new ServiceUnavailableException([message]);
        break;

      case '57P01': // admin_shutdown
        message = DATABASE_ERROR_MESSAGES.ADMIN_SHUTDOWN;
        rethrow = new ServiceUnavailableException([message]);
        break;

      case '57P02': // crash_shutdown
        message = DATABASE_ERROR_MESSAGES.CRASH_SHUTDOWN;
        rethrow = new ServiceUnavailableException([message]);
        break;

      case '57P03': // cannot_connect_now
        message = DATABASE_ERROR_MESSAGES.CANNOT_CONNECT_NOW;
        rethrow = new ServiceUnavailableException([message]);
        break;

      // Class 28 - Invalid Authorization
      case '28000': // invalid_authorization_specification
      case '28P01': // invalid_password
        message = 'Database authentication failed';
        rethrow = new ForbiddenException([message]);
        break;

      // Class 3D - Invalid Catalog Name
      case '3D000': // invalid_catalog_name
        message = 'Invalid database name';
        rethrow = new BadRequestException([message]);
        break;

      // Class 42 - Syntax Error
      case '42000': // syntax_error
      case '42601': // syntax_error
        message = DATABASE_ERROR_MESSAGES.SYNTAX_ERROR;
        rethrow = new BadRequestException([message]);
        break;

      case '42703': // undefined_column
        message = column
          ? `Column '${column}' does not exist`
          : 'Column does not exist';
        rethrow = new BadRequestException([message]);
        break;

      case '42P01': // undefined_table
        message = table
          ? `Table '${table}' does not exist`
          : 'Table does not exist';
        rethrow = new BadRequestException([message]);
        break;

      case '42P07': // duplicate_table
        message = table
          ? `Table '${table}' already exists`
          : 'Table already exists';
        rethrow = new ConflictException([message]);
        break;

      // Default case
      default:
        message = DATABASE_ERROR_MESSAGES.DEFAULT;
        rethrow = new InternalServerErrorException([message]);
    }

    // Log the full error for debugging
    console.error('Database Error:', {
      errorCode,
      message: pgError.message,
      table,
      column,
      constraint,
      detail,
      stack: exception.stack,
    });

    response.status(rethrow.getStatus()).json({
      ...rethrow.getResponse(),
      errorCode, // Include the PostgreSQL error code in response
    });
  }
}
