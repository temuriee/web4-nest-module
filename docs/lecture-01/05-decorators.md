## 🧠 What Are Decorators?

A **decorator** in Nest.js (and in TypeScript in general) is a **special function** that **adds extra behavior or metadata** to a class, method, or property.

In simple terms:

> A decorator is like a **label or tag** you attach to code, so Nest.js knows how to treat it.

---

### 🧩 Analogy: “Name Tags” at a Conference

Imagine you’re at a big conference 🧑‍💻🏢.

Everyone has a **name tag** that tells others what they do:

- 🧑‍🏫 **@Speaker** → gets access to the stage
- 👩‍💻 **@Attendee** → can join sessions
- 👮 **@Staff** → can enter all areas

The name tag doesn’t change the person — it just tells the organizers **how to treat** them.

👉 That’s exactly what decorators do in Nest.js.

They **don’t change your code**, they just **tell Nest.js what your code represents** — like “this is a Controller,” “this is a route,” “this is injectable,” etc.

---

## 🧩 1. Decorators Are Functions

Under the hood, a decorator is just a **function** that gets information about what it’s attached to.

Example:

```ts
function MyDecorator(target) {
  console.log('Decorating:', target);
}
```

When you use it like this:

```ts
@MyDecorator
class MyClass {}
```

You’ll see:

```
Decorating: [class MyClass]
```

So `@MyDecorator` literally **runs at class definition time**, before your app starts.

---

## ⚙️ 2. Decorators in Nest.js

Nest.js uses decorators _everywhere_ to define structure and behavior.
Here are the main types 👇

---

### 🧩 Class Decorators — define _what_ something is

Example:

```ts
@Controller('users')
export class UsersController {}
```

- `@Controller('users')` tells Nest:

  > “This class handles HTTP routes under `/users`.”

Another example:

```ts
@Injectable()
export class UsersService {}
```

- `@Injectable()` tells Nest:

  > “This class can be injected as a dependency.”

That’s how Nest’s **dependency injection** system knows which classes are “providers.”

---

### 🧩 Method Decorators — define _what a method does_

Example:

```ts
@Controller('users')
export class UsersController {
  @Get()
  getAllUsers() {
    return ['Alice', 'Bob'];
  }

  @Post()
  createUser() {
    return 'User created';
  }
}
```

- `@Get()` → handles HTTP GET requests
- `@Post()` → handles HTTP POST requests

These decorators connect your class methods to specific **routes**.

So when you visit `/users`, Nest knows:

- which controller → `UsersController`
- which method → `getAllUsers()`

All thanks to those decorators.

---

### 🧩 Parameter Decorators — extract data from the request

Example:

```ts
@Get(':id')
getUser(@Param('id') id: string) {
  return `User ${id}`;
}
```

Here:

- `@Param('id')` tells Nest to **get the URL parameter** `:id`
  (like `/users/123` → id = `123`)

Other examples:

- `@Body()` → gets JSON body from the request
- `@Query()` → gets query string parameters
- `@Req()` and `@Res()` → get request/response objects

---

### 🧩 Property Decorators — inject things into class properties

Example:

```ts
@Injectable()
export class UsersService {
  @Inject('USER_REPOSITORY')
  private userRepo;
}
```

This tells Nest:

> “Please inject whatever is registered under the token `USER_REPOSITORY` into `userRepo`.”

Usually you don’t need this manually — Nest does it automatically when you use constructor injection:

```ts
constructor(private usersService: UsersService) {}
```

---

## ⚡ Compare to Express.js

Let’s compare a simple route in both frameworks.

### Express

```js
const express = require('express');
const app = express();

app.get('/users', (req, res) => {
  res.send('All users');
});

app.post('/users', (req, res) => {
  res.send('User created');
});
```

Everything is **manual**:

- You define routes by calling functions (`app.get`, `app.post`)
- You pass handlers directly

---

### Nest.js

```ts
@Controller('users')
export class UsersController {
  @Get()
  getAllUsers() {
    return 'All users';
  }

  @Post()
  createUser() {
    return 'User created';
  }
}
```

Here:

- `@Controller('users')` = defines route prefix
- `@Get()` and `@Post()` = define the HTTP methods

This is **declarative** — you describe _what_ something is, not _how_ to wire it.
Nest uses this metadata to automatically build and register routes behind the scenes.

---

## 🧱 Why Decorators Are Better (and Why Nest Uses Them)

| Express                                            | Nest.js                                         |
| -------------------------------------------------- | ----------------------------------------------- |
| You manually connect routes, middleware, and logic | You describe behavior using decorators          |
| Code is more imperative (step-by-step)             | Code is declarative (descriptive and organized) |
| No metadata system                                 | Decorators attach metadata Nest can read        |
| Harder to maintain in big apps                     | Easier to understand and scale                  |

