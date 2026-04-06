import { Body, Controller, Post } from '@nestjs/common';
import { SignInDto } from './dtos/signin.dto';

@Controller('auth')
export class AuthController {
    @Post()
    public async signIn(@Body() signInDto: SignInDto){}
}
