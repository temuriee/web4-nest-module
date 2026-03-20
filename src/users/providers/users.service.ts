import { Injectable } from '@nestjs/common';
import { GetUsersParamDto } from '../dtos/get-users-param.dto';

@Injectable()
export class UsersService {
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
  public findOneById(id: number) {
    return {
      id: 1234,
      firstName: 'Mindia',
      email: 'Mindia@gmail.com',
    };
  }
}
