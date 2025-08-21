import { Test, TestingModule } from '@nestjs/testing';
import { PollsResolver } from '../poll.resolver';
import { PollsService } from '../poll.service';
import { Poll } from '../entities/poll.entity';
import { CreatePollInput } from '../dto/create-poll.input';

describe('PollsResolver', () => {
  let resolver: PollsResolver;
  let service: PollsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PollsResolver,
        {
          provide: PollsService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<PollsResolver>(PollsResolver);
    service = module.get<PollsService>(PollsService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getAllPolls', () => {
    it('should return all polls', async () => {
      const polls: Partial<Poll>[] = [
        { id: 1, title: 'Poll A', description: 'Desc A' },
        { id: 2, title: 'Poll B', description: 'Desc B' },
      ];

      (service.findAll as jest.Mock).mockResolvedValue(polls);

      expect(await resolver.getAllPolls()).toEqual(polls);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('getPoll', () => {
    it('should return a poll by id', async () => {
      const poll: Partial<Poll> = {
        id: 1,
        title: 'Poll A',
        description: 'Desc A',
      };

      (service.findOne as jest.Mock).mockResolvedValue(poll);

      expect(await resolver.getPoll(1)).toEqual(poll);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('createPoll', () => {
    it('should create a poll', async () => {
      const input: CreatePollInput = {
        title: 'New Poll',
        description: 'Some description',
        userId: 1,
        options: ['Option 1', 'Option 2'],
      };

      const createdPoll: Partial<Poll> = {
        id: 3,
        title: input.title,
        description: input.description,
      };

      (service.create as jest.Mock).mockResolvedValue(createdPoll);

      expect(await resolver.createPoll(input)).toEqual(createdPoll);
      expect(service.create).toHaveBeenCalledWith(input);
    });
  });
});
