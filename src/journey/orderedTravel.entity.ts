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
import { Address } from '../shared/address.entity';

@Entity()
export class OrderedTravel {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
  })
  id?: number;

  @ManyToOne(() => Address, (entity) => entity, {
    cascade: true,
  })
  @JoinColumn()
  startAddress: Address;

  @ManyToOne(() => Address, (entity) => entity, {
    cascade: true,
  })
  @JoinColumn()
  endAddress: Address;

  @Column({
    name: 'distance_in_km',
    nullable: false,
    unique: false,
  })
  distanceInKm: number;

  @Column({
    name: 'date',
    nullable: false,
    unique: false,
  })
  date: Date;

  @Column({
    name: 'duration',
    nullable: false,
    unique: false,
  })
  duration: string;

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
