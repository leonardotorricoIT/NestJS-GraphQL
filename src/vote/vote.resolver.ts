import { Resolver, Mutation, Args, Subscription } from '@nestjs/graphql';
import { Vote } from './entities/vote.entity';
import { VoteService } from './vote.service';
import { CreateVoteInput } from './dto/create-vote.input';
import { PubSub, PubSubEngine } from 'graphql-subscriptions';

const pubSub: PubSubEngine = new PubSub();

@Resolver(() => Vote)
export class VotesResolver {
  constructor(private readonly votesService: VoteService) {}

  @Mutation(() => Vote)
  async vote(@Args('input') input: CreateVoteInput) {
    const vote = await this.votesService.vote(input);

    // Notificar cambios en el poll
    pubSub.publish('voteAdded', { onVote: vote.option.poll.id });
    return vote;
  }

  @Subscription(() => String, {
    filter: (payload, variables) => payload.onVote === variables.pollId,
  })
  onVote(@Args('pollId') pollId: number) {
    return pubSub.asyncIterableIterator('voteAdded');
  }
}
