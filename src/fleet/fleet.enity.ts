import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Car } from './car.entity';

@Entity()
export class Fleet {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
  })
  id: number;

  @Column({
    name: 'city',
    nullable: false,
    unique: true,
  })
  city: string;

  @OneToMany(() => Car, (entity) => entity)
  @JoinColumn()
  cars: Car[];
}
