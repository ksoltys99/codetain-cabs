import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CarState {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
  })
  id: number;

  @Column({
    name: 'current_location',
    nullable: false,
    unique: false,
  })
  currentLocation: string;

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
