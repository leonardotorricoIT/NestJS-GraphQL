import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vote } from './entities/vote.entity';
import { CreateVoteInput } from './dto/create-vote.input';
import { Option } from '../option/entities/option.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class VoteService {
  constructor(
    @InjectRepository(Vote) private voteRepo: Repository<Vote>,
    @InjectRepository(Option) private optionRepo: Repository<Option>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async vote(input: CreateVoteInput): Promise<Vote> {
    const { userId, optionId } = input;

    const option = await this.optionRepo.findOne({
      where: { id: optionId },
      relations: ['poll'],
    });
    if (!option) throw new BadRequestException('Option not found');

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new BadRequestException('User not found');

    const existingVote = await this.voteRepo.findOne({
      where: { user: { id: userId }, option: { poll: { id: option.poll.id } } },
      relations: ['option', 'user'],
    });

    if (existingVote) {
      existingVote.option = option;
      return this.voteRepo.save(existingVote);
    }

    const newVote = this.voteRepo.create({
      user,
      option,
    });
    return this.voteRepo.save(newVote);
  }
  async getPollResults(pollId: number) {
    const poll = await this.optionRepo.find({
      where: { poll: { id: pollId } },
      relations: ['votes'],
    });

    return {
      pollId,
      options: poll.map((opt) => ({
        optionId: opt.id,
        text: opt.text,
        votes: opt.votes.length,
      })),
    };
  }
}
