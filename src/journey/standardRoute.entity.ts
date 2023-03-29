import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class StandardRoute {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
  })
  id: number;

  @Column({
    name: 'start_address',
    nullable: false,
    unique: false,
  })
  startAddress: string;

  @Column({
    name: 'end_address',
    nullable: false,
    unique: false,
  })
  endAddress: string;

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
  travelTime: string;

  @Column({
    name: 'price',
    nullable: false,
    unique: false,
  })
  price: string;
}
