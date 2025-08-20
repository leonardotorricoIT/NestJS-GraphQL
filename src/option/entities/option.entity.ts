import { Field, ObjectType, ID } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Poll } from '../../poll/entities/poll.entity';
import { Vote } from '../../vote/entities/vote.entity';

@ObjectType()
@Entity()
export class Option {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  text: string;

  @Field(() => Poll)
  @ManyToOne(() => Poll, (poll) => poll.options)
  poll: Poll;

  @Field(() => [Vote])
  @OneToMany(() => Vote, (vote) => vote.option)
  votes: Vote[];
}
