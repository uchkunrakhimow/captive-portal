import { extname } from 'node:path';
import { v4 } from 'uuid';

import multer from 'multer';

const storage = multer.diskStorage({
  destination: 'src/storage/upload',
  filename: (req, file, cb) => {
    const newFileName = v4() + extname(file.originalname);
    cb(null, newFileName);
  },
});

export const pathFile = multer({ storage });
