import { Test, TestingModule } from '@nestjs/testing';
import { VotesResolver } from '../vote.resolver';
import { VoteService } from '../vote.service';
import { Vote } from '../entities/vote.entity';
import { CreateVoteInput } from '../dto/create-vote.input';
import { PubSub } from 'graphql-subscriptions';
import { PollUpdate } from '../../poll/dto/update-poll.input';

jest.mock('graphql-subscriptions', () => {
  const original = jest.requireActual('graphql-subscriptions');
  const pubSubMock = {
    publish: jest.fn(),
    asyncIterator: jest.fn(),
    asyncIterableIterator: jest.fn(),
  };

  return {
    ...original,
    PubSub: jest.fn(() => pubSubMock),
    __pubSubMock: pubSubMock,
  };
});

const { __pubSubMock: pubSubMock } = require('graphql-subscriptions');

describe('VotesResolver', () => {
  let resolver: VotesResolver;
  let service: VoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VotesResolver,
        {
          provide: VoteService,
          useValue: {
            vote: jest.fn(),
            getPollResults: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<VotesResolver>(VotesResolver);
    service = module.get<VoteService>(VoteService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('vote (mutation)', () => {
    it('should save a vote, publish event and return the vote', async () => {
      const input: CreateVoteInput = { userId: 1, optionId: 2 };
      const fakeVote: Partial<Vote> = {
        id: 1,
        createdAt: new Date(),
        option: { id: 2, poll: { id: 99 } } as any,
        user: { id: 1 } as any,
      };
      const fakePollUpdate: PollUpdate = {
        pollId: 99,
        options: [
          { optionId: 2, text: 'Option A', votes: 5 },
          { optionId: 3, text: 'Option B', votes: 2 },
        ],
      };

      (service.vote as jest.Mock).mockResolvedValue(fakeVote);
      (service.getPollResults as jest.Mock).mockResolvedValue(fakePollUpdate);

      const result = await resolver.vote(input);

      expect(service.vote).toHaveBeenCalledWith(input);
      expect(service.getPollResults).toHaveBeenCalledWith(99);
      expect(pubSubMock.publish).toHaveBeenCalledWith('voteAdded', {
        onVote: fakePollUpdate,
      });
      expect(result).toEqual(fakeVote);
    });
  });

  describe('onVote (subscription)', () => {
    it('should return async iterator for voteAdded events', () => {
      const iterator = {};
      (pubSubMock.asyncIterableIterator as jest.Mock).mockReturnValue(iterator);

      const result = resolver.onVote(99);

      expect(result).toBe(iterator);
      expect(pubSubMock.asyncIterableIterator).toHaveBeenCalledWith(
        'voteAdded',
      );
    });
  });
});
