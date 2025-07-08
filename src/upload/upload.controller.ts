import { Controller, Post } from '@nestjs/common';

import { UploadService } from './upload.service';

export interface PresignedUrl {
  uploadUrl: string;
  filePath: string;
}

@Controller()
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('/presigned-avatar-url')
  async createPresignedUrl(): Promise<PresignedUrl> {
    return this.uploadService.createPresignedUrl();
  }
}
