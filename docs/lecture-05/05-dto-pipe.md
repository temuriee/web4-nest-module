## 1️⃣ **DTO (Data Transfer Object)**

### 💡 რა არის:

- კლასია, რომელიც აღწერს **როგორ უნდა გამოიყურებოდეს მონაცემები**, როცა იგზავნება request-ში ან response-ში.
- ძირითადად გამოიყენება **validation-ისა და typing-ისთვის**.

### 🛠 მიზანი:

1. აღწეროს request-ის სტრუქტურა
2. განსაზღვროს ტიპები TypeScript-ში (`string`, `number`, array...)
3. განსაზღვროს ველის validation (მაგალითად `@IsEmail()`, `@MinLength()`)

### 🔹 მაგალითი:

```ts
export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(3)
  firstName: string;

  @MinLength(3)
  lastName: string;
}
```

- აქ DTO ამბობს: "მომხმარებლის შექმნის request უნდა შეიცავდეს email, firstName და lastName-ას, validation უნდა ჩაითვალოს".
- **მაგალითად:** თუ firstName-ს მხოლოდ 2 სიმბოლო აქვს, validation გამოაგდებს შეცდომას.

---

## 2️⃣ **Pipe**

### 💡 რა არის:

- პატარა ფუნქცია / კლასი, რომელიც **გადაამუშავებს ან ამოწმებს მონაცემებს** **request-ის მიღებისას**.
- NestJS-ში Pipe-ები მუშაობენ **მინიშნულ parameter-ზე**, **route handler-ზე**, ან **global-ზე**.

### 🛠 მიზანი:

1. Validate — მონაცემების შემოწმება (მაგ. `ValidationPipe`)
2. Transform — ტიპების კონვერტაცია (მაგ. string → number)
3. Sanitize / custom logic — ნებისმიერი სხვა preprocessing

### 🔹 მაგალითი:

```ts
@Get(':id')
getUser(@Param('id', ParseIntPipe) id: number) {
  // id უკვე integer ტიპისაა, თუ ვერ გარდაიქმნება, NestJS აგდებს error
  return this.userService.findOneById(id);
}
```

- `ParseIntPipe` გარდაქმნის string ტიპის `id`-ს number ტიპში.
- თუ request-ში id="abc", pipe გამოაგდებს **BadRequestException**-ს.

---

## 3️⃣ **ძირითადი განსხვავება**

| პარამეტრი  | DTO                                                             | Pipe                                                          |
| ---------- | --------------------------------------------------------------- | ------------------------------------------------------------- |
| როლი       | აღწერს **მონაცემთა სტრუქტურას და validation**                   | **ამოწმებს/გადამუშავებს** კონკრეტულ მონაცემს request-ში       |
| ტიპი       | კლასია                                                          | კლასია ან ფუნქცია                                             |
| validation | ხშირად გამოიყენება decorators-ით (`@IsEmail()`, `@MinLength()`) | შეიძლება აკეთოს validation, type conversion, sanitize და ა.შ. |
| გამოყენება | request body, query, params                                     | route parameters, body, query, headers, global                |
| მაგალითი   | `CreateUserDto`                                                 | `ValidationPipe`, `ParseIntPipe`, custom pipe                 |

---

## 4️⃣ როგორ მუშაობენ ერთად

```ts
@Post()
createUser(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
  return this.userService.createUser(createUserDto);
}
```

- `CreateUserDto` ამბობს, **რა უნდა შეიცავდეს request**
- `ValidationPipe` ამოწმებს, რომ ეს request შეესაბამება DTO-ს
- თუ validation გაიარა → controller-მდე მიდის
- თუ validation ვერ გაიარა → NestJS აგდებს **400 Bad Request**

---

💡 მოკლედ:

> **DTO** = data structure + rules
> **Pipe** = processor / validator / transformer
