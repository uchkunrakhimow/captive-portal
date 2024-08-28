import { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'node:path';

const STORAGE_DIRECTORY = path.join(__dirname, '../storage');

export const fileUpload = (req: Request, res: Response): void => {
  try {
    if (!req.file) {
      throw new Error('No file uploaded');
    }
    res.status(200).send(req.file.filename);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const ipList = async (req: Request, res: Response): Promise<void> => {
  try {
    const files = await fs.readdir(STORAGE_DIRECTORY);
    const csvFiles = files
      .filter(file => file.endsWith('.csv'))
      .map(file => ({
        name: file,
        url: `/files/${file}`,
      }));

    if (csvFiles.length === 0) {
      res.status(200).send('No CSV files found');
    } else {
      res.json(csvFiles);
    }
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};
