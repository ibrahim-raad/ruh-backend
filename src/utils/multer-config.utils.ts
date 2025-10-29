import { diskStorage, Options } from 'multer';
import { extname } from 'path';
import { parseFileSize } from './file-size.utils';

export const multerConfig = (
  destination: string,
  fileSizeLimit: string,
): Options => ({
  storage: diskStorage({
    destination: `./uploads/${destination}`,
    filename: (
      req: Express.Request,
      file: Express.Multer.File,
      callback: (error: Error | null, filename: string) => void,
    ) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      const filename = `${destination}-${uniqueSuffix}${ext}`;
      callback(null, filename);
    },
  }),
  fileFilter: (
    req: Express.Request,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf|avif)$/)) {
      return callback(new Error('Only image or Pdf files are allowed!'), false);
    }
    callback(null, true);
  },
  limits: {
    fileSize: parseFileSize(fileSizeLimit),
  },
});
