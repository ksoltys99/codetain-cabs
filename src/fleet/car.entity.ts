import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { CarState } from './car-state.entity';
import { Price } from '../shared/price.entity';
import { Fleet } from './fleet.enity';

@Entity()
export class Car {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
  })
  id: number;

  @Column({
    name: 'vin',
    nullable: false,
    unique: true,
  })
  vin: string;

  @ManyToOne(() => Price, (entity) => entity, {
    cascade: ['insert', 'update'],
  })
  @JoinColumn()
  price: Price;

  @Column({
    name: 'total_seats',
    nullable: false,
    unique: false,
  })
  totalSeats: number;

  @OneToOne(() => CarState, (entity) => entity, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  state: CarState;

  @ManyToOne(() => Fleet, (entity) => entity)
  @JoinColumn()
  fleet: Fleet;
}
