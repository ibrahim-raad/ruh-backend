import { QueryFailedErrorFilter } from './query-failed.error.filter';
import { ServiceValidationErrorFilter } from './service-validation.error.filter';
import { EntityNotFoundErrorFilter } from './entity-not-found.error.filter';
import { EntityPropertyNotFoundErrorFilter } from './entity-property-not-found.error.filter';

export * from './query-failed.error.filter';
export * from './service-validation.error.filter';

export const defaultFilters = [
  new QueryFailedErrorFilter(),
  new ServiceValidationErrorFilter(),
  new EntityNotFoundErrorFilter(),
  new EntityPropertyNotFoundErrorFilter(),
];
