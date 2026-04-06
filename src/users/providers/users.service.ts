import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  RequestTimeoutException,
} from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UsersCreateManyProvider } from './users-create-many.provider';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    // Inject UsersCreateManyProvider
    private readonly usersCreateManyProvider: UsersCreateManyProvider,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    let existingUser: User | null = null;

    try {
      existingUser = await this.usersRepository.findOne({
        where: { email: createUserDto.email },
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process request at this time, please try again later',
        {
          description: 'Error conneting to the database',
        },
      );
    }

    if (existingUser) {
      throw new BadRequestException('User with email already exists', {
        description: `User with ${createUserDto.email} already exists`,
      });
    }

    let newUser = this.usersRepository.create(createUserDto);

    try {
      newUser = await this.usersRepository.save(newUser);
    } catch (error) {
      throw new RequestTimeoutException(
        'unable to process request at this time, please try again later',
        { description: 'Error connecting to the database' },
      );
    }

    return newUser;
  }

  // Method to find all Users
  public findAll(
    getUserParamDto: GetUsersParamDto,
    limit: number,
    page: number,
  ) {
    return [
      {
        firstName: 'John',
        email: 'john@doe.com',
      },
      {
        firstName: 'Alice',
        email: 'alice@doe.com',
      },
    ];
  }

  //   Find user by id
  public async findOneById(id: number) {
    let user: User | null = null;

    try {
      user = await this.usersRepository.findOneBy({
        id,
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process request at this time, please try again later',
        {
          description: 'Error conneting to the database',
        },
      );
    }

    if (!user) {
      throw new InternalServerErrorException('user not found', {
        description: `User with id ${id} not found`,
      });
    }

    return user;
  }

  public async createMany(createUsersDto: CreateManyUsersDto) {
    return this.usersCreateManyProvider.UsersCreateManyProvider(createUsersDto);
  }
}
