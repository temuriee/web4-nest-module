# 🧩 What Is `class-validator`?

👉 **`class-validator`** is a **library** (an npm package) that allows you to add **validation rules to TypeScript classes using decorators**.

It’s not built by Nest.js, but Nest.js integrates with it perfectly.

---

## 🧠 Simple explanation

Remember how a **DTO** is a “form” that describes your data shape?

`class-validator` gives you **stickers** (decorators) you can put on that form to say things like:

* “This field must be a string.”
* “This email must look valid.”
* “This number must be greater than 0.”

If any of these rules fail, Nest’s **ValidationPipe** automatically throws a validation error (400 Bad Request).

---

## ⚙️ Installing it

You normally install both packages together:

```bash
npm install class-validator class-transformer
```

> 🧠 `class-transformer` helps turn plain JSON objects into class instances — so `class-validator` can work on them.

---

## 📦 Example — Using `class-validator` in a DTO

```ts
// create-user.dto.ts
import { IsString, IsEmail, Length, IsInt, Min } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(2, 30)
  name: string;

  @IsEmail()
  email: string;

  @IsInt()
  @Min(18)
  age: number;
}
```

Now this class says:

* `name` must be a string of length 2–30
* `email` must look like a valid email
* `age` must be an integer ≥ 18

---

## 🧩 Then use it in your controller

```ts
import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';

@Controller('users')
export class UserController {
  @Post()
  create(@Body() dto: CreateUserDto) {
    return dto;
  }
}
```

✅ If you have a **global `ValidationPipe`** (set in `main.ts`),
this automatically triggers validation on `dto`.

```ts
app.useGlobalPipes(
  new ValidationPipe({ whitelist: true, transform: true })
);
```

---

## 🧪 Example request

### ✅ Valid request

```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "age": 22
}
```

Response:

```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "age": 22
}
```

### ❌ Invalid request

```json
{
  "name": "A",
  "email": "not-an-email",
  "age": "abc"
}
```

Response:

```json
{
  "statusCode": 400,
  "message": [
    "name must be longer than or equal to 2 characters",
    "email must be an email",
    "age must be an integer number"
  ],
  "error": "Bad Request"
}
```

Boom 💥 — all handled automatically by `class-validator` + `ValidationPipe`.

---

## 🧱 Express Equivalent

In **Express**, you would need to manually validate using `express-validator` or `Joi`.

```js
import { body, validationResult } from 'express-validator';

app.post(
  '/users',
  [
    body('name').isLength({ min: 2, max: 30 }),
    body('email').isEmail(),
    body('age').isInt({ min: 18 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    res.send(req.body);
  }
);
```

So Nest.js + `class-validator` basically **replace this repetitive validation logic** with a **clean, declarative, class-based system**.

---

## 🧠 How it works under the hood

When you call:

```ts
@Body() dto: CreateUserDto
```

Nest’s `ValidationPipe` does something like this:

1. Takes the plain request body (`req.body`).
2. Uses **`class-transformer`** to create an instance of `CreateUserDto`.
3. Passes that instance to **`class-validator`**.
4. `class-validator` looks for decorators (`@IsString`, `@Min`, etc.) and checks each field.
5. If any rule fails → throws a `BadRequestException` (400).
6. Otherwise, passes the validated `dto` to your controller.

---

## 🧰 Commonly used decorators

| Decorator                     | Meaning                                         |
| ----------------------------- | ----------------------------------------------- |
| `@IsString()`                 | Must be a string                                |
| `@IsInt()`                    | Must be an integer                              |
| `@IsEmail()`                  | Must be a valid email                           |
| `@IsBoolean()`                | Must be true or false                           |
| `@Min(value)` / `@Max(value)` | Numeric limits                                  |
| `@Length(min, max)`           | String length                                   |
| `@IsOptional()`               | Optional field (won’t throw if missing)         |
| `@IsArray()`                  | Must be an array                                |
| `@ValidateNested()`           | Validate nested objects (with DTOs inside DTOs) |

---

## ⚖️ Summary

| Concept               | Purpose                                  | Who handles it           |
| --------------------- | ---------------------------------------- | ------------------------ |
| **DTO**               | Defines the *shape* of your data         | You create it            |
| **class-validator**   | Checks if data *matches the rules*       | Library (via decorators) |
| **ValidationPipe**    | Connects Nest with class-validator       | Nest.js feature          |
| **class-transformer** | Converts plain objects → class instances | Helper library           |

---

## 🧠 In short:

> 🧩 `class-validator` lets you **put validation rules directly on your DTO class**.
> Nest’s **ValidationPipe** automatically uses those rules to **validate incoming data** before it reaches your controller.

