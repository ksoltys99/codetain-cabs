import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Price {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
  })
  id?: number;

  @Column({
    name: 'value',
    nullable: false,
  })
  value: number;

  @Column({
    name: 'currency',
    default: 'PLN',
  })
  currency: string;
}
