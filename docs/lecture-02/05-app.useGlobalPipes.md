

# 🌍 What is `app.useGlobalPipes()` in Nest.js?

It’s a **Nest.js method that tells the app:**

> “Hey, before any request reaches any controller — run these *pipes* for *every route in the whole app*.”

In other words:

* You can apply pipes **per route**, **per controller**, or **globally**.
* `app.useGlobalPipes()` makes them **run for every request**, automatically.

---

## 🧱 Analogy

Imagine you run a restaurant 🍽️

You can:

* Have **one waiter** check each dish before it goes out → that’s a **local pipe**
* Or have **one chef at the kitchen door** check *every dish leaving the kitchen* → that’s a **global pipe**

So:

* Local pipe → checks data for one route.
* Global pipe → checks data for *every* route.

---

## 🧩 Example

### Without global pipes (local only)

You’d add a pipe manually:

```ts
@Post()
createUser(@Body(new ValidationPipe()) dto: CreateUserDto) {
  return dto;
}
```

That works, but you’d have to repeat `new ValidationPipe()` everywhere.

---

### With a **global pipe**

You set it once in `main.ts` (the app’s entry file):

```ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
```

Now every route that uses a DTO and `@Body()`, `@Param()`, etc.
will automatically be validated using that same pipe.

---

## 🧰 You can configure it, too

The global pipe can have options, for example:

```ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);
```

### What these options mean:

| Option                           | What it does                                                            |
| -------------------------------- | ----------------------------------------------------------------------- |
| **`whitelist: true`**            | Removes any fields that are *not* in your DTO (prevents extra junk)     |
| **`forbidNonWhitelisted: true`** | Instead of silently removing unknown fields, throw an error             |
| **`transform: true`**            | Automatically converts input to DTO instances using `class-transformer` |
| **`transformOptions`**           | Fine-tune transformation (e.g., enable implicit type conversion)        |

---

## 🧠 Why it’s useful

✅ You don’t have to repeat validation logic everywhere
✅ Keeps controllers clean
✅ Automatically protects your entire app
✅ Ensures consistent data structure on every route

---

## 🆚 Comparison with Express.js

In **Express**, we often use **middleware** for this kind of thing.

### Example:

```js
const express = require('express');
const app = express();

// Middleware that validates all requests
app.use((req, res, next) => {
  if (!req.body.name) return res.status(400).send('Name is required');
  next();
});
```

So in Express, we’d manually attach validation middleware.
In Nest.js, the equivalent global “pre-check” is done with:

```ts
app.useGlobalPipes(new ValidationPipe());
```

The difference:

* Express middleware handles *raw requests* (you check manually).
* Nest pipes handle *already-parsed arguments* (and work with DTOs, decorators, and metadata).

---

## ⚙️ Example Flow in Nest.js

Let’s visualize the full request path:

1. Request arrives → goes through **middleware**
2. Then through **guards**
3. Then **interceptors**
4. Then **pipes**
5. Then **controller** runs your logic

If you used `app.useGlobalPipes()`, that pipe runs in step 4 for *all* controllers.

---

## 🧩 Small example showing everything

### `main.ts`

```ts
app.useGlobalPipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
  }),
);
```

### `create-user.dto.ts`

```ts
import { IsString, IsInt } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsInt()
  age: number;
}
```

### `users.controller.ts`

```ts
@Post()
createUser(@Body() dto: CreateUserDto) {
  console.log(dto);
  return 'User created!';
}
```

### Send bad request

```json
{ "name": 123, "age": "not number" }
```

🚫 The global pipe catches it immediately:

```json
{
  "statusCode": 400,
  "message": [
    "name must be a string",
    "age must be an integer"
  ],
  "error": "Bad Request"
}
```

✅ You didn’t need to write any extra code in your controller.

---

## 🧠 TL;DR Summary

| Concept                    | Description                                                                   |
| -------------------------- | ----------------------------------------------------------------------------- |
| **Pipe**                   | A class that can transform or validate data before it reaches your controller |
| **Global Pipe**            | A pipe applied to *every route* automatically                                 |
| **`app.useGlobalPipes()`** | Registers global pipes in `main.ts`                                           |
| **Example use**            | `app.useGlobalPipes(new ValidationPipe({ transform: true }))`                 |
| **Analogy**                | A single “quality checker” that inspects every request before it’s handled    |

---

✅ **In one sentence:**

> `app.useGlobalPipes()` is how you tell Nest.js to apply a pipe (like `ValidationPipe`) to every route automatically — just like adding a global middleware in Express, but smarter and type-safe.

