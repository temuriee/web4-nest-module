```js
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
export class UsersController {
  //https://localhost:3000/users - method POST
  @Post()
  public createUser(
    @Body() request: any,
    @Headers() headers: any,
    @Ip() ip: string,
  ) {
    console.log(request);
    console.log(headers);
    console.log(ip);

    return 'you send post request to users endpoint';
  }

  //   @Get("/:id/:optionals?")
  //   /:123124123123{/test}

  //   {id:123124123123 }
  @Get('/:id{/:optional}')
  public getUser(
    @Param() param: { id: string; optional?: string },
    @Query() query: Record<string, string>,
    @Query('limit') test: string,
  ) {
    console.log(param);
    console.log(query);
    console.log(test);
    return `Your param with Id is : ${param.id} and optional is: ${param.optional}`;
  }
}

// {
//   id: '123124123123';
//   optional: 'test'; // ?
// }

```
