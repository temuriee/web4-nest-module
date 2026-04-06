import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { User } from '../user.entity';

@Injectable()
export class UsersCreateManyProvider {
  constructor(
    // Inject datasource to handle database connection errors
    private readonly dataSource: DataSource,
  ) {}

  public async UsersCreateManyProvider(createUsersDto: CreateUserDto[]) {
    let newUsers: User[] = [];

    // Create Query runner intstance
    const queryRunner = this.dataSource.createQueryRunner();

    // Connect queryRunner to the database
    await queryRunner.connect();

    // Start Transaction
    await queryRunner.startTransaction();

    // Perform the transaction
    try {
      // Try to insert Many Users
      for (const user of createUsersDto) {
        let newUser = queryRunner.manager.create(User, user);
        let result = await queryRunner.manager.save(newUser);
        newUsers.push(result);
      }

      // If Successful, Commit transaction
      await queryRunner.commitTransaction();
    } catch (error) {
      // If error, rollback transaction
      await queryRunner.rollbackTransaction();
    } finally {
      // Finally Release query runner
      await queryRunner.release();
    }

    return newUsers;
  }
}
