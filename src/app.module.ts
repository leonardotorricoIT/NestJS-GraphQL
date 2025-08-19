import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import databaseConfig from './database/database.config';
import { DatabaseModule } from './database/database.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      graphiql: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      installSubscriptionHandlers: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      envFilePath: '.env',
    }),
    DatabaseModule,
    UsersModule,
  ],
})
export class AppModule {}
