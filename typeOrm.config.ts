import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { User } from './src/user/user.entity';
import { Role } from './src/role/role.entity';
import { Address } from './src/shared/address.entity';
import { Zone } from './src/zone/zone.entity';
import { Car } from './src/fleet/car.entity';
import { StandardRoute } from './src/journey/standardRoute.entity';
import { OrderedTravel } from './src/journey/orderedTravel.entity';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USER'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  entities: [User, Role, Zone, Address, Car, StandardRoute, OrderedTravel],
});
