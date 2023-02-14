import {
  Entity,
  BaseEntity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import * as moment from 'moment';
import { instanceToPlain, Transform } from 'class-transformer';
import { UserLineStatus } from '../user-line.types';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { LineEntity } from 'src/modules/line/entities/line.entity';

@Entity({ name: 'user_lines' })
export class UserLineEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  label: string;

  @Column({
    type: 'enum',
    enum: UserLineStatus,
    default: UserLineStatus.PENDING,
  })
  status: UserLineStatus;

  @Column({ nullable: true })
  note: string;

  @Column({ default: false })
  deleted: boolean;

  @CreateDateColumn()
  @Transform(({ value }) => moment(value).unix())
  createdAt: number;

  @UpdateDateColumn()
  @Transform(({ value }) => moment(value).unix())
  updatedAt: number;

  @OneToOne(() => LineEntity, (line) => line.userLine, {
    nullable: true,
    eager: true,
  })
  @JoinColumn({ name: 'lineId' })
  line: LineEntity;

  @ManyToOne(() => UserEntity, (UserEntity) => UserEntity.lines, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  toJSON() {
    return instanceToPlain(this);
  }
}
