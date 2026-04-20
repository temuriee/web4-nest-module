import {
  BadRequestException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { CreatePostDto } from '../dtos/create-post.dto';
import { GetPostsDto } from '../dtos/get-posts.dto';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';
import { TagsService } from 'src/tags/providers/tags.service';
import { Paginated } from 'src/common/pagination/interfaces/paginated.interface';
import { PatchPostDto } from '../dtos/patch-post.dto';
import { Tag } from 'src/tags/tag.entity';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,

    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private readonly tagsService: TagsService,

    private readonly paginationProvider: PaginationProvider,
  ) {}

  /**
   * Method to create a new post
   */
  public async create(createPostDto: CreatePostDto) {
    let author = await this.usersService.findOneById(createPostDto.authorId);

    let tags = await this.tagsService.findMultipleTags(
      createPostDto.tags ?? [],
    );

    // Create the post
    let post = this.postsRepository.create({
      ...createPostDto,
      author: author,
      tags: tags,
      metaOptions: createPostDto.metaOptions ? [createPostDto.metaOptions] : [],
    });

    return await this.postsRepository.save(post);
  }

  // http://localhost:3000/posts/1234
  public async findAll(
    postQuery: GetPostsDto,
    userId: string,
  ): Promise<Paginated<Post>> {
    let posts = await this.paginationProvider.paginateQuery(
      {
        limit: postQuery.limit,
        page: postQuery.page,
      },
      this.postsRepository,
    );

    return posts;
  }

  public async delete(id: number) {
    await this.postsRepository.delete(id);

    return { delete: true, id };
  }

  /**
   * Method to Update a post
   */
  public async update(patchPostDto: PatchPostDto) {
    //  tags which fetched from the database
    let tags: Tag[] = [];
    //  post which fetched from the database
    let post: Post | null = null;

    try {
      tags = await this.tagsService.findMultipleTags(patchPostDto.tags ?? []);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process request at this time, please try again later.',
        {
          description: 'Error connecting to the database.',
        },
      );
    }

    // number of tags need to be equal

    if (!tags || tags.length !== (patchPostDto.tags ?? []).length) {
      throw new BadRequestException('One or more tags are invalid.', {
        description: `One or more tags provided are invalid.`,
      });
    }

    // Find the post
    try {
      post = await this.postsRepository.findOneBy({
        id: patchPostDto.id,
      });
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process request at this time, please try again later.',
        {
          description: 'Error connecting to the database.',
        },
      );
    }

    if (!post) {
      throw new BadRequestException('Post does not exist.', {
        description: `Post with id ${patchPostDto.id} does not exist.`,
      });
    }

    // Update the post details
    post.title = patchPostDto.title ?? post.title;
    post.content = patchPostDto.content ?? post.content;
    post.status = patchPostDto.status ?? post.status;
    post.slug = patchPostDto.slug ?? post.slug;
    post.featuredImageUrl =
      patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
    post.publishOn = patchPostDto.publishOn ?? post.publishOn;

    // Update the tags
    post.tags = tags;

    try {
      await this.postsRepository.save(post);
    } catch (error) {
      throw new RequestTimeoutException(
        'Unable to process request at this time, please try again later.',
        {
          description: 'Error connecting to the database.',
        },
      );
    }

    return post;
  }
}
