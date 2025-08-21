import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class OptionResult {
  @Field(() => ID)
  optionId: number;

  @Field()
  text: string;

  @Field(() => Int)
  votes: number;
}

@ObjectType()
export class PollUpdate {
  @Field(() => ID)
  pollId: number;

  @Field(() => [OptionResult])
  options: OptionResult[];
}
