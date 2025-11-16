import { diskStorage, Options } from 'multer';
import { extname } from 'path';
import { parseFileSize } from './file-size.utils';
import * as fs from 'fs';
import * as path from 'path';

type AllowedExtensions = RegExp | string[];

const toRegex = (allowed: AllowedExtensions): RegExp => {
  if (allowed instanceof RegExp) {
    return allowed;
  }
  const parts = allowed
    .map((ext) => ext.replace(/^\./, '').toLowerCase())
    .join('|');
  return new RegExp(`\\.(${parts})$`, 'i');
};

export const multerConfig = (
  destination: string,
  fileSizeLimit: string,
  allowedExtensions: AllowedExtensions = /\.(jpg|jpeg|png|gif|pdf|avif)$/i,
): Options => ({
  storage: diskStorage({
    destination: (
      req: Express.Request,
      file: Express.Multer.File,
      cb: (error: Error | null, destination: string) => void,
    ) => {
      const fullPath = path.join(process.cwd(), 'uploads', destination);
      fs.mkdirSync(fullPath, { recursive: true });
      cb(null, fullPath);
    },
    filename: (
      req: Express.Request,
      file: Express.Multer.File,
      callback: (error: Error | null, filename: string) => void,
    ) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      const safePrefix = destination.replace(/[\\/]/g, '-');
      const filename = `${safePrefix}-${uniqueSuffix}${ext}`;
      callback(null, filename);
    },
  }),
  fileFilter: (
    req: Express.Request,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    const regex = toRegex(allowedExtensions);
    if (!regex.test(file.originalname.toLowerCase())) {
      return callback(new Error('File type not allowed'), false);
    }
    callback(null, true);
  },
  limits: {
    fileSize: parseFileSize(fileSizeLimit),
  },
});
