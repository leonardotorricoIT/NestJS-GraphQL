import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Poll } from './entities/poll.entity';
import { Option } from '../option/entities/option.entity';
import { User } from '../users/entities/user.entity';
import { PollsService } from './poll.service';
import { PollsResolver } from './poll.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Poll, Option, User])],
  providers: [PollsService, PollsResolver],
  exports: [PollsService],
})
export class PollsModule {}
