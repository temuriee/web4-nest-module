

* **DTOs** → define what data should look like
* **class-validator** → checks if that data is valid

Now let’s look at **`class-transformer`**, which is the *missing link* that makes those two actually work together in Nest.js.

---

# 🧩 What Is `class-transformer`?

👉 `class-transformer` is a TypeScript library that helps **convert plain JavaScript objects (like `req.body`) into actual class instances** — and back again.

It’s used heavily by Nest.js to make DTOs + validation work automatically.

---

## 🧠 Why do we need it?

When you send a request to your API, the body looks like this:

```json
{
  "name": "Alice",
  "age": "25"
}
```

→ Notice: every value is a **string** (because HTTP sends text).
Even `"age"` is `"25"`, not a number.

If Nest just passed this object directly to your DTO class:

```ts
const dto = req.body;
```

Then your DTO wouldn’t actually *be* an instance of the class — it would just be a plain object.

`class-validator` works only on **class instances** (not raw objects).

That’s where **`class-transformer`** comes in.

---

## 🪄 What it does

It **transforms plain JSON objects** into **class instances** (and can do the reverse too).

### Example:

```ts
import { plainToInstance } from 'class-transformer';

class UserDto {
  name: string;
  age: number;
}

const plainObject = { name: 'Alice', age: '25' };
const dto = plainToInstance(UserDto, plainObject);

console.log(dto instanceof UserDto); // ✅ true
console.log(dto); // UserDto { name: 'Alice', age: '25' }
```

Now `dto` is a real instance of `UserDto`,
so `class-validator` can check its decorators (if it has any).

---

## ⚙️ In Nest.js (automatically done by `ValidationPipe`)

When you enable transformation:

```ts
app.useGlobalPipes(new ValidationPipe({ transform: true }));
```

Nest.js automatically:

1. Takes your incoming request body.
2. Uses `class-transformer` → `plainToInstance(CreateUserDto, req.body)`
3. Passes the instance to `class-validator` for validation.
4. Gives your controller the **typed and validated object**.

---

## 📦 Example with both together

```ts
import { IsString, IsInt } from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsInt()
  age: number;
}
```

### Controller

```ts
@Post()
createUser(@Body() dto: CreateUserDto) {
  console.log(typeof dto.age); // ✅ number (thanks to transform)
  return dto;
}
```

### Global Pipe

```ts
app.useGlobalPipes(
  new ValidationPipe({
    transform: true, // enables class-transformer
    whitelist: true,
  }),
);
```

If you send:

```json
{ "name": "Alice", "age": "25" }
```

Then:

* `class-transformer` converts `"25"` → `25`
* `class-validator` checks it’s an integer
* Controller receives `{ name: 'Alice', age: 25 }` as a proper DTO instance

---

## 🧰 You can also use transformation decorators

`class-transformer` also lets you **customize** how data is transformed using decorators like `@Type()` and `@Exclude()` / `@Expose()`.

### Example: Nested DTO

```ts
import { Type } from 'class-transformer';
import { ValidateNested, IsString } from 'class-validator';

class AddressDto {
  @IsString()
  city: string;
}

export class UserDto {
  @IsString()
  name: string;

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;
}
```

### Input JSON

```json
{
  "name": "Alice",
  "address": { "city": "Tbilisi" }
}
```

Here:

* `@Type(() => AddressDto)` tells `class-transformer` to **convert the nested `address` object** into an actual `AddressDto` instance.
* Then `class-validator` can validate it properly.

---

## 🧩 It can also transform output

You can use it to **clean or format responses** with decorators like:

```ts
import { Exclude, Expose } from 'class-transformer';

@Exclude() // hide everything by default
export class UserResponse {
  @Expose()
  name: string;

  @Expose()
  email: string;
}
```

Then:

```ts
const user = plainToInstance(UserResponse, dbUser, { excludeExtraneousValues: true });
```

This returns only the fields marked with `@Expose()` — useful for **hiding sensitive data** like passwords.

---

## ⚖️ Summary

| Concept                              | Purpose                                                             |
| ------------------------------------ | ------------------------------------------------------------------- |
| **class-validator**                  | Validates the *values* in your class (checks correctness)           |
| **class-transformer**                | Converts plain JS objects ↔ class instances (and can format fields) |
| **ValidationPipe (transform: true)** | Connects them both automatically in Nest.js                         |

---

## 🧠 Analogy time

Think of your request like a **package of text** 📦

| Step                                       | Tool                | Role                                 |
| ------------------------------------------ | ------------------- | ------------------------------------ |
| 🧾 Convert raw package to class instance   | `class-transformer` | “Unwrap and sort items into shelves” |
| 🔍 Check that every item matches the rules | `class-validator`   | “Inspect and approve items”          |
| 🧑‍🍳 Use clean, typed data in controller  | Nest controller     | “Cook with clean ingredients”        |

---

✅ **In short:**

> `class-transformer` makes your plain request body into a real TypeScript class instance — so `class-validator` can check it and Nest can give you properly typed data in your controller.

---
