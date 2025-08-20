import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Poll } from './entities/poll.entity';
import { CreatePollInput } from './dto/create-poll.input';
import { Option } from '../option/entities/option.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PollsService {
  constructor(
    @InjectRepository(Poll) private pollRepo: Repository<Poll>,
    @InjectRepository(Option) private optionRepo: Repository<Option>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async findAll(): Promise<Poll[]> {
    return this.pollRepo.find({
      relations: ['createdBy', 'options', 'options.votes'],
    });
  }

  async findOne(id: number): Promise<Poll | null> {
    return this.pollRepo.findOne({
      where: { id },
      relations: ['createdBy', 'options', 'options.votes'],
    });
  }

  async create(input: CreatePollInput): Promise<Poll> {
    if (input.options.length < 2) {
      throw new BadRequestException('Poll must have at least 2 options');
    }

    const user = await this.userRepo.findOne({ where: { id: input.userId } });
    if (!user) throw new BadRequestException('User not found');

    const poll = this.pollRepo.create({
      title: input.title,
      description: input.description,
      createdBy: user,
    });
    const savedPoll = await this.pollRepo.save(poll);
    const options = input.options.map((text) =>
      this.optionRepo.create({ text, poll: savedPoll }),
    );
    await this.optionRepo.save(options);

    const pollWithOptions = await this.findOne(savedPoll.id);
    if (!pollWithOptions) {
      throw new BadRequestException('Poll could not be found after creation');
    }
    return pollWithOptions;
  }
}
