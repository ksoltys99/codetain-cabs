import { Role } from '../role/role.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
    name: 'address',
    nullable: false,
    default: '',
  })
  address: string;

  @Column({
    name: 'coords_lat',
    nullable: true,
  })
  coordsLat: string;

  @Column({
    name: 'coords_lng',
    nullable: true,
  })
  coordsLng: string;

  @Column({
    name: 'verified',
    nullable: false,
    default: false,
  })
  verified: boolean;

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
