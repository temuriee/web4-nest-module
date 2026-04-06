import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { SignInDto } from '../dtos/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    // Injecting UserService
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

   public signIn(signInDto: SignInDto){
    
   }


  public login(email: string, password: string, id: number) {
    const user = this.usersService.findOneById(id);

    return 'Simple Token';
  }

  public isAuth() {
    return true;
  }
}
