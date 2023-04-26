import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { StandardRoute } from './standardRoute.entity';

@Entity()
export class UpcomingRoute {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
  })
  id?: number;

  @ManyToOne(() => StandardRoute, (entity) => entity, {
    cascade: true,
  })
  @JoinColumn()
  route: StandardRoute;

  @Column({
    name: 'date',
    nullable: false,
    unique: false,
  })
  date: Date;
}
