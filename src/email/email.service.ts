import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { OrderedTravelMetadata } from '../journey/orderedTravelMetadata.interface';

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

  async sendTravelConfirmationMail(metadata: OrderedTravelMetadata) {
    const options: Mail.Options = {
      from: 'codetaincabs.service@gmail.com',
      to: metadata.email,
      subject: 'Confirm your travel',
      html: `<p>Click <a href="http://localhost:3000/journey/route/confirm/${metadata.confirmationCode}">here</a> to confirm your travel: </p>
      <p> From: ${metadata.startAddress.street}, ${metadata.startAddress.city}</p>
      <p> To: ${metadata.endAddress.street}, ${metadata.endAddress.city}</p>
      <p> Date: ${metadata.date} </p>
      <p> Price: ${metadata.price.value} ${metadata.price.currency}</p>`,
    };
    return this.nodemailerTransport.sendMail(options);
  }
}
