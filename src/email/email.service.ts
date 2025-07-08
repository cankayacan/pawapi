import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Resend } from 'resend';

interface EmailAttachment {
  filename: string;
  content: Buffer;
}

interface EmailData {
  from: string;
  to: string;
  cc?: string;
  subject: string;
  html: string;
  attachments?: EmailAttachment[];
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    if (!apiKey) {
      throw new Error('Resend API key is not configured');
    }
    this.resend = new Resend(apiKey);
  }

  async sendEmail(emailData: EmailData): Promise<any> {
    const { from, to, cc, subject, html, attachments } = emailData;

    try {
      const response = await this.resend.emails.send({
        from,
        to,
        cc,
        subject,
        html,
        attachments,
      });

      this.logger.log(`Email sent to ${to} with subject: "${subject}"`);
      return response;
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`);
      throw error;
    }
  }
}
