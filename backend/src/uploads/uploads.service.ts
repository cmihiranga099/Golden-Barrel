import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { readFileSync } from 'fs';

@Injectable()
export class UploadsService {
  private s3?: S3Client;

  constructor() {
    if (process.env.STORAGE_PROVIDER === 's3') {
      this.s3 = new S3Client({
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY || '',
          secretAccessKey: process.env.S3_SECRET_KEY || '',
        },
      });
    }
  }

  async processUploads(files: Express.Multer.File[]) {
    if (process.env.STORAGE_PROVIDER === 's3' && this.s3) {
      const uploads = await Promise.all(
        files.map(async (file) => {
          const key = `${uuidv4()}-${file.originalname}`;
          const body = readFileSync(file.path);
          await this.s3?.send(
            new PutObjectCommand({
              Bucket: process.env.S3_BUCKET,
              Key: key,
              Body: body,
              ContentType: file.mimetype,
            }),
          );
          return { url: `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}/${key}` };
        }),
      );
      return uploads;
    }

    return files.map((file) => ({ url: `/${process.env.LOCAL_UPLOAD_DIR || 'uploads'}/${file.filename}` }));
  }
}