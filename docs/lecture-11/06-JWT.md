## 🧠 Why two `{}` blocks?

When we call `jwtService.signAsync(...)`, the function has **two parameters**:

```ts
jwtService.signAsync(payload, options);
```

So you see **two `{}`** because:

- The **first `{}`** is the **payload** — what goes _inside the token_.
- The **second `{}`** is the **signing options** — how the token should be generated (expiration, secret, issuer, etc).

That’s why you don’t put everything in the first one — the second one controls behavior.

---

### Example visually:

```ts
await jwtService.signAsync(
  // 🟢 1️⃣ Payload (data inside the token)
  {
    sub: user.id,
    email: user.email,
  },
  // 🟣 2️⃣ Options (metadata for signing)
  {
    secret: 'mySuperSecretKey123',
    expiresIn: '1h',
    issuer: 'my-nest-api',
    audience: 'my-react-client',
  },
);
```

---

## ✅ Temporary version of your `signIn` method

Here’s a clean **temporary hardcoded** version (no config or `.env`), still using audience and issuer:

```ts
import {
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { SignInDto } from '../dtos/signin.dto';
import { HashingProvider } from './hashing.provider';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SignInProvider {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    private readonly hashingProvider: HashingProvider,
    private readonly jwtService: JwtService,
  ) {}

  public async signIn(signInDto: SignInDto) {
    const user = await this.usersService.findOneByEmail(signInDto.email);

    let isEqual = false;

    try {
      isEqual = await this.hashingProvider.comparePassword(
        signInDto.password,
        user.password,
      );
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Could not compare the password',
      });
    }

    if (!isEqual) {
      throw new UnauthorizedException('Password does not match');
    }

    // ✅ Hardcoded JWT signing options
    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
      },
      {
        secret: 'mySuperSecretKey123',
        expiresIn: '1h', // token valid for 1 hour
        issuer: 'my-nest-api', // identifies your backend
        audience: 'my-react-client', // identifies your frontend
      },
    );

    return { accessToken };
  }
}
```

---

## 🧩 What happens under the hood

After signing, the **payload inside the token** will automatically include the standard JWT claims:

```json
{
  "sub": "1",
  "email": "test@example.com",
  "iss": "my-nest-api",
  "aud": "my-react-client",
  "iat": 1730554000, // issued at
  "exp": 1730557600 // expires in 1h
}
```

---

## TL;DR Summary

| Part       | Description                | Example                                   |
| ---------- | -------------------------- | ----------------------------------------- |
| 1st `{}`   | Payload → your data        | `{ sub: user.id, email: user.email }`     |
| 2nd `{}`   | Options → signing behavior | `{ secret, expiresIn, issuer, audience }` |
| `issuer`   | Who made the token         | `"my-nest-api"`                           |
| `audience` | Who it’s for               | `"my-react-client"`                       |
