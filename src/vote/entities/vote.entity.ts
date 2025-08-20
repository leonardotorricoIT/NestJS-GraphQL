import { Field, ObjectType, ID } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Option } from '../../option/entities/option.entity';

@ObjectType()
@Entity()
export class Vote {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.votes)
  user: User;

  @Field(() => Option)
  @ManyToOne(() => Option, (option) => option.votes)
  option: Option;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
