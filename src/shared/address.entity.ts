import { Zone } from '../zone/zone.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Address {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
  })
  id?: number;

  @Column({
    name: 'city',
    unique: false,
  })
  city: string;

  @Column({
    name: 'postal_code',
    unique: false,
  })
  postalCode: string;

  @Column({
    name: 'street',
    unique: false,
  })
  street: string;

  @Column({
    name: 'building',
    unique: false,
  })
  building: string;

  @Column({
    name: 'coords_lat',
    nullable: false,
  })
  coordsLat: string;

  @Column({
    name: 'coords_lng',
    nullable: false,
  })
  coordsLng: string;

  @ManyToOne(() => Zone, (entity) => entity)
  @JoinColumn()
  zone?: Zone;
}
