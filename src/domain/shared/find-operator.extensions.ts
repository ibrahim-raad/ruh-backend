import { FindOperator } from 'typeorm/find-options/FindOperator';

import { isDefined } from 'class-validator';
import { Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Range } from './range.interface';

export const InRange = <T>(range?: Range<T>): FindOperator<T> => {
  if (!isDefined(range)) {
    return undefined as unknown as FindOperator<T>;
  }
  return isDefined(range?.from)
    ? isDefined(range.to)
      ? Between(range.from, range.to)
      : MoreThanOrEqual(range.from)
    : isDefined(range?.to)
      ? LessThanOrEqual(range.to)
      : (undefined as unknown as FindOperator<T>);
};

export const IsNullOrBetween = <T>(from: T, to: T): FindOperator<T> =>
  new FindOperator<T>(
    'raw',
    undefined as unknown as T | FindOperator<T>,
    true,
    true,
    (alias) => `(${alias} IS NULL OR (${alias} >= :from AND ${alias} <= :to))`,
    { from, to },
  );
export const IsNullOrMoreThanEqual = <T>(value: T): FindOperator<T> =>
  new FindOperator<T>(
    'raw',
    undefined as unknown as T | FindOperator<T>,
    true,
    true,
    (alias) => `(${alias} IS NULL OR ${alias} >= :value)`,
    { value },
  );

export const IsNullOrLessThanEqual = <T>(value: T): FindOperator<T> =>
  new FindOperator<T>(
    'raw',
    undefined as unknown as T | FindOperator<T>,
    true,
    true,
    (alias) => `(${alias} IS NULL OR ${alias} <= :value)`,
    { value },
  );
