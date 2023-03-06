import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Role {
  constructor(type: 'user' | 'admin') {
    this.type = type;
  }

  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
  })
  id: number;

  @Column({
    name: 'role',
    nullable: false,
    default: 'user',
  })
  type: 'user' | 'admin';
}
