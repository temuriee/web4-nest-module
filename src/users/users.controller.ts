import {
  Body,
  Controller,
  Get,
  Headers,
  Ip,
  Param,
  Post,
  Query,
} from '@nestjs/common';

@Controller('users')
export class UsersController {}

// {
//   id: '123124123123';
//   optional: 'test'; // ?
// }
