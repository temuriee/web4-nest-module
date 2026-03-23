import {
  IsArray,
  IsEnum,
  IsISO8601,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { postStatus } from '../enums/post-type-status';
import { CreatePostMetaOptionsDto } from './create-meta-options.dto';
import { postType } from '../enums/post-type-enum';
import { Type } from 'class-transformer';

export class CreatePostDto {
  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  title: string;

  @IsEnum(postType)
  @IsNotEmpty()
  postType: postType;

  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'A slug should be all small letters and uses only "-" and without spaces. For example "my-url"',
  })
  slug: string;

  @IsEnum(postStatus)
  @IsNotEmpty()
  status: postStatus;

  @IsOptional()
  @IsString()
  content: string;

  @IsOptional()
  @IsJSON()
  schema: string;

  @IsOptional()
  @IsUrl()
  featuredImageUrl: string;

  @IsISO8601()
  @IsOptional()
  publishOn: Date;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @MinLength(3, { each: true })
  tags: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePostMetaOptionsDto)
  metaOptions: CreatePostMetaOptionsDto[];
}
