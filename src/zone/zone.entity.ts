import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Zone {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
  })
  id: number;

  @Column({
    name: 'voivodeship',
    nullable: false,
    unique: false,
  })
  voivodeship: string;

  @Column({
    name: 'postal_code_prefix',
    nullable: false,
    unique: true,
  })
  postalCodePrefix: string;
}
