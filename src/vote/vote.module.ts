import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vote } from './entities/vote.entity';
import { Option } from '../option/entities/option.entity';
import { User } from '../users/entities/user.entity';
import { VoteService } from './vote.service';
import { VotesResolver } from './vote.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Vote, Option, User])],
  providers: [VoteService, VotesResolver],
})
export class VoteModule {}
