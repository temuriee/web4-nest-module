import {
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../user.entity';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';

@Injectable()
export class UsersCreateManyProvider {
  constructor(
    // Inject datasource to handle database connection errors
    private readonly dataSource: DataSource,
  ) {}

  public async UsersCreateManyProvider(createManyUsersDto: CreateManyUsersDto) {
    let newUsers: User[] = [];

    // Create Query runner intstance
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      // Connect queryRunner to the database
      await queryRunner.connect();

      // Start Transaction
      await queryRunner.startTransaction();
    } catch (error) {
      throw new RequestTimeoutException('Could not connect to the database');
    }

    // Perform the transaction
    try {
      // Try to insert Many Users
      for (const user of createManyUsersDto.users) {
        let newUser = queryRunner.manager.create(User, user);
        let result = await queryRunner.manager.save(newUser);
        newUsers.push(result);
      }

      // If Successful, Commit transaction
      await queryRunner.commitTransaction();
    } catch (error) {
      // If error, rollback transaction
      await queryRunner.rollbackTransaction();
      throw new ConflictException('Could not complete the transaction', {
        description: String(error),
      });
    } finally {
      try {
        // Finally Release query runner
        await queryRunner.release();
      } catch (error) {
        throw new RequestTimeoutException(
          'Could not release the query runner connection',
        );
      }
    }

    return newUsers;
  }
}
