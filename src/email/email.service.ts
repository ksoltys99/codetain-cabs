import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';

@Injectable()
export class EmailService {
  private nodemailerTransport: Mail;

  constructor(
    private readonly configService: ConfigService,
    private jwtService: JwtService,
  ) {
    this.nodemailerTransport = createTransport({
      service: configService.get('EMAIL_SERVICE'),
      auth: {
        user: configService.get('EMAIL_USER'),
        pass: configService.get('EMAIL_PASSWORD'),
      },
    });
  }

  async sendConfirmationMail(user: User) {
    const options: Mail.Options = {
      from: 'codetaincabs.service@gmail.com',
      to: user.email,
      subject: 'Confirm your account',
      html: `<p>Click <a href="http://localhost:3000/auth/activate/${user.confirmationCode}">here</a> to activate the account: </p>`,
    };
    return this.nodemailerTransport.sendMail(options);
  }

  async sendDeletionMail(email: string) {
    const options: Mail.Options = {
      from: 'codetaincabs.service@gmail.com',
      to: email,
      subject: 'Account deleted',
      html: `<p>Your account has been deleted</p>`,
    };
    return this.nodemailerTransport.sendMail(options);
  }

  async createActivationLink(email: string, id: number) {
    const token = this.jwtService.sign({ username: email, sub: id });
    return token;
  }
}
