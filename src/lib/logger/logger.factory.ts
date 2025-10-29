import { DestinationStream, Logger, pino } from 'pino';
import createEcsPinoOptions from '@elastic/ecs-pino-format';

export type LoggerFormat = 'json' | 'plain';

export const LoggerFactory = ({
  format,
  level,
  mixin,
  stream,
  redact,
}: {
  level: string;
  mixin: Record<string, string>;
  format: LoggerFormat;
  stream?: DestinationStream;
  redact: string[];
}): Logger =>
  pino(
    {
      level,
      ...(format === 'json' &&
        createEcsPinoOptions({
          convertReqRes: true,
          convertErr: true,
          apmIntegration: true,
        })),
      ...(format === 'plain' && {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
            levelFirst: true,
            colorize: true,
            translateTime: true,
          },
        },
      }),
      ...(format === 'json' && {
        mixin: () => ({
          ...mixin,
        }),
      }),
      redact: getRedactedPaths(redact),
    },
    stream,
  );
const getRedactedPaths = (keys: string[], level: number = 3) => {
  return keys.flatMap((it) => {
    const keyPaths: string[] = [];
    for (let i = 0; i <= level; i++) {
      const prefix = Array(i).fill('*').join('.');
      keyPaths.push(`${prefix}${prefix ? '.' : ''}${it}`);
    }
    return keyPaths;
  });
};
