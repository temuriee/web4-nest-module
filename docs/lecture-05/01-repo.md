## 🧩 სრული აზრი:

```ts
constructor(
  @InjectRepository(User)
  private usersRepository: Repository<User>,
) {}
```

ეს ნიშნავს:
👉 როცა NestJS ქმნის `UsersService` ობიექტს,
ის **ავტომატურად გადასცემს (inject)** `User` entity-ს **Repository-ს**
მნიშვნელობას ცვლადში `usersRepository`.

---

## 🔍 რა არის Repository?

Repository TypeORM-ში არის ობიექტი,
რომელიც შეიცავს მეთოდებს მონაცემთა ბაზასთან სამუშაოდ —
მაგალითად:

- `find()` – ყველა მომხმარებელი
- `findOne()` – ერთი მომხმარებელი
- `save()` – შენახვა
- `remove()` – წაშლა
  და ა.შ.

ანუ ეს არის შენი "გადამყვანი" TypeScript ობიექტიდან SQL-ის სამყაროში 💾

---

## 🔹 რა აკეთებს კონკრეტულად თითო ნაწილი

| ნაწილი                    | რას ნიშნავს                                                                                      |
| ------------------------- | ------------------------------------------------------------------------------------------------ |
| `@InjectRepository(User)` | ეუბნება NestJS-ს: "მომეცი TypeORM-ის repository **User** entity-სთვის"                           |
| `private usersRepository` | ქმნის კლასის property-ს, რომ სხვა მეთოდებშიც შეგეძლოს ამ repository-ს გამოყენება                 |
| `Repository<User>`        | TypeORM-ის generic ტიპი — ნიშნავს რომ ეს repository მუშაობს **User** entity-ზე (არ სხვა ცხრილზე) |
| `constructor(...)`        | NestJS აქ ჩასვამს ამ dependency-ს როცა შექმნის `UsersService` instance-ს                         |

---

## 🧠 ანუ მთლიანობაში:

როცა აპი გაეშვება, NestJS:

1. დაინახავს რომ `UsersService` საჭიროებს `Repository<User>`-ს
2. მოძებნის TypeORM-ის `User` entity-ს
3. შექმნის ამ entity-სთვის repository ობიექტს
4. ჩაასმევს მას `usersRepository` property-ში ავტომატურად

---

## 🔧 როგორ იყენებ მერე:

შეგიძლია პირდაპირ იძახო:

```ts
const user = await this.usersRepository.findOne({ where: { id } });
const newUser = await this.usersRepository.save(createUserDto);
```

ანუ არ გჭირდება ცალკე SQL წერა — repository ამას შენს მაგივრად აკეთებს.

---

✅ **მოკლედ:**

> `@InjectRepository(User)` → უკავშირდება ბაზას
> `private usersRepository: Repository<User>` → გაძლევს TypeORM helper ობიექტს
> `constructor(...)` → NestJS ავტომატურად ჩასვამს ამ ობიექტს როცა სერვისი შეიქმნება
