import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';

@Injectable()
export class PostsService {
  constructor(private readonly usersService: UsersService) {}

  public findAll(userId: string) {
    const user = this.usersService.findOneById(userId);

    return [
      {
        userName: user.firstName,
        title: 'Postebis saxeli',
        content: 'Postebis agwera',
      },
      {
        userName: user.firstName,
        title: 'Postebis saxeli2',
        content: 'Postebis agwera2',
      },
    ];
  }
}