In short:

> Nest uses decorators to build a **framework-level understanding of your app** — who handles what, what depends on what, and how things connect.

---

## 💡 Example: How Nest Reads Decorators Internally

When you write this:

```ts
@Controller('users')
export class UsersController {
  @Get()
  getAllUsers() {}
}
```

Nest actually **collects metadata** like:

```js
{
  type: 'controller',
  path: 'users',
  methods: [
    { method: 'get', path: '', handler: 'getAllUsers' }
  ]
}
```

Then, at startup, it automatically wires those routes into its internal router (built on top of Express or Fastify).

---

## 🧠 Summary: Types of Decorators in Nest.js

| Type          | Example                                       | Used For                       |
| ------------- | --------------------------------------------- | ------------------------------ |
| **Class**     | `@Controller()`, `@Injectable()`, `@Module()` | Define what a class represents |
| **Method**    | `@Get()`, `@Post()`, `@UseGuards()`           | Define what a function does    |
| **Parameter** | `@Param()`, `@Body()`, `@Query()`             | Extract request data           |
| **Property**  | `@Inject()`                                   | Inject dependencies            |

---

## ⚡ TL;DR

> A **decorator** is like a **name tag** or **label** that tells Nest what your class, function, or variable _means_ —
> so it can automatically wire everything together.

### !🧩 Scene 1 — No Name Tags

Imagine a huge tech conference.
Everyone’s walking around, but **nobody has a badge**.

- You don’t know who’s a speaker
- You don’t know who’s staff
- You don’t know who’s just attending

The organizers have to manually check a spreadsheet for everyone — that’s **Express.js** 😅.

---

### 🧩 Scene 2 — With Name Tags (Decorators)

Now, the organizers (Nest.js) give special **badges** (decorators):

| Person | Badge       | Meaning              |
| ------ | ----------- | -------------------- |
| Alice  | `@Speaker`  | Can go on stage      |
| Bob    | `@Staff`    | Can access backstage |
| Carol  | `@Attendee` | Can attend talks     |

So when the conference system starts, it can **scan badges** and know exactly how to treat each person.

That’s what Nest.js does at startup:
It scans your code, reads all decorators, and builds a big “map” of what each class or method means.

---

## ⚙️ Example in Nest.js Terms

Let’s translate this to code:

```ts
@Controller('users')
export class UsersController {
  @Get()
  getAllUsers() {
    return 'All users';
  }
}
```

What’s happening?

### Step 1. You write the decorators

`@Controller('users')` and `@Get()` are like giving **badges** to your class and method.

### Step 2. Nest.js scans your app at startup

It looks at all your files and finds:

- “Oh, this class has a `@Controller` badge — it’s a controller.”
- “Oh, this method has a `@Get()` badge — it’s a GET route.”

### Step 3. Nest builds a route map internally

Nest creates metadata like:

```js
{
  path: '/users',
  method: 'GET',
  handler: 'getAllUsers',
  controller: 'UsersController'
}
```

Then it automatically wires that into Express (or Fastify) under the hood.
So you never have to do `app.get('/users', ...)` manually — Nest does it for you.

---

## 🧠 So yes — decorators are **descriptions + instructions**

They **describe** what something _is_ (like a badge),
and **instruct** Nest.js _how to treat it_ (how it should behave).

| Example                | Meaning                                                         |
| ---------------------- | --------------------------------------------------------------- |
| `@Controller('users')` | Treat this class as a controller handling `/users` routes       |
| `@Get()`               | Treat this method as handling GET requests                      |
| `@Injectable()`        | Treat this class as a provider that can be injected into others |
| `@Module()`            | Treat this as a module that groups related code                 |
| `@Body()`              | Extract data from the HTTP body                                 |
| `@Param('id')`         | Extract a URL parameter named `id`                              |

---

## 🧠 Under the Hood — Metadata System

When you use a decorator, it doesn’t just put a “label” — it also stores metadata using TypeScript’s reflection API (`reflect-metadata`).

Example (simplified):

```ts
@Controller('users')
class UsersController {}
```

Internally, the decorator might do something like:

```ts
Reflect.defineMetadata('path', 'users', UsersController);
```

Later, Nest can read it:

```ts
Reflect.getMetadata('path', UsersController); // 'users'
```

That’s how Nest knows what each piece of code represents — it’s **metadata-driven** architecture.

---

## 🧩 Why This Is Powerful

Imagine a big app with 50+ features.

In Express, you’d manually wire 50 routes:

```js
app.use('/users', userRoutes);
app.use('/orders', orderRoutes);
...
```

In Nest, you just create:

```ts
@Module({
  imports: [UsersModule, OrdersModule, PaymentsModule],
})
export class AppModule {}
```

And because each module, controller, and route is decorated,
Nest can automatically connect everything behind the scenes.

---
