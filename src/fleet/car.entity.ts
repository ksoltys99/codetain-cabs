import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Car {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
  })
  id: number;

  @Column({
    name: 'vim',
    nullable: false,
    unique: true,
  })
  vin: string;

  @Column({
    name: 'current_location',
    nullable: false,
    unique: false,
  })
  currentLocation: string;

  @Column({
    name: 'price_per_km_PLN',
    nullable: false,
    unique: false,
  })
  pricePerKmPLN: number;

  @Column({
    name: 'total_seats',
    nullable: false,
    unique: false,
  })
  totalSeats: number;

  @Column({
    name: 'taken_seats',
    nullable: false,
    unique: false,
    default: 0,
  })
  takenSeats: number;

  @Column({
    name: 'is_available',
    nullable: false,
    unique: false,
    default: true,
  })
  isAvailable: boolean;
}
