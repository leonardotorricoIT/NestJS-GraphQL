import { Field, ObjectType, ID } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { Poll } from '../../poll/entities/poll.entity';
import { Vote } from '../../vote/entities/vote.entity';

@ObjectType()
@Entity()
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  username: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => [Poll])
  @OneToMany(() => Poll, (poll) => poll.createdBy)
  polls: Poll[];

  @Field(() => [Vote])
  @OneToMany(() => Vote, (vote) => vote.user)
  votes: Vote[];
}
