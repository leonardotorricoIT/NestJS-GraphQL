import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { Poll } from './entities/poll.entity';
import { PollsService } from './poll.service';
import { CreatePollInput } from './dto/create-poll.input';

@Resolver(() => Poll)
export class PollsResolver {
  constructor(private readonly pollsService: PollsService) {}

  @Query(() => [Poll], { name: 'polls' })
  async getAllPolls() {
    return this.pollsService.findAll();
  }

  @Query(() => Poll, { name: 'poll' })
  async getPoll(@Args('id', { type: () => ID }) id: number) {
    return this.pollsService.findOne(id);
  }

  @Mutation(() => Poll)
  async createPoll(@Args('input') input: CreatePollInput) {
    return this.pollsService.create(input);
  }
}
