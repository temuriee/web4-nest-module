import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { HashingProvider } from './hashing.provider';
import { SignInDto } from '../dtos/signin.dto';

@Injectable()
export class SignInProvider {
  constructor(
    // Inject UserService
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    // Hashing Provider
    private readonly hashingProvider: HashingProvider,
  ) {}

  public async signIn(signInDto: SignInDto) {
    // find user by email ID
    let user = await this.usersService.findOneByEmail(signInDto.email);
    // Throw exception if user is not found
    // Above | Taken care by the findInByEmail method

    let isEqual: boolean = false;

    try {
      // Compare the password to hash
      isEqual = await this.hashingProvider.comparePassword(
        signInDto.password, // პაროლი რაც იუზერმა შეიყვანა
        user.password, // ბაზაში არსებული დაჰეშილი პაროლი რომელიც ვიპოვეთ findOneByEmail-სერვისით
      );
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Could not compare the password',
      });
    }

    if (!isEqual) {
      throw new UnauthorizedException('Password does not match');
    }

    // Send confirmation
    return true;
  }
}
