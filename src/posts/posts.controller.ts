import { Controller, Get, Param } from '@nestjs/common';
import { PostsService } from './providers/posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}

  @Get('{/:userId}')
  public getPosts(@Param() userId: string) {
    return this.postService.findAll(userId);
  }
}
