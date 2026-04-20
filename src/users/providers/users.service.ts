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
import { CreateUserProvider } from './create-user.provider';
import { FindOneUserByEmailProvider } from './find-one-user-by-email.provider';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    // Inject UsersCreateManyProvider
    private readonly usersCreateManyProvider: UsersCreateManyProvider,

    // Inject Create User Provider
    private readonly createUserProvider: CreateUserProvider,

    /**
     * Inject findOneUserByEmailProvider
     */
    private readonly findOneUserByEmailProvider: FindOneUserByEmailProvider,
  ) {}

  public async createUser(createUserDto: CreateUserDto) {
    return await this.createUserProvider.createUser(createUserDto);
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

  // Finds one user by email
  public async findOneByEmail(email: string) {
    return await this.findOneUserByEmailProvider.findOneByEmail(email);
  }
}
