import { Resolver, Mutation, Args, Subscription } from '@nestjs/graphql';
import { Vote } from './entities/vote.entity';
import { VoteService } from './vote.service';
import { CreateVoteInput } from './dto/create-vote.input';
import { PubSub, PubSubEngine } from 'graphql-subscriptions';
import { PollUpdate } from 'src/poll/dto/update-poll.input';

const pubSub: PubSubEngine = new PubSub();

@Resolver(() => Vote)
export class VotesResolver {
  constructor(private readonly votesService: VoteService) {}

  @Mutation(() => Vote)
  async vote(@Args('input') input: CreateVoteInput) {
    const vote = await this.votesService.vote(input);

    const poll = await this.votesService.getPollResults(vote.option.poll.id);

    await pubSub.publish('voteAdded', { onVote: poll });

    return vote;
  }

  @Subscription(() => PollUpdate, {
    filter: (payload, variables) => payload.onVote.pollId === variables.pollId,
  })
  onVote(@Args('pollId') pollId: number) {
    return pubSub.asyncIterableIterator('voteAdded');
  }
}
