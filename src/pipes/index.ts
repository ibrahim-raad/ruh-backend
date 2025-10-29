import { ValidationFactory } from './validation-pipe.factory';

export * from './validation-pipe.factory';

export const defaultPipes = [ValidationFactory.createGlobal()];
