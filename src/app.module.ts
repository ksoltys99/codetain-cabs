import { Dependencies, Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { DatabaseModule } from './database/database.module';
import { AdministrationModule } from './administration/administration.module';
import { JourneyModule } from './journey/journey.module';
import { MapsModule } from './maps/maps.module';

@Dependencies(DataSource)
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UserModule,
    AuthModule,
    EmailModule,
    DatabaseModule,
    AdministrationModule,
    JourneyModule,
    MapsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
