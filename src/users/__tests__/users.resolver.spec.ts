import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from '../users.resolver';
import { UsersService } from '../users.service';
import { User } from '../entities/user.entity';
import { CreateUserInput } from '../dto/create-user.input';

describe('UsersResolver', () => {
  let resolver: UsersResolver;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
    service = module.get<UsersService>(UsersService);
  });

  it('should return all users', async () => {
    const users: Partial<User>[] = [
      { id: 1, username: 'Alice', email: 'alice@mail.com' },
      { id: 2, username: 'Bob', email: 'bob@mail.com' },
    ];
    (service.findAll as jest.Mock).mockResolvedValue(users);

    expect(await resolver.getAllUsers()).toEqual(users);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return a user by id', async () => {
    const user: User = {
      id: 1,
      username: 'Alice',
      email: 'alice@mail.com',
    } as User;

    (service.findOne as jest.Mock).mockResolvedValue(user);

    expect(await resolver.getUserById(1)).toEqual(user);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should create a user', async () => {
    const input: CreateUserInput = {
      username: 'Charlie',
      email: 'charlie@mail.com',
    };
    const createdUser: User = { id: 3, ...input } as User;

    (service.create as jest.Mock).mockResolvedValue(createdUser);

    expect(await resolver.createUser(input)).toEqual(createdUser);
    expect(service.create).toHaveBeenCalledWith(input);
  });
});
