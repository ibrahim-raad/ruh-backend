import { Transform } from 'class-transformer';

export function ToNumber(): PropertyDecorator {
  return Transform(({ value }) => {
    if (typeof value === 'string') {
      return parseFloat(value);
    }
    if (typeof value === 'number') {
      return value;
    }
    return undefined;
  });
}
