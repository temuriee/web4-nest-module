import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { CreatePostDto } from '../dtos/create-post.dto';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,

    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  public async create(createPostDto: CreatePostDto) {
    // იპოვე იუზერი author ID_ის მეშვეობით

    let user = await this.usersRepository.findOneBy({
      id: createPostDto.authorId,
    });

    // პოსტის შექმნა
    let post = this.postsRepository.create({
      ...createPostDto,
      author: user ?? undefined,
    });

    return await this.postsRepository.save(post);
  }

  // http://localhost:3000/posts/1234
  public findAll(userId: string) {
    // const user = findOneById(userId);

    const user = this.usersService.findOneById(userId);

    return [
      {
        userName: user.firstName,
        title: 'Postebis saxeli',
        content: 'postebis agwera',
      },
      {
        userName: user.firstName,
        title: 'Postebis saxeli2',
        content: 'postebis agwera2',
      },
    ];
  }

  public async delete(id: number) {
    await this.postsRepository.delete(id);

    return { delete: true, id };
  }
}
