import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('mindia')
export class AppController {
  constructor(private readonly appService: AppService) {}

  // https://localhost:3000/mindia/hello
  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }
}
