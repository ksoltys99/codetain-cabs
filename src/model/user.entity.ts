import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'user_id',
  })
  id: number;

  @Column({
    name: 'email_address',
    nullable: false,
    default: '',
  })
  email: string;

  @Column({
    name: 'password',
    nullable: false,
    default: '',
  })
  password: string;

  @Column({
    name: 'name',
    nullable: false,
    default: '',
  })
  name: string;

  @Column({
    name: 'surname',
    nullable: false,
    default: '',
  })
  surname: string;

  @Column({
    name: 'date_of_birth',
    nullable: false,
    default: '',
  })
  dateOfBirth: string;

  @Column({
    name: 'address',
    nullable: false,
    default: '',
  })
  address: string;
}
