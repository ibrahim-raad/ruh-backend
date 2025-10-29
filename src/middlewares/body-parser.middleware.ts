import { NextFunction, Request, Response } from 'express';
import { json } from 'body-parser';

export const bodyParser =
  (pattern: RegExp) => (req: Request, res: Response, next: NextFunction) => {
    const useRawBody = pattern.test(req.path);
    if (useRawBody) {
      next();
    } else {
      json({ limit: '50mb' })(req, res, next);
    }
  };
