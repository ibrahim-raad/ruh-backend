import { ValidationError } from 'class-validator';

export function extractMessage(it: ValidationError, prefix?: string): string[] {
  return it.constraints
    ? Object.values(it.constraints).map(
        (c) => `${prefix ? prefix + '.' : ''}${c}`,
      )
    : (it.children
        ?.map((c) =>
          extractMessage(c, `${prefix ? prefix + '.' : ''}${it.property}`),
        )
        ?.flat() ?? []);
}
