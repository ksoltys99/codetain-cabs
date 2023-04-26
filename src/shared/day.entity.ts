import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Day {
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
    name: 'order',
  })
  order: number;
}
