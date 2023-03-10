import { Dependencies, Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { DatabaseModule } from './database/database.module';

@Dependencies(DataSource)
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UserModule,
    AuthModule,
    EmailModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
