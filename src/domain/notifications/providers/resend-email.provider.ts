import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { AppConfig } from '../../../app.config';
import { Notification } from '../entities/notification.entity';
import { NotificationType } from '../shared/notification-type.enum';
import { AppPaths } from '../../../app.constants';

@Injectable()
export class ResendEmailProvider {
  private readonly resend: Resend;
  private readonly logger = new Logger(ResendEmailProvider.name);
  private readonly fromEmail: string;
  private readonly webAppUrl: string;

  constructor(private readonly configService: ConfigService) {
    const config = this.configService.get<AppConfig>('main');
    const apiKey = config?.resend?.apiKey;
    this.fromEmail = config?.resend?.fromEmail ?? '';
    this.webAppUrl = config?.webApp?.url ?? '';

    if (!apiKey || apiKey.includes('change_this')) {
      this.logger.warn('Resend API Key is not configured properly.');
    }

    this.resend = new Resend(apiKey);
  }

  async send(notification: Notification): Promise<void> {
    this.logger.log(`Notification: ${JSON.stringify(notification)}`);
    const user = notification.user;
    if (!user?.email) {
      this.logger.warn(
        `User ${user?.id} has no email address. Skipping email notification.`,
      );
      return;
    }

    const subject = notification.title;
    let html = notification.body;

    const token: string | undefined = notification.data?.token as string;
    this.logger.log(`Data: ${JSON.stringify(notification.data)}`);
    this.logger.log(`Token: ${token}`);
    if (notification.type === NotificationType.EMAIL_VERIFICATION) {
      if (token) {
        html = this.generateVerificationEmail(token);
      } else {
        this.logger.error('Token is required for email verification');
      }
    } else if (notification.type === NotificationType.RESET_PASSWORD) {
      if (token) {
        html = this.generateResetPasswordEmail(token);
      }
    }

    try {
      const data = await this.resend.emails.send({
        from: this.fromEmail,
        to: user.email,
        subject: subject,
        html: html,
      });
      if (data.error) {
        this.logger.error(
          `Failed to send email to ${user.email}: ${data.error.message}`,
        );
      } else {
        this.logger.log(
          `Email sent successfully to ${user.email}, ID: ${data.data?.id}`,
        );
      }
    } catch (error) {
      this.logger.error(`Failed to send email to ${user.email}`, error);
    }
  }

  private generateVerificationEmail(token: string): string {
    const url = `${this.webAppUrl}${AppPaths.VERIFY_EMAIL}?token=${token}`;
    return `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Verify your email</h2>
        <p>Welcome to Ruh Therapy! Please click the button below to verify your email address:</p>
        <a href="${url}" style="display: inline-block; background-color: #294c7a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Verify Email</a>
        <p style="margin-top: 20px; font-size: 12px; color: #666;">If you didn't request this, please ignore this email.</p>
      </div>
    `;
  }

  private generateResetPasswordEmail(token: string): string {
    const url = `${this.webAppUrl}${AppPaths.RESET_PASSWORD}?token=${token}`;
    return `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Reset your password</h2>
        <p>We received a request to reset your password. Click the button below to proceed:</p>
        <a href="${url}" style="display: inline-block; background-color: #294c7a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">Reset Password</a>
        <p style="margin-top: 20px; font-size: 12px; color: #666;">If you didn't request this, please ignore this email.</p>
      </div>
    `;
  }
}
