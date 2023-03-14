import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Zone {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
  })
  id: number;

  @Column({
    name: 'name',
    nullable: false,
    unique: true,
  })
  name: string;

  @Column({
    name: 'postal_code',
    nullable: false,
    unique: true,
  })
  postalCode: string;
}
