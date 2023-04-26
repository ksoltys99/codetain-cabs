import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Address } from '../shared/address.entity';
import { Day } from '../shared/day.entity';

@Entity()
export class StandardRoute {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
  })
  id: number;

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
    name: 'distance',
    nullable: false,
    unique: false,
  })
  distance: number;

  @Column({
    name: 'duration',
    nullable: false,
    unique: false,
  })
  duration: string;

  @ManyToOne(() => Day, (entity) => entity, {
    cascade: true,
  })
  @JoinColumn()
  day: Day;

  @Column({
    name: 'hour',
    nullable: false,
    unique: false,
  })
  hour: string;
}
