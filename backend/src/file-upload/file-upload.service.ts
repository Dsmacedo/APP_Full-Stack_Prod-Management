import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FileUploadService {
  private s3: S3;

  constructor(private readonly configService: ConfigService) {
    // Configuração para uso do LocalStack
    this.s3 = new S3({
      endpoint: 'http://localhost:4566',
      s3ForcePathStyle: true,
      accessKeyId: 'test',
      secretAccessKey: 'test',
      region: 'us-east-1',
    });
  }

  async upload(
    file: Express.Multer.File,
    folder: string = 'products',
  ): Promise<string> {
    const bucketName =
      this.configService.get('AWS_S3_BUCKET') || 'ecommerce-bucket';

    // Verifica se o bucket existe, se não, cria
    try {
      await this.s3.headBucket({ Bucket: bucketName }).promise();
    } catch (error) {
      await this.s3.createBucket({ Bucket: bucketName }).promise();
    }

    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${folder}/${uuid()}.${fileExtension}`;

    await this.s3
      .upload({
        Bucket: bucketName,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      })
      .promise();

    // URL local do LocalStack
    return `http://localhost:4566/${bucketName}/${fileName}`;
  }

  async delete(fileUrl: string): Promise<void> {
    const bucketName =
      this.configService.get('AWS_S3_BUCKET') || 'ecommerce-bucket';

    // Extrair o key do URL
    const urlParts = fileUrl.split('/');
    const key = urlParts.slice(4).join('/');

    await this.s3
      .deleteObject({
        Bucket: bucketName,
        Key: key,
      })
      .promise();
  }
}
