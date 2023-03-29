import { Role } from '../role/role.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Address } from './adress.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
  })
  id: number;

  @Column({
    name: 'email',
    nullable: false,
    default: '',
    unique: true,
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
    default: new Date('1970-01-01T00:00:01'),
  })
  dateOfBirth: Date;

  @Column({
    name: 'verified',
    nullable: false,
    default: false,
  })
  verified: boolean;

  @ManyToOne(() => Address, (entity) => entity, {
    cascade: true,
  })
  @JoinColumn()
  addressWithCoords: Address;

  @Column({
    name: 'confirmationCode',
    nullable: false,
    default: '',
  })
  confirmationCode: string;

  @OneToOne(() => Role, (entity) => entity.type, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  role: Role;
}
