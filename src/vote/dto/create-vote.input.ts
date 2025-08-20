import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateVoteInput {
  @Field(() => ID)
  userId: number;

  @Field(() => ID)
  optionId: number;
}
