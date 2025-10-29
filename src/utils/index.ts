/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { isDefined, isObject, isString } from 'class-validator';
import { diff as deepDiff } from 'deep-object-diff';

export const generatePassword = (): string => {
  let password = generateRandomString(8).toLowerCase();
  for (let i = 0; i < password.length; i++) {
    if (password.charAt(i) !== password.charAt(i).toUpperCase()) {
      password =
        password.charAt(i).toUpperCase() +
        password.slice(0, i) +
        password.slice(i + 1);
      break;
    }
  }
  return password;
};

export const formatToCurrency = (value: number, code: string) =>
  value.toLocaleString('en-US', {
    style: 'currency',
    currency: code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const manyOf = <T>(amount: number, factory: (i: number) => T): T[] =>
  Array.from({ length: amount }, (_, i) => factory(i));

export const isEqual = <T>(a: T | undefined, b: T): boolean => !!a && a === b;

export const diff = <T>(a: T, b: T): T | undefined =>
  hasChanged(a, b) ? b : undefined;

export const hasChanged = (a: any, b: any): boolean =>
  Object.keys(deepDiff(a, b)).length > 0;

export const convertToNestedObject = (
  input: string,
  separators?: { field?: ',' | '|' | ';'; value?: ':' | '=' | ' ' },
): any => {
  const sep = {
    field: ',',
    value: ':',
    ...(separators ?? {}),
  };
  const regexMap = {
    ',': / ?, ?/g,
    '|': / ?\| ?/g,
    ';': / ?; ?/g,
    ' ': /\s{1,3}/g,
    '=': / ?= ?/g,
    ':': / ?: ?/g,
  };
  const split = (str: string, token: string) =>
    str.replace(/['"]/g, '').replace(regexMap[token], token).split(token);

  const fields = split(input, sep.field);
  const convertField = (field: string) => {
    const [key, value] = split(field, sep.value);
    const parts = key.trim().split('.');
    if (parts.length === 1) {
      return { [key]: value };
    }
    const last = parts.pop();
    let currentObject: any = { [last as string]: value };
    for (const part of parts.reverse()) {
      currentObject = { [part]: currentObject };
    }
    return currentObject;
  };

  return fields
    .map((it) => convertField(it))
    .reduce((a, b) => ({ ...a, ...b }), {});
};

export const stripNull = <T>(obj: T): T => {
  if (typeof obj !== 'object' || obj === null || obj instanceof Date) {
    return isDefined(obj) ? obj : (undefined as T);
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => stripNull(item) as T) as T;
  }

  return Object.keys(obj).reduce(
    (a, b) => ({
      ...a,
      ...(isDefined(obj[b]) && { [b]: stripNull(obj[b as keyof typeof obj]) }),
    }),
    {} as T,
  );
};

export const compareToField = <T>(
  input: T,
  reference: string | T,
  plain: any,
  transform: (b?: any) => T = (b) => b as T,
  compare: (a: T, b?: T) => boolean = isEqual,
): boolean => {
  const isField = isString(reference) && /^\$.*$/.test(reference);
  const records = plain as Record<string, unknown>;
  const relatedValue = isField
    ? records[reference.replace('$', '')]
    : reference;
  return compare(transform(input), transform(relatedValue));
};

export const isAfter = (
  value: Date | number,
  reference: string | Date | number,
  plain: any = {},
): boolean => {
  const convert = (input?: any) => {
    return input ? (input instanceof Date ? +input : +new Date(input)) : 0;
  };
  return compareToField(
    value,
    reference,
    plain,
    convert,
    (a, b) => a > (b ?? 0),
  );
};

export const isBigger = (
  value: number,
  reference: string | number,
  plain: any = {},
): boolean =>
  compareToField(
    value,
    reference,
    plain,
    (it) => (it ? +it : 0),
    (a, b) => a > (b ?? 0),
  );

const transformKeys = (fields: any, separator: '_' | '-') => {
  const replacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  };

  const keyRegex = /([{,])([^:]+)/g;
  const camelCaseRegex = /([a-z\d])([A-Z])/g;

  return JSON.parse(
    JSON.stringify(fields, replacer()).replace(keyRegex, (match) => {
      return match.replace(camelCaseRegex, `$1${separator}$2`).toLowerCase();
    }),
  );
};

export const snakifyKeys = (fields: any) => transformKeys(fields, '_');

export const slugify = (str: string): string => {
  const camelCaseRegex = /([a-z\d])([A-Z0-9])/g;
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(camelCaseRegex, `$1-$2`)
    .replace(/^\s+|\s+$/g, '-')
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

export const getNestedParam = (prev?: any, key?: string) => {
  if (!isDefined(prev) || !isObject(prev)) {
    return;
  }
  const parts = key?.split('.');
  const first = parts?.shift();
  return parts?.length === 0
    ? prev?.[first as string]
    : getNestedParam(prev?.[first as string], parts?.join('.'));
};

export const getRedactedPaths = (keys: string[], level: number = 3) => {
  return keys.flatMap((it) => {
    const keyPaths: string[] = [];
    for (let i = 0; i <= level; i++) {
      const prefix = Array(i).fill('*').join('.');
      keyPaths.push(`${prefix}${prefix ? '.' : ''}${it}`);
    }
    return keyPaths;
  });
};

export const localeToLanguage = (locale: string) => {
  return locale?.split(/-|_/)[0];
};

export const sleep = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const generateTransactionNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase(); // Get current timestamp then convert to base36 string
  const randomString = generateRandomString(3); // Generate random string of length 3
  return timestamp + randomString; // Concatenate timestamp and random string
};

export const generateRandomString = (length: number) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomString = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters[randomIndex];
  }
  return randomString;
};

export const addDaysToDate = (date: Date, days: number): Date => {
  const finalDate = new Date(date);
  finalDate.setDate(finalDate.getDate() + days);
  return finalDate;
};

export function addQueryParam(
  url: string,
  paramName: string,
  paramValue: string,
): string {
  if (url.indexOf('?') === -1) {
    url += '?' + paramName + '=' + paramValue;
  } else {
    url += '&' + paramName + '=' + paramValue;
  }
  return url;
}

type DateRangeType = 'TILL_NOW' | 'MONTH' | 'WEEK' | 'YEAR';
type DateRangeRequestDto = {
  start: Date | null;
  end: Date;
};
export const getDateRange = (type: DateRangeType): DateRangeRequestDto => {
  const now = new Date();
  switch (type) {
    case 'TILL_NOW':
      return {
        start: null,
        end: now,
      };
    case 'MONTH': {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return {
        start,
        end: now,
      };
    }
    case 'WEEK':
      return {
        start: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7),
        end: now,
      };
    case 'YEAR':
      return {
        start: new Date(now.getFullYear(), 0, 1),
        end: now,
      };
  }
};
