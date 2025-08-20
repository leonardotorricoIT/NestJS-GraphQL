import { Field, ObjectType, ID } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Option } from '../../option/entities/option.entity';

@ObjectType()
@Entity()
export class Poll {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  title: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.polls, { eager: true })
  createdBy: User;

  @Field(() => [Option])
  @OneToMany(() => Option, (option) => option.poll, { cascade: true })
  options: Option[];
}
