import { Injectable } from '@nestjs/common';
import { FileInterface } from './file.interface';
import { path as p } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';
import * as path from 'path';
import * as crypto from 'node:crypto';

@Injectable()
export class FileService {
  async saveFiles(
    files: Express.Multer.File[],
    folder: string = 'default',
  ): Promise<FileInterface[]> {
    const uploadFolder = `${p}/uploads/${folder}`;
    await ensureDir(uploadFolder);
    const res: FileInterface[] = await Promise.all(
      files.map(async (file) => {
        const exp = path.extname(file.originalname);
        const fileHash = crypto
          .createHash('md5')
          .update(Date.now() + file.originalname)
          .digest('hex');
        const fileName = `${fileHash}${exp}`;
        await writeFile(`${uploadFolder}/${fileName}`, file.buffer);
        return {
          url: `/uploads/${folder}/${file.originalname}`,
          name: fileName,
        };
      }),
    );
    return res;
  }
}
