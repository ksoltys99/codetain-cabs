import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from '../user/user.entity';
import { Role } from '../role/role.entity';
import { Zone } from '../journey/zone.entity';
import { Address } from '../shared/address.entity';
import { Car } from '../fleet/car.entity';
import { StandardRoute } from '../journey/standardRoute.entity';
import { OrderedTravel } from '../journey/orderedTravel.entity';
import { Price } from '../shared/price.entity';
import { CarState } from '../fleet/car-state.entity';
import { Fleet } from '../fleet/fleet.enity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [
          User,
          Role,
          Zone,
          Address,
          Car,
          StandardRoute,
          OrderedTravel,
          Price,
          CarState,
          Fleet,
        ],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
