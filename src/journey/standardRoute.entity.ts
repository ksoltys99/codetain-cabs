import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Address } from 'src/shared/address.entity';

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
  distance: string;

  @Column({
    name: 'travel_time',
    nullable: false,
    unique: false,
  })
  duration: string;

  @Column({
    name: 'price',
    nullable: false,
    unique: false,
  })
  price: string;
}
