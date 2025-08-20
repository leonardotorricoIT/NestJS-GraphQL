import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreatePollInput {
  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [String])
  options: string[];

  @Field(() => ID)
  userId: number;
}
