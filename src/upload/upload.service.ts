import { Injectable, Logger } from '@nestjs/common';

import {
  BlobSASPermissions,
  BlobServiceClient,
  StorageSharedKeyCredential,
} from '@azure/storage-blob';
import { v4 as uuidv4 } from 'uuid';

export interface PresignedUrl {
  uploadUrl: string;
  filePath: string;
}

@Injectable()
export class UploadService {
  private readonly accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
  private readonly accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;

  private readonly logger = new Logger(UploadService.name);

  private readonly EXPIRE_MINUTES = 120;

  async createPresignedUrl(): Promise<PresignedUrl> {
    const containerName = 'avatars';
    const blobServiceClient = new BlobServiceClient(
      `https://${this.accountName}.blob.core.windows.net`,
      new StorageSharedKeyCredential(this.accountName!, this.accountKey!),
    );

    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobName = `${uuidv4()}.png`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + this.EXPIRE_MINUTES);

    const sasToken = await blockBlobClient.generateSasUrl({
      expiresOn: expiryTime,
      permissions: BlobSASPermissions.parse('w'),
    });

    return {
      uploadUrl: sasToken,
      filePath: blobName,
    };
  }

  getImageUrl(blobName: string): string {
    try {
      const containerName = 'avatars';
      const blobServiceClient = new BlobServiceClient(
        `https://${this.accountName}.blob.core.windows.net`,
        new StorageSharedKeyCredential(this.accountName!, this.accountKey!),
      );

      const containerClient =
        blobServiceClient.getContainerClient(containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);

      console.log('blockBlobClient.url', blockBlobClient.url);

      return blockBlobClient.url;
    } catch (error) {
      this.logger.error('Error in pre-signing the image url', { blobName });
      return '';
    }
  }
}
