import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';
import { IsInt, IsNotEmpty } from 'class-validator';

export class PatchPostDto extends PartialType(CreatePostDto) {
  @ApiProperty({
    description: 'The unique identifier of the post to be updated.',
    example: 123,
  })
  @IsInt()
  @IsNotEmpty()
  id: number;
}
