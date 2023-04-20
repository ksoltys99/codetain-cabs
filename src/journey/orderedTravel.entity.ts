import { Car } from '../fleet/car.entity';
import { Price } from '../shared/price.entity';
import { User } from '../user/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StandardRoute } from './standardRoute.entity';

@Entity()
export class OrderedTravel {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
  })
  id?: number;

  @Column({
    name: 'date',
    nullable: false,
    unique: false,
  })
  date: Date;

  @ManyToOne(() => StandardRoute, (entity) => entity, {
    cascade: true,
  })
  @JoinColumn()
  route: StandardRoute;

  @ManyToOne(() => Price, (entity) => entity, {
    cascade: true,
  })
  @JoinColumn()
  price: Price;

  @Column({
    name: 'confirmation_code',
    nullable: false,
    unique: false,
  })
  confirmationCode: string;

  @ManyToOne(() => User, (entity) => entity, {
    cascade: true,
  })
  @JoinColumn()
  user: User;

  @ManyToOne(() => Car, (entity) => entity, {
    cascade: true,
  })
  @JoinColumn()
  car: Car;

  @Column({
    name: 'status',
    nullable: false,
    unique: false,
  })
  status: 'pending' | 'received' | 'confirmed';
}
