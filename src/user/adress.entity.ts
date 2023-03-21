import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Address {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
  })
  id?: number;

  @Column({
    name: 'name',
    nullable: false,
    unique: true,
  })
  name: string;

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
}
